import type { Request, Response } from "express";
import { oauth2Client, SCOPES } from "../config/google";
import User from "../models/User";
import { generateJWT, getUserInfo } from "../services/authService";
import { setupWebhook } from "../services/webhookService";
import type { AuthRequest } from "../middleware/auth";

export class AuthController {
  // 1. Initiate Google OAuth
  async initiateGoogleAuth(req: Request, res: Response): Promise<void> {
    try {
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
  async handleGoogleCallback(req: Request, res: Response): Promise<void> {
    try {
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
      } else {
        user.accessToken = tokens.access_token!;
        user.refreshToken = tokens.refresh_token!;
        user.tokenExpiry = new Date(tokens.expiry_date!);
        user.name = userInfo.name!;
      }
      await user.save();
      const userId = (user._id as any).toString();
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
      console.error("Auth callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
    }
  }

  // 3. Logout: clear cookie
  async logout(req: Request, res: Response): Promise<void> {
    try {
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
  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }
      res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture,
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ error: "Failed to get user info" });
    }
  }
}
