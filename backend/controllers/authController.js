const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret_key_12345", {
    expiresIn: "30d"
  });
};

// Register the first admin user
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Check if any user already exists in the system
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(403).json({ message: "Registration is disabled. Admin already exists." });
    }

    const user = await User.create({ email, password });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Admin Token
const verifyAdmin = async (req, res) => {
  try {
    // If the auth middleware succeeded, req.user exists
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both current and new passwords." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Admin user not found." });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    // Assigning new password will trigger pre('save') hook to hash it
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully!"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  verifyAdmin,
  changePassword
};
