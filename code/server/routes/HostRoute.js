const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenOptional, requireRole, requireRoleOptional } = require("../middleware/auth.js");

const {
  getAllHosts,
  getHostById,
  getHostByKeyword,
  createHost,
  updateHost,
  deleteHost,
} = require("../controllers/HostController.js");

const routePermissions = {
  getAllHosts: ["read_host"],
  getHostById: ["read_host"],
  getHostByKeyword: ["read_host"],
  createHost: ["create_host"],
  updateHost: ["update_host"],
  deleteHost: ["delete_host"],
};

router.get("/", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", ...routePermissions.getAllHosts]) ,getAllHosts);
router.get("/search",verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getHostByKeyword]), getHostByKeyword);
router.get("/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getHostById]), getHostById);
router.post("/create", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.createHost]), createHost);
router.patch("/update/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.updateHost]), updateHost);
router.delete("/delete/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.deleteHost]), deleteHost);

module.exports = router;
