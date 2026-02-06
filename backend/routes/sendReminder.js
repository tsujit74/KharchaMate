import express from "express";
import { checkReminder, sendReminder } from "../controllers/reminderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authMiddleware, sendReminder);
router.get("/check", authMiddleware, checkReminder);

export default router;
