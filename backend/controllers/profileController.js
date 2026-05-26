const Profile = require("../models/Profile");

// Get profile
// GET /api/profile
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    // Auto-seed a default profile if none exists so the frontend never crashes
    if (!profile) {
      profile = await Profile.create({
        name: "Sukirthan Chandrakumar",
        greeting: "Hello, I’m",
        title: "AI & Full Stack Developer",
        description: "AI undergraduate specializing in Artificial Intelligence, skilled in MERN stack, machine learning, and full-stack web development. Experienced in building scalable web applications and AI-powered systems. Seeking internship opportunities to contribute to innovative projects.",
        email: "sukirthan@example.com",
        phone: "+94 77 123 4567",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        location: "Colombo, Sri Lanka",
        profileImage: "/uploads/default-avatar.png",
        resumeLink: ""
      });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    console.error("GET Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching profile: " + error.message
    });
  }
};

// Create profile
// POST /api/profile
const createProfile = async (req, res) => {
  try {
    const { name, title, description, email } = req.body;
    if (!name || !title || !description || !email) {
      return res.status(400).json({ success: false, message: "Required fields name, title, description, and email are missing" });
    }

    const profile = await Profile.create(req.body);
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile
    });
  } catch (error) {
    console.error("POST Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error creating profile: " + error.message
    });
  }
};

// Update profile by ID
// PUT /api/profile/:id
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, description, email } = req.body;

    if (!name || !title || !description || !email) {
      return res.status(400).json({ success: false, message: "Required fields name, title, description, and email are missing" });
    }

    const profile = await Profile.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile record not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });
  } catch (error) {
    console.error("PUT Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error updating profile: " + error.message
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile
};