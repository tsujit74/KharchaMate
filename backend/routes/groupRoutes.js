import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  groupContext,
  isAdmin,
  checkGroupActive,
  checkGroupBlocked,
} from "../middleware/groupContext.js";

import {
  createGroup,
  addMember,
  getMyGroups,
  getGroupById,
  removeMember,
  toggleGroupStatus,
  updateGroupName,
  searchUsers,
  getRecentUsers,
} from "../controllers/groupController.js";

const router = express.Router();

router.post("/create", authMiddleware, createGroup);
router.get("/my-groups", authMiddleware, getMyGroups);

router.get("/:groupId", authMiddleware, groupContext, getGroupById);

router.post(
  "/add-member",
  authMiddleware,
  groupContext,
  checkGroupBlocked,
  checkGroupActive,
  isAdmin,
  addMember,
);

router.post(
  "/remove-member",
  authMiddleware,
  groupContext,
  checkGroupBlocked,
  checkGroupActive,
  isAdmin,
  removeMember,
);

router.patch(
  "/:groupId/toggle-status",
  authMiddleware,
  groupContext,
  checkGroupBlocked,
  isAdmin,
  toggleGroupStatus
);

router.patch(
  "/:groupId/update-name",
  authMiddleware,
  groupContext,
  checkGroupBlocked,
  checkGroupActive,
  isAdmin,
  updateGroupName
);

router.get("/users/search", authMiddleware, searchUsers);
router.get("/users/recent", authMiddleware, getRecentUsers);


export default router;
