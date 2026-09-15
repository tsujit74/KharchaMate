import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  confirmSettlement,
  getGroupSettlement,
  getMySettlementHistory,
  getPendingSettlements,
  getSettlementRequests,
  getUserNetBalance,
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

router.patch(
  "/settlements/:settlementId/confirm",
  authMiddleware,
  confirmSettlement
);

router.get(
  "/settlement-requests",
  authMiddleware,
  getSettlementRequests
);

router.get("/my-history", authMiddleware, getMySettlementHistory);

router.get("/my-net-balance", authMiddleware, getUserNetBalance);

router.get("/pending", authMiddleware, getPendingSettlements);

export default router;
