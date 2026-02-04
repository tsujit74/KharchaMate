import Group from "../models/Group.js";
import User from "../models/User.js";
import { notifyUser } from "../service/notify.js";

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    const group = await Group.create({
      name,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Failed to create group" });
  }
};
export const addMember = async (req, res) => {
  try {
    const { groupId, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.members.includes(user._id)) {
      return res.status(400).json({ message: "User already in group" });
    }

    group.members.push(user._id);
    await group.save();

    // Notification to added member (NEW MODEL SUPPORT)
    await notifyUser({
      userId: user._id, // receiver
      actor: req.user.id, // who added
      title: "Added to a group",
      message: `added you to "${group.name}"`,
      type: "GROUP",
      link: `/groups/${group._id}`,
      relatedId: group._id,
    });

    res.json({ message: "Member added successfully" });
  } catch (error) {
    console.error("ADD MEMBER ERROR:", error);
    res.status(500).json({ message: "Failed to add member" });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.id,
    }).populate("members", "name email");

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};
