import User from "../models/User.js";
import Group from "../models/Group.js";

export const getUserById = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id).select(
      "name email mobile createdAt updatedAt"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Allow if requesting own profile
    if (currentUserId === id) {
      return res.json({ user });
    }

    // Check if both users share at least one group
    const sharedGroup = await Group.findOne({
      members: { $all: [currentUserId, id] },
    });

    if (!sharedGroup) {
      return res.status(403).json({
        message: "Not authorized to view this user",
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("GET_USER_BY_ID_ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};