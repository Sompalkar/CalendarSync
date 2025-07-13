import express from "express"
import { AuthController } from "../controllers/authController"

const router = express.Router()
const authController = new AuthController()

router.get("/google", authController.initiateGoogleAuth)
router.get("/google/callback", authController.handleGoogleCallback)
router.post("/logout", authController.logout)
router.get("/me", authController.getCurrentUser)

export default router
