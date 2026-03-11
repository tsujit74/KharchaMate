import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  blockGroup,
  blockUser,
  createAnnouncement,
  deleteAnnouncement,
  getAdminNotifications,
  getAdminStats,
  getAdminUnreadCount,
  getAllAnnouncements,
  getAllGroups,
  getAllUsers,
  getUserDetailsAdmin,
  getUserGroupsAdmin,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  toggleAnnouncement,
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

/* ANNOUNCEMENTS */

router.post(
  "/announcements",
  authMiddleware,
  adminMiddleware,
  createAnnouncement
);

router.get(
  "/announcements",
  authMiddleware,
  adminMiddleware,
  getAllAnnouncements
);

router.patch(
  "/announcements/:id/toggle",
  authMiddleware,
  adminMiddleware,
  toggleAnnouncement
);

router.delete(
  "/announcements/:id",
  authMiddleware,
  adminMiddleware,
  deleteAnnouncement
);

/* ADMIN NOTIFICATIONS */

router.get(
  "/notifications",
  authMiddleware,
  adminMiddleware,
  getAdminNotifications
);

router.get(
  "/notifications/unread-count",
  authMiddleware,
  adminMiddleware,
  getAdminUnreadCount
);

router.patch(
  "/notifications/:id/read",
  authMiddleware,
  adminMiddleware,
  markAdminNotificationRead
);

router.patch(
  "/notifications/read-all",
  authMiddleware,
  adminMiddleware,
  markAllAdminNotificationsRead
);


export default router;
