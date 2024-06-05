const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth.js");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/UserController.js");

const routePermissions = {
  getAllUsers: ["read_user"],
  getUserById: ["read_user"],
  updateUser: ["update_user"],
  deleteUser: ["delete_user"],
  changePassword: ["change_password"],
};

router.get(
  "/",
  verifyToken,
  requireRole(["Admin", ...routePermissions.getAllUsers]),
  getAllUsers
);
router.get(
  "/:id",
  verifyToken,
  requireRole(["Admin", "Researcher", ...routePermissions.getUserById]),
  getUserById
);
router.patch(
  "/update/:id",
  verifyToken,
  requireRole(["Admin", "Researcher", ...routePermissions.updateUser]),
  updateUser
);
router.delete(
  "/delete/:id",
  verifyToken,
  requireRole(["Admin", ...routePermissions.deleteUser]),
  deleteUser
);
router.patch(
  "/updatePassword/:id",
  verifyToken,
  requireRole(["Admin", "Researcher", ...routePermissions.changePassword]),
  changePassword
);

module.exports = router;
