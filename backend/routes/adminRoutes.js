import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  blockGroup,
  blockUser,
  getAdminStats,
  getAllGroups,
  getAllUsers,
  getUserDetailsAdmin,
  getUserGroupsAdmin,
  unblockGroup,
  unblockUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.patch("/user/:id/block", authMiddleware, adminMiddleware, blockUser);
router.patch("/user/:id/unblock", authMiddleware, adminMiddleware, unblockUser);

router.get("/groups", authMiddleware, adminMiddleware, getAllGroups);
router.patch("/groups/:id/block", authMiddleware, adminMiddleware, blockGroup);
router.patch("/groups/:id/unblock", authMiddleware, adminMiddleware, unblockGroup);

router.get(
  "/users/:userId",
  authMiddleware,
  adminMiddleware,
  getUserDetailsAdmin
);

router.get(
  "/users/:userId/groups",
  authMiddleware,
  adminMiddleware,
  getUserGroupsAdmin
);

export default router;
