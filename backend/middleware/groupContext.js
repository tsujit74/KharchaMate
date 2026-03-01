import mongoose from "mongoose";
import Group from "../models/Group.js";

export const groupContext = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const groupId = req.params.groupId || req.body.groupId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some(
      (id) => id.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this group",
      });
    }

    req.group = group;
    next();
  } catch (err) {
    next(err);
  }
};

export const isAdmin = (req, res, next) => {
  const userId = req.user.id;
  const group = req.group;

  const isAdmin = group.admins.some(
    (id) => id.toString() === userId.toString(),
  );

  if (!isAdmin) {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

export const isMember = (req, res, next) => {
  const userId = req.user.id;
  const group = req.group;

  const isMember = group.members.some(
    (id) => id.toString() === userId.toString(),
  );

  if (!isMember) {
    return res.status(403).json({
      message: "Group membership required",
    });
  }

  next();
};

export const checkGroupActive = (req, res, next) => {
  if (!req.group.isActive) {
    return res.status(400).json({
      message: "Group is closed",
    });
  }

  next();
};
