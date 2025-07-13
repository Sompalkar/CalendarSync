import express from "express"
import { CalendarController } from "../controllers/calendarController"
import { authenticateToken } from "../middleware/auth"

const router = express.Router()
const calendarController = new CalendarController()

// All routes require authentication
router.use(authenticateToken)

router.get("/events", calendarController.getEvents)
router.post("/events", calendarController.createEvent)
router.put("/events/:eventId", calendarController.updateEvent)
router.delete("/events/:eventId", calendarController.deleteEvent)
router.post("/sync", calendarController.syncEvents)

export default router
