import express from "express";
import {
  addExpense,
  getGroupExpenses,
} from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { groupContext } from "../middleware/groupContext.js";

const router = express.Router();

router.post("/add", authMiddleware, addExpense);
router.get("/:groupId", authMiddleware,groupContext, getGroupExpenses);

export default router;
