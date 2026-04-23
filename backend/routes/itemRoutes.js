const express = require("express");
const router = express.Router();

const { createItem, getItems } = require("../controllers/itemController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Get all items - any logged-in user
router.get("/", protect, getItems);

// Create item - manager only
router.post("/", protect, authorizeRoles("manager"), createItem);

module.exports = router;