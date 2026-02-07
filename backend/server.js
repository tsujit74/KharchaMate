import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import blanceRoutes from "./routes/blanceRoutes.js";
import notificationToutes from "./routes/notificationRoutes.js";
import reminderRoutes from "./routes/sendReminder.js"

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/blance", blanceRoutes);
app.use("/api/notifications", notificationToutes);
app.use("/api/reminders", reminderRoutes);

app.get("/", (req, res) => {
  res.send("KharchaMate Backend Running");
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
