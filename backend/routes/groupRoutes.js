import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  groupContext,
  isAdmin,
  checkGroupActive,
} from "../middleware/groupContext.js";

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

router.get("/:groupId", authMiddleware, groupContext, getGroupById);

router.post(
  "/add-member",
  authMiddleware,
  groupContext,
  checkGroupActive,
  isAdmin,
  addMember,
);

router.post(
  "/remove-member",
  authMiddleware,
  groupContext,
  checkGroupActive,
  isAdmin,
  removeMember,
);

router.patch(
  "/:groupId/toggle-status",
  authMiddleware,
  groupContext,
  isAdmin,
  toggleGroupStatus
);


export default router;
