import mongoose from "mongoose";

export const getHealthStatus = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;

    const dbStatus =
      dbState === 1
        ? "connected"
        : dbState === 2
        ? "connecting"
        : dbState === 3
        ? "disconnecting"
        : "disconnected";

    const memoryUsage = process.memoryUsage();

    res.status(200).json({
      status: "OK",
      timestamp: new Date(),
      uptime: process.uptime(),

      server: "running",

      database: dbStatus,

      system: {
        nodeVersion: process.version,
        platform: process.platform,
      },

      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Health check failed",
    });
  }
};