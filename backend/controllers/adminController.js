import mongoose from "mongoose";
import User from "../models/User.js";
import Group from "../models/Group.js";
import Expense from "../models/Expense.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGroups = await Group.countDocuments();
    const totalExpenses = await Expense.countDocuments();

    const totalMoneyResult = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalMoney = totalMoneyResult[0]?.totalAmount || 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const loggedInThisMonth = await User.countDocuments({
      lastLoginAt: { $gte: startOfMonth },
    });

    res.status(200).json({
      totalUsers,
      totalGroups,
      totalExpenses,
      totalMoney,
      newUsersThisMonth,
      loggedInThisMonth,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Prevent admin blocking themselves
    if (req.user.id === id) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent blocking another admin
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot block another admin" });
    }

    if (user.isBlocked) {
      return res.status(400).json({ message: "User already blocked" });
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to block user" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isBlocked) {
      return res.status(400).json({ message: "User is not blocked" });
    }

    user.isBlocked = false;
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to unblock user" });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    const formatted = await Promise.all(
      groups.map(async (group) => {
        const expenseAgg = await Expense.aggregate([
          {
            $match: {
              group: group._id,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]);

        return {
          _id: group._id,
          name: group.name,
          createdBy: group.createdBy,
          totalMembers: group.members.length,
          totalExpenses: expenseAgg[0]?.total || 0,
          createdAt: group.createdAt,
          isBlocked: group.isBlocked ?? false,
        };
      })
    );

    res.json({ groups: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};

export const blockGroup = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Prevent duplicate block
    if (group.isBlocked) {
      return res.status(400).json({ message: "Group already blocked" });
    }

    group.isBlocked = true;

    if (req.user?.id) {
      group.blockedBy = req.user.id;
      group.blockedAt = new Date();
    }

    await group.save();

    res.status(200).json({ message: "Group blocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to block group" });
  }
};


export const unblockGroup = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Prevent duplicate unblock
    if (!group.isBlocked) {
      return res.status(400).json({ message: "Group is not blocked" });
    }

    group.isBlocked = false;

    if ("blockedBy" in group) {
      group.blockedBy = null;
      group.blockedAt = null;
    }

    await group.save();

    res.status(200).json({ message: "Group unblocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to unblock group" });
  }
};