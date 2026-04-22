const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route working",
    user: req.user,
  });
});

router.get("/operator-only", protect, authorizeRoles("operator"), (req, res) => {
  res.status(200).json({ message: "Operator route working" });
});

router.get("/warehouse-only", protect, authorizeRoles("warehouse"), (req, res) => {
  res.status(200).json({ message: "Warehouse route working" });
});

router.get("/manager-only", protect, authorizeRoles("manager"), (req, res) => {
  res.status(200).json({ message: "Manager route working" });
});

module.exports = router;