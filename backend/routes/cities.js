const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");
const { auth, requireRole } = require("../middleware/auth");

// Public routes
router.get("/", cityController.getCities);
router.get("/:cityId/areas", cityController.getCityAreas);

// Admin routes
router.post(
  "/",
  auth,
  requireRole(["admin", "superadmin"]),
  cityController.createCity
);
router.put(
  "/:cityId",
  auth,
  requireRole(["admin", "superadmin"]),
  cityController.updateCity
);
router.delete(
  "/:cityId",
  auth,
  requireRole(["admin", "superadmin"]),
  cityController.deleteCity
);

module.exports = router;
