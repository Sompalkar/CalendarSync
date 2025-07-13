import express from "express"
import { WebhookController } from "../controllers/webhookController"

const router = express.Router()
const webhookController = new WebhookController()

router.post("/calendar", webhookController.handleCalendarWebhook)

export default router
