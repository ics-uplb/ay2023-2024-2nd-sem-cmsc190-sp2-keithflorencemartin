const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenOptional, requireRole, requireRoleOptional } = require("../middleware/auth.js");

const {
  getAllSamplingPoints,
  getSamplingPointById,
  getSamplingPointByKeyword,
  createSamplingPoint,
  updateSamplingPoint,
  deleteSamplingPoint,
} = require("../controllers/SamplingPointController.js");

const routePermissions = {
  getAllSamplingPoints: ["read_sampling_point"],
  getSamplingPointById: ["read_sampling_point"],
  getSamplingPointByKeyword: ["read_sampling_point"],
  createSamplingPoint: ["create_sampling_point"],
  updateSamplingPoint: ["update_sampling_point"],
  deleteSamplingPoint: ["delete_sampling_point"],
};

router.get("/", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", ...routePermissions.getAllSamplingPoints,]), getAllSamplingPoints);
router.get("/search", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getSamplingPointByKeyword,]), getSamplingPointByKeyword);
router.get("/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getSamplingPointById,]), getSamplingPointById);
router.post("/create", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.createSamplingPoint]), createSamplingPoint);
router.patch("/update/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.updateSamplingPoint]), updateSamplingPoint);
router.delete("/delete/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.deleteSamplingPoint]), deleteSamplingPoint);

module.exports = router;
