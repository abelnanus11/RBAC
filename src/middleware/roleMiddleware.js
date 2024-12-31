const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("User Role:", req.user?.role); // Debugging
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "You do not have permission to access this resource" });
        }
        next();
    };
};

module.exports = authorizeRoles;
