const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenOptional, requireRole, requireRoleOptional } = require("../middleware/auth.js");

const {
  getAllMethods,
  getMethodById,
  getMethodByKeyword,
  createMethod,
  updateMethod,
  deleteMethod,
} = require("../controllers/MethodController.js");

const routePermissions = {
  getAllMethods: ["read_method"],
  getMethodById: ["read_method"],
  getMethodByKeyword: ["read_method"],
  createMethod: ["create_method"],
  updateMethod: ["update_method"],
  deleteMethod: ["delete_method"],
};

router.get("/", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", ...routePermissions.getAllMethods]), getAllMethods);
router.get("/search", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getMethodByKeyword]), getMethodByKeyword);
router.get("/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getMethodById]), getMethodById);
router.post("/create", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.createMethod]), createMethod);
router.patch("/update/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.updateMethod]), updateMethod);
router.delete("/delete/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.deleteMethod]), deleteMethod);

module.exports = router;
