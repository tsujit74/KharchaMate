import express from "express";
import {
  addExpense,
  getGroupExpenses,
  getMonthlySummary,
  getMyExpenses,
  getRecentExpenses,
} from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { groupContext } from "../middleware/groupContext.js";

const router = express.Router();

router.post("/add", authMiddleware, addExpense);
router.get("/recent", authMiddleware, getRecentExpenses);
router.get("/my/expenses", authMiddleware, getMyExpenses);
router.get("/my/monthly-summary", authMiddleware, getMonthlySummary);
router.get("/:groupId", authMiddleware, groupContext, getGroupExpenses);

export default router;
