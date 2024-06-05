const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenOptional, requireRole, requireRoleOptional } = require("../middleware/auth.js");

const {
  getAllSamples,
  getSampleById,
  getSampleByKeyword,
  createSample,
  updateSample,
  deleteSample,
} = require("../controllers/SampleController.js");

const routePermissions = {
  getAllSamples: ["read_sample"],
  getSampleById: ["read_sample"],
  getSampleByKeyword: ["read_sample"],
  createSample: ["create_sample"],
  updateSample: ["update_sample"],
  deleteSample: ["delete_sample"],
};

router.get("/", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", ...routePermissions.getAllSamples]), getAllSamples);
router.get("/search", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getSampleByKeyword]), getSampleByKeyword);
router.get("/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getSampleById]), getSampleById);
router.post("/create", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.createSample]), createSample);
router.patch("/update/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.updateSample]), updateSample);
router.delete("/delete/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.deleteSample]), deleteSample);

module.exports = router;
