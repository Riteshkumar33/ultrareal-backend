export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      const displayRole = req.user.role
        ? req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1)
        : req.user.role;
      return res.status(403).json({
        success: false,
        message: `Role '${displayRole}' is not authorized to access this route`,
      });
    }

    next();
  };
};
