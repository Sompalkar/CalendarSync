import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User, { type IUser } from "../models/User"
import { refreshAccessToken } from "../services/authService"

export interface AuthRequest extends Request {
  user?: IUser
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ error: "Access token required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ error: "User not found" })
    }

    // Check if access token is expired
    if (new Date() >= user.tokenExpiry) {
      try {
        await refreshAccessToken(user)
      } catch (error) {
        console.error("Token refresh failed:", error)
        return res.status(401).json({ error: "Token refresh failed" })
      }
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    return res.status(401).json({ error: "Invalid token" })
  }
}
