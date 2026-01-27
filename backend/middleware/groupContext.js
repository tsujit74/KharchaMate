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

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some(
      memberId => memberId.toString() === userId.toString()
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
