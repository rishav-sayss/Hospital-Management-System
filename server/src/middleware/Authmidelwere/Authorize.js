// Restricts a route to specific roles.
// Usage: router.get("/admin-only", authenticate, authorize("admin"), handler)
 export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You are not authorized",
            });
        }

        next();
    };
};

 
 
 
// Usage: router.get("/profile/:userId", authenticate, authorizeOwnerOrRoles("userId", "admin"), handler)
export const authorizeOwnerOrRoles = (paramName, ...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const resourceUserId = req.params[paramName];
    const isOwner = resourceUserId && resourceUserId === req.user._id.toString();
    const hasRole = allowedRoles.includes(req.user.role);

    if (!isOwner && !hasRole) {
      return res.status(403).json({ message: "Access denied: not your resource" });
    }

    next();
  };
};