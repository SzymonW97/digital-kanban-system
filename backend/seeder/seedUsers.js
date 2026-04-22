const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

connectDB();

const seedUsers = async () => {
  try {
    await User.deleteMany();

    const users = [
      {
        fullName: "Operator User",
        username: "operator1",
        password: "password123",
        role: "operator",
      },
      {
        fullName: "Warehouse User",
        username: "warehouse1",
        password: "password123",
        role: "warehouse",
      },
      {
        fullName: "Manager User",
        username: "manager1",
        password: "password123",
        role: "manager",
      },
    ];

    for (const user of users) {
      await User.create(user);
    }

    console.log("Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();