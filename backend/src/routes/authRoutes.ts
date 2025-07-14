import express from "express"
import { AuthController } from "../controllers/authController"
import { authRateLimit } from "../middleware/rateLimiter"
import { authenticateToken } from "../middleware/auth"

const router = express.Router()
const authController = new AuthController()

// Apply rate limiting to auth routes
router.use(authRateLimit)

router.get("/google", authController.initiateGoogleAuth)
router.get("/google/callback", authController.handleGoogleCallback)
router.post("/logout", authController.logout)
router.get("/me", authenticateToken, authController.getCurrentUser)

export default router
