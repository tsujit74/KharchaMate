import express from "express";
import {
  createGroup,
  addMember,
  getMyGroups,
  getGroupById,
} from "../controllers/groupController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createGroup);
router.post("/add-member", authMiddleware, addMember);
router.get("/my-groups", authMiddleware, getMyGroups);
router.get("/:groupId", authMiddleware, getGroupById);


export default router;
