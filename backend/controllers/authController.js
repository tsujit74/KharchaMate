import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../service/mailService.js";


export const signup = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile: mobile || undefined,
    });

    res.status(201).json({
      message: "User signup successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const genericResponse = {
      message:
        "If an account with that email exists, a reset link has been sent.",
    };

    const user = await User.findOne({ email });

  
    if (!user) {
      return res.json(genericResponse);
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
  to: user.email,
  subject: "Reset Your KharchaMate Password",
  html: `
  <div style="margin:0;padding:0;background:#0f172a;font-family:Arial,Helvetica,sans-serif;">
    
    <div style="max-width:600px;margin:40px auto;background:#111827;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#22c55e,#06b6d4);padding:30px;text-align:center;">
        <h1 style="margin:0;color:white;font-size:24px;">
          🔐 KharchaMate
        </h1>
        <p style="margin:8px 0 0;color:white;opacity:0.9;">
          Password Reset Request
        </p>
      </div>

      <!-- Body -->
      <div style="padding:40px;color:#e5e7eb;text-align:center;">
        
        <h2 style="margin-bottom:20px;font-size:20px;">
          Hello ${user.name || "User"},
        </h2>

        <p style="font-size:15px;line-height:1.6;color:#cbd5e1;">
          We received a request to reset your password.
          Click the button below to create a new password.
        </p>

        <p style="margin:20px 0;font-size:14px;color:#94a3b8;">
          This link will expire in <strong>15 minutes</strong>.
        </p>

        <!-- Button -->
        <div style="margin:35px 0;">
          <a href="${resetLink}"
             style="background:linear-gradient(135deg,#22c55e,#06b6d4);
                    color:white;
                    padding:14px 28px;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:bold;
                    display:inline-block;">
            Reset Password
          </a>
        </div>

        <p style="font-size:13px;color:#64748b;">
          If you didn’t request this, you can safely ignore this email.
        </p>

      </div>

      <!-- Footer -->
      <div style="background:#0b1220;padding:20px;text-align:center;font-size:12px;color:#64748b;">
        © ${new Date().getFullYear()} KharchaMate. All rights reserved.
      </div>

    </div>
  </div>
  `,
});

    return res.json(genericResponse);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};