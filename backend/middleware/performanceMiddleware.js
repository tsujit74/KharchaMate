
export const performanceMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const duration = diff[0] * 1000 + diff[1] / 1e6;

    const logData = {
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      time: new Date().toISOString(),
    };

    if (duration > 500) {
      console.warn("⚠ Slow API", logData);
    } else if (process.env.NODE_ENV !== "production") {
      console.log("API", logData);
    }
  });

  next();
};
