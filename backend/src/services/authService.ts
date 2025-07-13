import jwt from "jsonwebtoken"
import { oauth2Client } from "../config/google"
import { google } from "googleapis" // Declare the google variable
import type { IUser } from "../models/User"
import { createError } from "../middleware/errorHandler"

export const generateJWT = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" })
}

export const refreshAccessToken = async (user: IUser): Promise<void> => {
  try {
    oauth2Client.setCredentials({
      refresh_token: user.refreshToken,
    })

    const { credentials } = await oauth2Client.refreshAccessToken()

    if (!credentials.access_token) {
      throw createError("Failed to refresh access token", 401)
    }

    // Update user with new tokens
    user.accessToken = credentials.access_token
    user.tokenExpiry = new Date(credentials.expiry_date || Date.now() + 3600000)

    if (credentials.refresh_token) {
      user.refreshToken = credentials.refresh_token
    }

    await user.save()

    // Update oauth2Client with new credentials
    oauth2Client.setCredentials({
      access_token: credentials.access_token,
      refresh_token: user.refreshToken,
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    throw createError("Failed to refresh access token", 401)
  }
}

export const getUserInfo = async (accessToken: string) => {
  try {
    oauth2Client.setCredentials({ access_token: accessToken })

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client })
    const { data } = await oauth2.userinfo.get()

    return data
  } catch (error) {
    console.error("Get user info error:", error)
    throw createError("Failed to get user information", 400)
  }
}
