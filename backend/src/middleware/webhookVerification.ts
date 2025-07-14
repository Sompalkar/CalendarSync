import type { Request, Response, NextFunction } from "express"

export const verifyWebhookSignature = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Google Calendar webhooks don't use HMAC signatures like GitHub
    // Instead, we verify the channel ID and resource ID match our records
    const channelId = req.headers["x-goog-channel-id"] as string
    const resourceId = req.headers["x-goog-resource-id"] as string
    const channelToken = req.headers["x-goog-channel-token"] as string

    if (!channelId || !resourceId) {
      console.log("Missing required webhook headers")
      return res.status(400).json({ error: "Missing required headers" })
    }

    // The channel token should match the user ID we set when creating the webhook
    if (channelToken && !channelToken.match(/^[a-f0-9]{24}$/)) {
      console.log("Invalid channel token format")
      return res.status(400).json({ error: "Invalid channel token" })
    }

    // Add verified headers to request for use in controller
    req.webhookData = {
      channelId,
      resourceId,
      userId: channelToken,
      resourceState: req.headers["x-goog-resource-state"] as string,
    }

    next()
  } catch (error) {
    console.error("Webhook verification error:", error)
    res.status(400).json({ error: "Webhook verification failed" })
  }
}

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      webhookData?: {
        channelId: string
        resourceId: string
        userId: string
        resourceState: string
      }
    }
  }
}
