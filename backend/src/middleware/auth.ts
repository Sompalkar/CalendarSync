import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../models/User";
import { refreshAccessToken } from "../services/authService";

// AuthRequest extends all standard Express Request properties (method, url, body, params, cookies, etc.)
// and adds an optional user property for authenticated routes.
export interface AuthRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: IUser;
  cookies?: { [key: string]: string };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // Check if access token is expired
    if (new Date() >= user.tokenExpiry) {
      try {
        await refreshAccessToken(user);
      } catch (error) {
        console.error("Token refresh failed:", error);
        res.status(401).json({ error: "Token refresh failed" });
        return;
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
