import type { Request, Response } from "express"
import { handleWebhookNotification } from "../services/webhookService"

export class WebhookController {
  async handleCalendarWebhook(req: Request, res: Response): Promise<void> {
    try {
      const channelId = req.headers["x-goog-channel-id"] as string
      const resourceId = req.headers["x-goog-resource-id"] as string
      const resourceState = req.headers["x-goog-resource-state"] as string

      console.log("Webhook received:", {
        channelId,
        resourceId,
        resourceState,
        headers: req.headers,
      })

      // Only process 'exists' state (when events change)
      if (resourceState === "exists") {
        await handleWebhookNotification(channelId, resourceId)
      }

      // Always respond with 200 to acknowledge receipt
      res.status(200).send("OK")
    } catch (error) {
      console.error("Webhook handling error:", error)
      // Still respond with 200 to prevent Google from retrying
      res.status(200).send("OK")
    }
  }
}
