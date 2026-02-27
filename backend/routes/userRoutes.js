import express from "express";
import { getUserById } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// GET /api/users/:id
router.get("/:id", authMiddleware, getUserById);

export default router;
