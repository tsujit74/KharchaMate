import Reminder from "../models/Reminder.js";
import Notification from "../models/Notification.js";

const REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const sendReminder = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { groupId, toUserId, amount } = req.body;

    if (!groupId || !toUserId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "You cannot remind yourself" });
    }

    const lastReminder = await Reminder.findOne({
      fromUser: fromUserId,
      toUser: toUserId,
      group: groupId,
    }).sort({ sentAt: -1 });

    if (
      lastReminder &&
      Date.now() - lastReminder.sentAt.getTime() < REMINDER_COOLDOWN_MS
    ) {
      return res.status(429).json({
        message: "Reminder already sent recently",
      });
    }

    const reminder = await Reminder.create({
      group: groupId,
      fromUser: fromUserId,
      toUser: toUserId,
      amount,
      channel: "IN_APP",
      status: "SENT",
      sentAt: new Date(),
    });

    await Notification.create({
      user: toUserId,
      actor: fromUserId,
      title: "Payment Reminder",
      message: `You have a pending payment of ₹${amount}`,
      type: "REMINDER",
      relatedId: reminder._id,
    });

    return res.status(201).json({
      message: "Reminder sent successfully",
      reminder,
    });
  } catch (error) {
    console.error("SEND REMINDER ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
