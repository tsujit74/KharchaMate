export const errorLogger = (err, req, res, next) => {
  const errorLog = {
    message: err.message,
    route: req.originalUrl,
    method: req.method,
    status: err.status || 500,
    time: new Date().toISOString(),
  };

  console.error("🚨 Error:", errorLog);

  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};