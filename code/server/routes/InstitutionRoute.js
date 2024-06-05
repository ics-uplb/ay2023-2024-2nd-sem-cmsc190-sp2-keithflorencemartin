const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenOptional, requireRole, requireRoleOptional } = require("../middleware/auth.js");

const {
  getAllInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} = require("../controllers/InstitutionController.js");

const routePermissions = {
  getAllInstitutions: ["read_institution"],
  createInstitution : ["create_institution"],
  updateInstitution: ["update_institution"],
  deleteInstitution: ["delete_institution"],
};

router.get("/", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", ...routePermissions.getAllInstitutions]), getAllInstitutions);
router.post("/create", verifyToken, requireRole(["Admin", ...routePermissions.createInstitution]), createInstitution);
router.patch("/update/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.updateInstitution]), updateInstitution);
router.delete("/delete/:id", verifyToken, requireRole(["Admin", ...routePermissions.deleteInstitution]), deleteInstitution);

module.exports = router;