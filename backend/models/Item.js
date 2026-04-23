const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    currentQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    maxQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    warningThreshold: {
      type: Number,
      required: true,
      min: 0,
    },
    criticalThreshold: {
      type: Number,
      default: 0,
      min: 0,
    },
    unitOfMeasure: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "low_stock", "out_of_stock", "refill_requested"],
      default: "available",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);