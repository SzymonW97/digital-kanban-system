const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password were provided
    if (!username || !password) {
      return res.status(400).json({ message: "Please enter username and password" });
    }

    // Find user by username
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: "User account is inactive" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return user data and token
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginUser,
};