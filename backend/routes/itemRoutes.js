const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  addStock,
  removeStock,
} = require("../controllers/itemController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Get all items - any logged-in user
router.get("/", protect, getItems);

// Create item - manager only
router.post("/", protect, authorizeRoles("manager"), createItem);

// Add stock - warehouse only
router.post("/:id/add-stock", protect, authorizeRoles("warehouse"), addStock);

// Remove stock - operator only
router.post("/:id/remove-stock", protect, authorizeRoles("operator"), removeStock);

module.exports = router;