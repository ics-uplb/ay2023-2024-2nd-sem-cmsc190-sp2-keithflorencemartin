const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenOptional, requireRole, requireRoleOptional } = require("../middleware/auth.js");

const {
  getAllCaves,
  getCaveById,
  getCaveByKeyword,
  createCave,
  updateCave,
  deleteCave,
} = require("../controllers/CaveController.js");

const routePermissions = {
  getAllCaves: ["read_cave"],
  getCaveById: ["read_cave"],
  getCaveByKeyword: ["read_cave"],
  createCave: ["create_cave"],
  updateCave: ["update_cave"],
  deleteCave: ["delete_cave"],
};

router.get("/", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", ...routePermissions.getAllCaves]), getAllCaves);
router.get("/search", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getCaveByKeyword]), getCaveByKeyword);
router.get("/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getCaveById]), getCaveById);
router.post("/create", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.createCave]), createCave);
router.patch("/update/:id", verifyToken,requireRole(["Admin", "Researcher", ...routePermissions.updateCave]), updateCave);
router.delete("/delete/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.deleteCave]), deleteCave);

module.exports = router;
