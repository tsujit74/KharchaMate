import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addExpense,
  deleteExpense,
  getGroupExpenses,
  getMonthlySummary,
  getMyExpenses,
  getMyInsights,
  getRecentExpenses,
  updateExpense,
} from "../controllers/expenseController.js";

import {
  groupContext,
  checkGroupActive,
} from "../middleware/groupContext.js";

const router = express.Router();


router.post("/add", authMiddleware, groupContext, checkGroupActive, addExpense);





router.get("/recent", authMiddleware, getRecentExpenses);
router.get("/my/expenses", authMiddleware, getMyExpenses);
router.get("/my/monthly-summary", authMiddleware, getMonthlySummary);
router.get("/my/insights", authMiddleware, getMyInsights); 
router.get("/:groupId", authMiddleware, groupContext, getGroupExpenses);


router.put("/:expenseId", authMiddleware, updateExpense);


router.delete("/:expenseId", authMiddleware, deleteExpense);

export default router;
