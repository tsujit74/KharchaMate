import Group from "../models/Group.js";
import User from "../models/User.js";
import Expense from "../models/Expense.js";
import { notifyUser } from "../service/notify.js";
import { notifyAdmin } from "../service/adminNotify.js";

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    const group = await Group.create({
      name,
      createdBy: req.user.id,
      admins: [req.user.id],
      members: [req.user.id],
      isActive: true,
    });

    const user = await User.findById(req.user.id).select("name");

    await notifyAdmin({
      actor: user._id,
      title: "New Group Created",
      message: `${user.name} created group "${group.name}"`,
      type: "GROUP_CREATED",
      relatedId: group._id,
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Failed to create group" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email, userId } = req.body;
    const group = req.group;

    //  Authorization check
    if (!group.admins.includes(req.user.id)) {
      return res.status(403).json({
        message: "Only admins can add members",
      });
    }

    //  Prevent adding after expenses exist
    const expenseExists = await Expense.exists({ group: group._id });
    if (expenseExists) {
      return res.status(400).json({
        message: "Cannot add member after expenses are created",
      });
    }

    //  Validate input
    if (!email && !userId) {
      return res.status(400).json({
        message: "Provide email or userId",
      });
    }

    let user = null;

    //  Fetch user safely
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    }

    //  User existence check
    if (!user || !user.isActive) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent self-add duplication
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        message: "You are already in the group",
      });
    }

    // Prevent duplicate members
    if (group.members.some((id) => id.toString() === user._id.toString())) {
      return res.status(409).json({
        message: "User already in group",
      });
    }

    // Atomic update (important)
    await Group.updateOne(
      { _id: group._id },
      { $addToSet: { members: user._id } }
    );

    //  Notification (non-blocking)
    notifyUser({
      userId: user._id,
      actor: req.user.id,
      title: "Added to a group",
      message: `added you to "${group.name}"`,
      type: "GROUP",
      link: `/groups/${group._id}`,
      relatedId: group._id,
    }).catch((err) => console.error("notifyUser error:", err));

    return res.json({ message: "Member added successfully" });
  } catch (error) {
    console.error("addMember error:", error);
    return res.status(500).json({ message: "Failed to add member" });
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
    const group = await Group.findById(req.group._id)
      .populate("members", "name email mobile")
      .populate("admins", "name email")
      .populate("createdBy", "name email");

    const expenseCount = await Expense.countDocuments({
      group: req.group._id,
    });

    res.status(200).json({
      ...group.toObject(),
      expenseCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch group" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = req.group;

    if (group.createdBy.toString() === userId) {
      return res.status(400).json({
        message: "Group creator cannot be removed",
      });
    }

    const expenseCount = await Expense.countDocuments({
      group: group._id,
    });

    if (expenseCount > 0) {
      return res.status(400).json({
        message: "Members cannot be removed after expenses are added",
      });
    }

    group.members = group.members.filter((id) => id.toString() !== userId);

    group.admins = group.admins.filter((id) => id.toString() !== userId);

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
    const group = req.group;

    group.isActive = !group.isActive;
    await group.save();

    notifyAdmin({
      title: group.isActive ? "Group Reopened" : "Group Closed",
      message: `${req.user.name} ${
        group.isActive ? "reopened" : "closed"
      } group "${group.name}"`,
      type: "GROUP_STATUS",
      relatedId: group._id,
    });

    res.json({
      message: group.isActive ? "Group reopened" : "Group closed",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update group" });
  }
};

export const updateGroupName = async (req, res) => {
  try {
    const { name } = req.body;
    const group = req.group;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Group name is required",
      });
    }

    group.name = name.trim();
    await group.save();

    res.status(200).json({
      message: "Group name updated successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update group name" });
  }
};

//Search Users
export const searchUsers = async (req, res) => {
  try {
    let { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ message: "Valid search query required" });
    }

    q = q.trim();

    if (q.length < 2) {
      return res.status(400).json({
        message: "Search query must be at least 2 characters",
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
      isActive: true,
      _id: { $ne: req.user.id },
    })
      .select("_id name email")
      .limit(10)
      .lean();

    return res.json(users);
  } catch (error) {
    console.error("searchUsers error:", error);
    return res.status(500).json({ message: "Failed to search users" });
  }
};

//Recent users
export const getRecentUsers = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.id,
      isActive: true,
    })
      .select("members")
      .lean();

    const userIds = new Set();

    for (const g of groups) {
      for (const id of g.members) {
        if (id.toString() !== req.user.id) {
          userIds.add(id.toString());
        }
      }
    }

    if (userIds.size === 0) {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $in: Array.from(userIds) },
      isActive: true,
    })
      .select("_id name email")
      .limit(10)
      .lean();

    return res.json(users);
  } catch (error) {
    console.error("getRecentUsers error:", error);
    return res.status(500).json({ message: "Failed to fetch recent users" });
  }
};
