const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenOptional, requireRole, requireRoleOptional } = require("../middleware/auth.js");

const {
  getAllOrganisms,
  getOrganismById,
  getOrganismByKeyword,
  createOrganism,
  updateOrganism,
  deleteOrganism,
} = require("../controllers/OrganismController.js");

const routePermissions = {
  getAllOrganisms: ["read_organism"],
  getOrganismById: ["read_organism"],
  getOrganismByKeyword: ["read_organism"],
  createOrganism: ["create_organism"],
  updateOrganism: ["update_organism"],
  deleteOrganism: ["delete_organism"],
};

router.get("/", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", ...routePermissions.getAllOrganisms]), getAllOrganisms);
router.get("/search", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getOrganismByKeyword,]), getOrganismByKeyword);
router.get("/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.getOrganismById]), getOrganismById);
router.post("/create", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.createOrganism]), createOrganism);
router.patch("/update/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.updateOrganism]), updateOrganism);
router.delete("/delete/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.deleteOrganism]), deleteOrganism);

module.exports = router;
