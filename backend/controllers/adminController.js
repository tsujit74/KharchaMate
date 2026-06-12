import mongoose from "mongoose";
import User from "../models/User.js";
import Group from "../models/Group.js";
import Expense from "../models/Expense.js";
import Announcement from "../models/Announcement.js";
import { notifyUser } from "../service/notify.js";
import Ticket from "../models/Ticket.js";
import AdminNotification from "../models/AdminNotification.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGroups = await Group.countDocuments();
    const totalExpenses = await Expense.countDocuments();

    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const blockedGroups = await Group.countDocuments({
      isBlocked: true,
    });

    const openTickets = await Ticket.countDocuments({
      status: "OPEN",
    });

    const inProgressTickets = await Ticket.countDocuments({
      status: "IN_PROGRESS",
    });

    const resolvedTickets = await Ticket.countDocuments({
      status: "RESOLVED",
    });

    const totalTickets = await Ticket.countDocuments();

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
      blockedUsers,
      blockedGroups,

      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
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
      }),
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

    const otherMembers = group.members.filter(
      (m) => String(m) !== String(req.user.id),
    );

    console.log(otherMembers);

    try {
      await Promise.all(
        otherMembers.map((memberId) =>
          notifyUser({
            userId: memberId,
            actor: null,
            title: "Group BLOCKED",
            message: `Your group ${group.name} was blocked by admin`,
            type: "GROUP",
            link: `/groups/${group._id}`,
            relatedId: group._id,
          }),
        ),
      );
    } catch (notifyError) {
      console.error("Notify error (block):", notifyError);
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
    group.blockedBy = null;
    group.blockedAt = null;

    const otherMembers = group.members.filter(
      (m) => String(m) !== String(req.user.id),
    );

    console.log(otherMembers);

    try {
      await Promise.all(
        otherMembers.map((memberId) =>
          notifyUser({
            userId: memberId,
            actor: null,
            title: "Group UNBLOCKED",
            message: `Your group ${group.name} was UNBLOCKED by admin`,
            type: "GROUP",
            link: `/groups/${group._id}`,
            relatedId: group._id,
          }),
        ),
      );
    } catch (notifyError) {
      console.error("Notify error (block):", notifyError);
    }

    await group.save();
    res.status(200).json({ message: "Group unblocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to unblock group" });
  }
};

// USERS BY ID DETAILS
export const getUserDetailsAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Fetch user details
    const user = await User.findById(objectUserId).select(
      `
        name
        email
        mobile
        role
        isBlocked
        createdAt
        updatedAt
        lastLoginAt
      `,
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Parallel queries
    const [
      groupsCreatedCount,
      groupsJoinedCount,
      createdGroups,
      joinedGroups,
      expensesAgg,
      expensesCount,
      latestExpenses,
      tickets,
    ] = await Promise.all([
      // Stats
      Group.countDocuments({ createdBy: objectUserId }),

      Group.countDocuments({ members: objectUserId }),

      // Created groups
      Group.find({ createdBy: objectUserId })
        .select("name isActive isBlocked createdAt members")
        .sort({ createdAt: -1 })
        .limit(5),

      // Joined groups
      Group.find({ members: objectUserId })
        .select("name isActive isBlocked createdAt")
        .sort({ createdAt: -1 })
        .limit(5),

      // Total expenses paid
      Expense.aggregate([
        {
          $match: {
            paidBy: objectUserId,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      // Expense count
      Expense.countDocuments({
        paidBy: objectUserId,
      }),

      // Latest expenses
      Expense.find({
        paidBy: objectUserId,
      })
        .populate("group", "name")
        .select("description amount category createdAt group")
        .sort({ createdAt: -1 })
        .limit(10),

      // Tickets
      Ticket.find({
        user: objectUserId,
      })
        .select(
          `
            subject
            description
            priority
            status
            createdAt
            resolvedAt
          `,
        )
        .sort({ createdAt: -1 }),
    ]);

    const totalExpenses = expensesAgg.length > 0 ? expensesAgg[0].total : 0;

    // Ticket stats
    const openTickets = tickets.filter((t) => t.status !== "RESOLVED").length;

    const resolvedTickets = tickets.filter(
      (t) => t.status === "RESOLVED",
    ).length;

    return res.status(200).json({
      success: true,

      // USER DETAILS
      user: {
        ...user.toObject(),
      },

      // ADMIN STATS
      stats: {
        groupsCreated: groupsCreatedCount,
        groupsJoined: groupsJoinedCount,
        totalExpenses,
        expensesCount,
        ticketsRaised: tickets.length,
        openTickets,
        resolvedTickets,
      },

      // CREATED GROUPS
      createdGroups: createdGroups.map((group) => ({
        _id: group._id,
        name: group.name,
        totalMembers: group.members.length,
        isActive: group.isActive,
        isBlocked: group.isBlocked,
        createdAt: group.createdAt,
      })),

      // JOINED GROUPS
      joinedGroups,

      // RECENT EXPENSES
      recentExpenses: latestExpenses,

      // TICKETS
      tickets,
    });
  } catch (error) {
    console.error("Admin getUserDetails error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

export const getUserGroupsAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const groups = await Group.find({
      createdBy: userId,
    })
      .select("name totalMembers totalExpenses isBlocked createdAt")
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    console.error("Admin getUserGroups error:", error);
    res.status(500).json({
      message: "Failed to fetch groups",
    });
  }
};

// controllers/admin/groupController.ts

export const getGroupDetailsAdmin = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group id",
      });
    }

    const objectGroupId = new mongoose.Types.ObjectId(groupId);

    // Fetch group with member details
    const group = await Group.findById(objectGroupId)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .select("name createdBy members isBlocked isActive createdAt updatedAt");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // totalMembers
    const totalMembers = group.members.length;

    // Pagination
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(5, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [expenses, totalCount] = await Promise.all([
      Expense.find({ group: objectGroupId })
        .populate("paidBy", "name email")
        .populate("splitBetween.user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Expense.countDocuments({ group: objectGroupId }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // totalExpenses
    const totalExpenses =
      expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0;

    return res.status(200).json({
      success: true,
      group: {
        ...group.toObject(),
        totalMembers,
        totalExpenses,
      },
      expenses,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Admin getGroupDetailsAdmin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch group details",
    });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({
        message: "TITLE_AND_MESSAGE_REQUIRED",
      });
    }

    const announcement = await Announcement.create({
      title,
      message,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "ANNOUNCEMENT_CREATED",
      announcement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "FAILED_CREATE_ANNOUNCEMENT",
    });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });

    res.json({
      announcements,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "FAILED_FETCH_ANNOUNCEMENTS",
    });
  }
};

export const toggleAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "ANNOUNCEMENT_NOT_FOUND",
      });
    }

    announcement.isActive = !announcement.isActive;

    await announcement.save();

    res.json({
      message: "ANNOUNCEMENT_UPDATED",
      announcement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "FAILED_UPDATE_ANNOUNCEMENT",
    });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "ANNOUNCEMENT_NOT_FOUND",
      });
    }

    await announcement.deleteOne();

    res.json({
      message: "ANNOUNCEMENT_DELETED",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "FAILED_DELETE_ANNOUNCEMENT",
    });
  }
};

export const getActiveAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({
      announcements,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "FAILED_FETCH_ANNOUNCEMENTS",
    });
  }
};
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
};

export const adminReplyTicket = async (req, res) => {
  try {
    const { message, status } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    ticket.messages.push({
      sender: req.user.id,
      role: "ADMIN",
      message,
    });

    if (status) {
      ticket.status = status;

      if (status === "RESOLVED") {
        ticket.resolvedAt = new Date();
      }
    }

    await ticket.save();

    res.json({
      success: true,
      message: "Reply sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reply",
    });
  }
};

//Admin Notification
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await AdminNotification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch admin notifications",
    });
  }
};

export const getAdminUnreadCount = async (req, res) => {
  try {
    const count = await AdminNotification.countDocuments({
      isRead: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch unread count",
    });
  }
};

export const markAdminNotificationRead = async (req, res) => {
  try {
    await AdminNotification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notification",
    });
  }
};

export const markAllAdminNotificationsRead = async (req, res) => {
  try {
    await AdminNotification.updateMany({ isRead: false }, { isRead: true });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notifications",
    });
  }
};
