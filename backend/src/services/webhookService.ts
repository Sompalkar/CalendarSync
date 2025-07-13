import { calendar, oauth2Client } from "../config/google"
import User from "../models/User"
import { syncUserEvents } from "./calendarService"
import { refreshAccessToken } from "./authService"

export const setupWebhook = async (userId: string): Promise<void> => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    })

    if (new Date() >= user.tokenExpiry) {
      await refreshAccessToken(user)
    }

    const channelId = `channel-${userId}-${Date.now()}`
    const webhookUrl = `${process.env.BACKEND_URL}/api/webhook/calendar`

    const response = await calendar.events.watch({
      calendarId: "primary",
      requestBody: {
        id: channelId,
        type: "web_hook",
        address: webhookUrl,
        token: userId, // Pass user ID as token for identification
      },
    })

    // Update user with webhook info
    user.webhookChannelId = channelId
    user.webhookResourceId = response.data.resourceId
    user.webhookExpiration = new Date(Number.parseInt(response.data.expiration || "0"))
    await user.save()

    console.log(`Webhook setup for user ${userId}:`, response.data)
  } catch (error) {
    console.error("Webhook setup error:", error)
    throw error
  }
}

export const handleWebhookNotification = async (channelId: string, resourceId: string): Promise<void> => {
  try {
    // Find user by webhook channel ID
    const user = await User.findOne({ webhookChannelId: channelId })
    if (!user) {
      console.log("User not found for webhook channel:", channelId)
      return
    }

    console.log(`Webhook notification received for user ${user._id}`)

    // Sync events for this user
    await syncUserEvents(user)
  } catch (error) {
    console.error("Webhook notification handling error:", error)
  }
}

export const renewWebhook = async (userId: string): Promise<void> => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      return
    }

    // Stop existing webhook if it exists
    if (user.webhookChannelId && user.webhookResourceId) {
      try {
        oauth2Client.setCredentials({
          access_token: user.accessToken,
          refresh_token: user.refreshToken,
        })

        await calendar.channels.stop({
          requestBody: {
            id: user.webhookChannelId,
            resourceId: user.webhookResourceId,
          },
        })
      } catch (error) {
        console.log("Error stopping existing webhook:", error)
      }
    }

    // Setup new webhook
    await setupWebhook(userId)
  } catch (error) {
    console.error("Webhook renewal error:", error)
  }
}

export const setupWebhookRenewal = (): void => {
  // Check for expiring webhooks every hour
  setInterval(
    async () => {
      try {
        const expiringWebhooks = await User.find({
          webhookExpiration: {
            $lt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expiring in next 24 hours
          },
          webhookChannelId: { $exists: true },
        })

        for (const user of expiringWebhooks) {
          console.log(`Renewing webhook for user ${user._id}`)
          await renewWebhook(user._id)
        }
      } catch (error) {
        console.error("Webhook renewal check error:", error)
      }
    },
    60 * 60 * 1000,
  ) // Every hour
}
