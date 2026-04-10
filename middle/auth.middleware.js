/**
 * Authentication Middleware
 * Checks if user is logged in
 */
export const requireAuth = (req, res, next) => {
  // Check if session exists
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
      statusCode: 401,
    });
  }

  // Attach userId to request
  req.userId = req.session.userId;
  next();
};

/**
 * Role-based Access Control Middleware
 * (if you implement user roles later)
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
        statusCode: 401,
      });
    }

    // Role check logic here
    next();
  };
};

/**
 * Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message: message,
    statusCode: status,
  });
};
