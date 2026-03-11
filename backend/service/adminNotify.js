import AdminNotification from "../models/AdminNotification.js";

export const notifyAdmin = async ({
  title,
  message,
  type,
  relatedId = null,
}) => {
  return AdminNotification.create({
    title,
    message,
    type,
    relatedId,
  });
};