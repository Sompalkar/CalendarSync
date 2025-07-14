import express from "express"
import { WebhookController } from "../controllers/webhookController"
import { verifyWebhookSignature } from "../middleware/webhookVerification"
import { webhookRateLimit } from "../middleware/rateLimiter"

const router = express.Router()
const webhookController = new WebhookController()

// Apply rate limiting and verification to webhook routes
router.use(webhookRateLimit)
router.post("/calendar", verifyWebhookSignature, webhookController.handleCalendarWebhook)

export default router
