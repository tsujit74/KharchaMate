import Group from "../models/Group.js";
import User from "../models/User.js";
import Expense from "../models/Expense.js";
import { notifyUser } from "../service/notify.js";
import { isAdmin, isMember } from "../service/groupUtils.js";

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    const group = await Group.create({
      name,
      createdBy: req.user.id,
      admins: [req.user.id],
      members: [req.user.id],
      isActive:true,
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
    if (!user) return res.status(404).json({ message: "User not found" });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.isActive) {
      return res.status(400).json({
        message: "Group is closed",
      });
    }

    if (!isAdmin(group, req.user.id)) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    if (group.members.includes(user._id)) {
      return res.status(400).json({
        message: "User already in group",
      });
    }

    group.members.push(user._id);
    await group.save();

    await notifyUser({
      userId: user._id,
      actor: req.user.id,
      title: "Added to a group",
      message: `added you to "${group.name}"`,
      type: "GROUP",
      link: `/groups/${group._id}`,
      relatedId: group._id,
    });

    res.json({ message: "Member added successfully" });
  } catch (error) {
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

export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("members", "name email mobile")
      .populate("admins", "name email")
      .populate("createdBy", "name email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.some((m) => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const expenseCount = await Expense.countDocuments({
      group: groupId,
    });

    res.status(200).json({
      ...group.toObject(),
      expenseCount,
    });
  } catch (err) {
    console.error("GET GROUP ERROR:", err);
    res.status(500).json({ message: "Failed to fetch group" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.isActive) {
      return res.status(400).json({
        message: "Group is closed",
      });
    }

    if (!isAdmin(group, req.user.id)) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    if (group.createdBy.toString() === userId) {
      return res.status(400).json({
        message: "Group creator cannot be removed",
      });
    }

    const expenseCount = await Expense.countDocuments({
      group: groupId,
    });

    if (expenseCount > 0) {
      return res.status(400).json({
        message: "Members cannot be removed after expenses are added",
      });
    }

   
    group.members = group.members.filter(
      (m) => m.toString() !== userId
    );

    group.admins = group.admins.filter(
      (a) => a.toString() !== userId
    );

    await group.save();

    
    await notifyUser({
      userId,                
      actor: req.user.id,    
      title: "Removed from group",
      message: `removed you from "${group.name}"`,
      type: "GROUP",
      link: `/groups`,
      relatedId: group._id,
    });

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove member" });
  }
};

export const toggleGroupStatus = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!isAdmin(group, req.user.id))
      return res.status(403).json({
        message: "Admin access required",
      });

    group.isActive = !group.isActive;
    await group.save();

    res.json({
      message: group.isActive ? "Group reopened" : "Group closed",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update group" });
  }
};
