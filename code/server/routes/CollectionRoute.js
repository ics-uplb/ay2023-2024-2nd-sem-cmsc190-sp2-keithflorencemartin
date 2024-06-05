const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenOptional, requireRole, requireRoleOptional } = require("../middleware/auth.js");

const {
  getAllCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/CollectionController.js");

const routePermissions = {
  getAllCollections: ["read_collection"],
  createCollection: ["create_collection"],
  updateCollection: ["update_collection"],
  deleteCollection: ["delete_collection"],
};

router.get("/", verifyTokenOptional, requireRoleOptional(["Admin", "Researcher", ...routePermissions.getAllCollections]), getAllCollections);
router.post("/create", verifyToken, requireRole(["Admin", ...routePermissions.createCollection]), createCollection);
router.patch("/update/:id", verifyToken, requireRole(["Admin", "Researcher", ...routePermissions.updateCollection]), updateCollection);
router.delete("/delete/:id", verifyToken, requireRole(["Admin", ...routePermissions.deleteCollection]), deleteCollection);

module.exports = router;