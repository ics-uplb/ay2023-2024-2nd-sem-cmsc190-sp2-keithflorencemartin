const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

const verifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing token or invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; // Attach the user to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const verifyTokenOptional = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }

      req.user = user;
    } catch (error) {}
  }

  next(); // Proceed to the next middleware
};

const requireRole = (requiredRoles) => {
  return async (req, res, next) => {
    const { role_name } = req.user;

    console.log(role_name);

    try {
      // Find the role in the database
      const userRole = await Role.findOne({
        where: { role_name },
        include: Permission,
      });

      console.log(userRole);

      if (!userRole) {
        return res
          .status(403)
          .json({ message: "Forbidden: User role not found" });
      }

      // Check if the user's role is in the array of required roles
      if (!requiredRoles.includes(userRole.role_name)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role permissions" });
      }

      // Check if the user's role has any of the required permissions
      const hasPermission = userRole.permissions.some((permission) => {
        return requiredRoles.some(
          (requiredPermission) => permission.perm_name === requiredPermission
        );
      });

      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Error checking user role and permissions: ", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

const requireRoleOptional = (requiredRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      // If user is not authenticated, allow access without further role checks
      return next();
    }

    const { role_name } = req.user;

    try {
      // Find the role in the database
      const userRole = await Role.findOne({
        where: { role_name },
        include: Permission,
      });

      if (!userRole) {
        return res
          .status(403)
          .json({ message: "Forbidden: User role not found" });
      }

      // Check if the user's role is in the array of required roles
      if (!requiredRoles.includes(userRole.role_name)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role permissions" });
      }

      // Check if the user's role has any of the required permissions
      const hasPermission = userRole.permissions.some((permission) => {
        return requiredRoles.some(
          (requiredPermission) => permission.perm_name === requiredPermission
        );
      });

      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Error checking user role and permissions: ", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = {
  verifyToken,
  verifyTokenOptional,
  requireRole,
  requireRoleOptional,
};
