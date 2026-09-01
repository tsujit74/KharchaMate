import Notification from "../models/Notification.js";
import { getIO } from "../sockets/socket.js";

export const notifyUser = async ({
  userId,
  actor = null,
  groupId = null,
  title,
  message,
  type,
  link = null,
  relatedId = null,
}) => {
  const notification = await Notification.create({
    user: userId,
    actor,
    group: groupId,
    title,
    message,
    type,
    link,
    relatedId,
  });

  const populatedNotification = await Notification.findById(notification._id)
    .populate("actor", "name email")
    .populate("group", "name");

  getIO()
    .to(`user:${userId}`)
    .emit("notification:new", populatedNotification);

  return populatedNotification;
};