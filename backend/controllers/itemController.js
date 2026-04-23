const Item = require("../models/Item");

// @desc    Create a new item
// @route   POST /api/items
// @access  Private/Manager
const createItem = async (req, res) => {
  try {
    const {
      itemCode,
      itemName,
      description,
      currentQuantity,
      maxQuantity,
      warningThreshold,
      criticalThreshold,
      unitOfMeasure,
      location,
    } = req.body;

    // Simple required field check
    if (
      !itemCode ||
      !itemName ||
      currentQuantity === undefined ||
      !maxQuantity ||
      warningThreshold === undefined ||
      !unitOfMeasure ||
      !location
    ) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const itemExists = await Item.findOne({ itemCode });

    if (itemExists) {
      return res.status(400).json({ message: "Item code already exists" });
    }

    let status = "available";

    if (currentQuantity === 0) {
      status = "out_of_stock";
    } else if (currentQuantity <= warningThreshold) {
      status = "low_stock";
    }

    const item = await Item.create({
      itemCode,
      itemName,
      description,
      currentQuantity,
      maxQuantity,
      warningThreshold,
      criticalThreshold,
      unitOfMeasure,
      location,
      status,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all items
// @route   GET /api/items
// @access  Private
const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("createdBy updatedBy", "fullName username role");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
};