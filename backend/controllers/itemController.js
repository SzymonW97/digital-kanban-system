const Item = require("../models/Item");
const Transaction = require("../models/Transaction");

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

// @desc    Add stock to an item
// @route   POST /api/items/:id/add-stock
// @access  Private/Warehouse
const addStock = async (req, res) => {
  try {
    const { quantity, comment } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Please provide a valid quantity" });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!item.isActive) {
      return res.status(400).json({ message: "Cannot update an inactive item" });
    }

    const previousQuantity = item.currentQuantity;
    const newQuantity = item.currentQuantity + quantity;

    item.currentQuantity = newQuantity;

    if (item.currentQuantity === 0) {
      item.status = "out_of_stock";
    } else if (item.currentQuantity <= item.warningThreshold) {
      item.status = "low_stock";
    } else {
      item.status = "available";
    }

    item.updatedBy = req.user._id;
    await item.save();

    await Transaction.create({
      itemId: item._id,
      transactionType: "stock_in",
      quantity,
      previousQuantity,
      newQuantity,
      performedBy: req.user._id,
      comment,
    });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove stock from an item
// @route   POST /api/items/:id/remove-stock
// @access  Private/Operator
const removeStock = async (req, res) => {
  try {
    const { quantity, comment } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Please provide a valid quantity" });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!item.isActive) {
      return res.status(400).json({ message: "Cannot update an inactive item" });
    }

    if (quantity > item.currentQuantity) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    const previousQuantity = item.currentQuantity;
    const newQuantity = item.currentQuantity - quantity;

    item.currentQuantity = newQuantity;

    if (item.currentQuantity === 0) {
      item.status = "out_of_stock";
    } else if (item.currentQuantity <= item.warningThreshold) {
      item.status = "low_stock";
    } else {
      item.status = "available";
    }

    item.updatedBy = req.user._id;
    await item.save();

    await Transaction.create({
      itemId: item._id,
      transactionType: "stock_out",
      quantity,
      previousQuantity,
      newQuantity,
      performedBy: req.user._id,
      comment,
    });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  addStock,
  removeStock,
};

