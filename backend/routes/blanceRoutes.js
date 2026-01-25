import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getGroupBalance } from "../controllers/blanceController.js";
import { getGroupSettlement } from "../controllers/settlementController.js";

const router = express.Router();

router.get("/:groupId", authMiddleware, getGroupBalance);
router.get(
  "/groups/:groupId/settlement",
  authMiddleware,
  getGroupSettlement
);


export default router;
