import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getGroupSettlement,
  getPendingSettlements,
  markPaymentDone,
} from "../controllers/settlementController.js";
import { groupContext } from "../middleware/groupContext.js";

const router = express.Router();

router.get(
  "/groups/:groupId/settlement",
  authMiddleware,
  groupContext,
  getGroupSettlement
);

router.post(
  "/groups/:groupId/pay",
  authMiddleware,
  groupContext,
  markPaymentDone
);

router.get("/pending", authMiddleware, getPendingSettlements);

export default router;
