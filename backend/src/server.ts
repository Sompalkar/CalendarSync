import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/authRoutes"
import calendarRoutes from "./routes/calendarRoutes"
import webhookRoutes from "./routes/webhookRoutes"
import { errorHandler } from "./middleware/errorHandler"
import { setupWebhookRenewal } from "./services/webhookService"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/calendar-sync")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/calendar", calendarRoutes)
app.use("/api/webhook", webhookRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)

  // Setup webhook renewal service
  setupWebhookRenewal()
})

export default app
