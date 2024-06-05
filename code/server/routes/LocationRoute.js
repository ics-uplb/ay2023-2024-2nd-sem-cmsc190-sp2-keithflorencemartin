const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenOptional, requireRole, requireRoleOptional } = require("../middleware/auth.js");

const {
  getAllLocations,
  getLocationById,
  getLocationByKeyword,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/LocationController.js");

const routePermissions = {
  getAllLocations: ["read_location"],
  getLocationById: ["read_location"],
  getLocationByKeyword: ["read_location"],
  createLocation: ["create_location"],
  updateLocation: ["update_location"],
  deleteLocation: ["delete_location"],
};

router.get("/", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", ...routePermissions.getAllLocations]), getAllLocations);
router.get("/search", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getLocationByKeyword,]), getLocationByKeyword);
router.get("/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getLocationById]), getLocationById);
router.post("/create", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.createLocation]), createLocation);
router.patch("/update/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.updateLocation]), updateLocation);
router.delete("/delete/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.deleteLocation]), deleteLocation);

module.exports = router;
