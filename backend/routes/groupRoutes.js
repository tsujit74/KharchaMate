import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createGroup,
  addMember,
  getMyGroups,
  getGroupById,
  removeMember,
  toggleGroupStatus,
} from "../controllers/groupController.js";

const router = express.Router();


router.post("/create", authMiddleware, createGroup);
router.get("/my-groups", authMiddleware, getMyGroups);
router.get("/:groupId", authMiddleware, getGroupById);


router.post("/add-member", authMiddleware, addMember);
router.post("/remove-member", authMiddleware, removeMember);


router.patch(
  "/:groupId/toggle-status",
  authMiddleware,
  toggleGroupStatus
);

export default router;
