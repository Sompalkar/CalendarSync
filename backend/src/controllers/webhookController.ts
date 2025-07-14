import type { Request, Response } from "express"
import { handleWebhookNotification } from "../services/webhookService"

export class WebhookController {
  async handleCalendarWebhook(req: Request, res: Response) {
    try {
      const webhookData = req.webhookData

      if (!webhookData) {
        console.log("No webhook data found in request")
        return res.status(400).send("Bad Request")
      }

      console.log("Webhook received:", {
        channelId: webhookData.channelId,
        resourceId: webhookData.resourceId,
        resourceState: webhookData.resourceState,
        userId: webhookData.userId,
      })

      // Only process 'exists' state (when events change)
      if (webhookData.resourceState === "exists") {
        // Process webhook asynchronously to respond quickly
        setImmediate(async () => {
          try {
            await handleWebhookNotification(webhookData.channelId, webhookData.resourceId)
          } catch (error) {
            console.error("Async webhook processing error:", error)
          }
        })
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
