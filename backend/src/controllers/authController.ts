import { Request, Response } from "express";
import { oauth2Client, SCOPES } from "../config/google";
import User, { IUser } from "../models/User";
import { generateJWT, getUserInfo } from "../services/authService";
import { setupWebhook } from "../services/webhookService";
import { AuthRequest } from "../middleware/auth";
import bcrypt from "bcryptjs";

export class AuthController {
  // 1. Initiate Google OAuth
  async initiateGoogleAuth(req: Request, res: Response): Promise<void> {
    try {
      console.log("[AUTH] Initiate Google OAuth request", req.method, req.url);
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent",
      });
      res.redirect(authUrl);
    } catch (error) {
      console.error("Auth initiation error:", error);
      res.status(500).json({ error: "Failed to initiate authentication" });
    }
  }

  // 2. Handle Google OAuth callback, set cookie, redirect to frontend
  async handleGoogleCallback(req: Request<{}, any, any, { code?: string }>, res: Response): Promise<void> {
    try {
      console.log("[AUTH] Google OAuth callback", req.method, req.url, req.query);
      const { code } = req.query;
      if (!code) {
        res.status(400).json({ error: "Authorization code required" });
        return;
      }
      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);
      // Get user info
      const userInfo = await getUserInfo(tokens.access_token!);
      // Find or create user
      let user = await User.findOne({ googleId: userInfo.id });
      if (!user) {
        user = new User({
          googleId: userInfo.id!,
          email: userInfo.email!,
          name: userInfo.name!,
          picture: userInfo.picture,
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token!,
          tokenExpiry: new Date(tokens.expiry_date!),
        });
        console.log("[AUTH] Created new Google user", userInfo.email);
      } else {
        user.accessToken = tokens.access_token!;
        user.refreshToken = tokens.refresh_token!;
        user.tokenExpiry = new Date(tokens.expiry_date!);
        user.name = userInfo.name!;
        console.log("[AUTH] Updated Google user", userInfo.email);
      }
      await user.save();
      const userId = user._id.toString();
      const jwtToken = generateJWT(userId);
      // Set cookie with best practices
      res.cookie("jwt", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      try {
        await setupWebhook(userId);
      } catch (webhookError) {
        console.error("Webhook setup failed:", webhookError);
      }
      // Use HTML+JS redirect for reliability
      res.send(`
        <html>
          <head>
            <script>
              window.location.href = "${process.env.FRONTEND_URL}/calendar";
            </script>
          </head>
          <body>Redirecting...</body>
        </html>
      `);
    } catch (error) {
      console.error("Google callback error:", error);
      res.status(500).json({ error: "Failed to handle Google callback" });
    }
  }

  // 3. Logout: clear cookie
  async logout(req: Request, res: Response): Promise<void> {
    try {
      console.log("[AUTH] Logout request", req.method, req.url);
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Failed to logout" });
    }
  }

  // 4. Persistent login: /api/auth/me
  async getCurrentUser(req: AuthRequest<{}, any, any, any>, res: Response): Promise<void> {
    try {
      console.log("[AUTH] Get current user", req.method, req.url, req.user?._id);
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }
      res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture,
        isGoogleConnected: req.user.isGoogleConnected,
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ error: "Failed to get user info" });
    }
  }

  // Registration endpoint
  async register(req: Request<{}, any, { email: string; password: string; name: string }>, res: Response): Promise<void> {
    try {
      console.log("[AUTH] Register request", req.method, req.url, req.body);
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        res.status(400).json({ error: "Email, password, and name are required" });
        return;
      }
      const existing = await User.findOne({ email });
      if (existing) {
        res.status(409).json({ error: "Email already registered" });
        return;
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        passwordHash,
        name,
        isGoogleConnected: false,
      });
      await user.save();
      const jwtToken = generateJWT(user._id.toString());
      res.cookie("jwt", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      console.log("[AUTH] Registered new user", email);
      res.status(201).json({ message: "Registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register" });
    }
  }

  // Login endpoint
  async login(req: Request<{}, any, { email: string; password: string }>, res: Response): Promise<void> {
    try {
      console.log("[AUTH] Login request", req.method, req.url, req.body);
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }
      const user = await User.findOne({ email });
      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      const jwtToken = generateJWT(user._id.toString());
      res.cookie("jwt", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      console.log("[AUTH] Login successful");
      res.json({ message: "Logged in successfully" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  }

  // Google connect endpoint (for logged-in users)
  async connectGoogle(req: AuthRequest<{}, any, { code: string }, any>, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }
      const { code } = req.body;
      if (!code) {
        res.status(400).json({ error: "Authorization code required" });
        return;
      }
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);
      const userInfo = await getUserInfo(tokens.access_token!);
      req.user.googleId = userInfo.id;
      req.user.isGoogleConnected = true;
      req.user.accessToken = tokens.access_token!;
      req.user.refreshToken = tokens.refresh_token!;
      req.user.tokenExpiry = new Date(tokens.expiry_date!);
      req.user.name = userInfo.name!;
      req.user.picture = userInfo.picture;
      await req.user.save();
      console.log("[AUTH] Google account connected for user", req.user.email);
      res.json({ message: "Google account connected" });
    } catch (error) {
      console.error("Google connect error:", error);
      res.status(500).json({ error: "Failed to connect Google account" });
    }
  }
}