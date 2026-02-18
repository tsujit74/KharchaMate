import express from "express";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
      user: req.user.id,
    })
      .populate("actor", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
});

router.patch("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true },
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notifications" });
  }
});

router.get("/unread-count", authMiddleware, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
});

export default router;
