import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getGroupBalance } from "../controllers/blanceController.js";

const router = express.Router();

router.get("/:groupId", authMiddleware, getGroupBalance);

export default router;
