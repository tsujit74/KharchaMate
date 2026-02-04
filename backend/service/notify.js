import Notification from "../models/Notification.js";

export const notifyUser = async ({
  userId,
  actor = null,
  title,
  message,
  type,
  link = null,
  relatedId = null,
}) => {
  return Notification.create({
    user: userId,
    actor,
    title,
    message,
    type,
    link,
    relatedId,
  });
};
