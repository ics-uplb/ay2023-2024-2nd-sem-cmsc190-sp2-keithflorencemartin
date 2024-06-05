const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenOptional, requireRole, requireRoleOptional } = require("../middleware/auth.js");

const {
  getAllIsolates,
  getIsolateById,
  getIsolateByKeyword,
  createIsolate,
  updateIsolate,
  deleteIsolate,
} = require("../controllers/IsolateController.js");

const routePermissions = {
  getAllIsolates: ["read_isolate_info"],
  getIsolateById: ["read_isolate_info"],
  getIsolateByKeyword: ["read_isolate_info"],
  createIsolate: ["create_isolate_info"],
  updateIsolate: ["update_isolate_info"],
  deleteIsolate: ["delete_isolate_info"],
};

router.get("/", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", "Guest", ...routePermissions.getAllIsolates,]), getAllIsolates);
router.get("/search", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", "Guest", ...routePermissions.getIsolateByKeyword,]), getIsolateByKeyword);
router.get("/:id", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", "Guest", ...routePermissions.getIsolateById,]), getIsolateById);
router.post("/create", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.createIsolate]), createIsolate);
router.patch("/update/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.updateIsolate]), updateIsolate);
router.delete("/delete", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.deleteIsolate]), deleteIsolate);

module.exports = router;
