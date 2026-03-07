import express from "express";
import {
  createTicket,
  getMyTickets,
  getTicketById,
  replyToTicket,
} from "../controllers/TicketController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminReplyTicket, getAllTickets } from "../controllers/adminController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createTicket);
router.get("/my", authMiddleware, getMyTickets);
router.get("/:id", authMiddleware, getTicketById);
router.post("/:id/reply", authMiddleware, replyToTicket);

router.get("/admin/all", authMiddleware, adminMiddleware, getAllTickets);
router.post("/admin/:id/reply", authMiddleware, adminMiddleware, adminReplyTicket);

export default router;