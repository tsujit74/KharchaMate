import express from "express";
import { signup, login } from "../controllers/authController.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || null,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("GET /me ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

export default router;
