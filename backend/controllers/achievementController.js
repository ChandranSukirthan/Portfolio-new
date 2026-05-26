const Achievement = require("../models/Achievement");

// Get all achievements
// GET /api/achievements
const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create achievement
// POST /api/achievements
const createAchievement = async (req, res) => {
  try {
    const { title, issuer, issuedDate } = req.body;
    if (!title || !issuer || !issuedDate) {
      return res.status(400).json({ success: false, message: "title, issuer, and issuedDate are required fields" });
    }

    const achievement = await Achievement.create(req.body);
    res.status(201).json({
      success: true,
      message: "Achievement created successfully",
      data: achievement
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update achievement
// PUT /api/achievements/:id
const updateAchievement = async (req, res) => {
  try {
    const { title, issuer, issuedDate } = req.body;
    if (!title || !issuer || !issuedDate) {
      return res.status(400).json({ success: false, message: "title, issuer, and issuedDate are required fields" });
    }

    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!achievement) {
      return res.status(404).json({ success: false, message: "Achievement not found" });
    }

    res.status(200).json({
      success: true,
      message: "Achievement updated successfully",
      data: achievement
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete achievement
// DELETE /api/achievements/:id
const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);

    if (!achievement) {
      return res.status(404).json({ success: false, message: "Achievement not found" });
    }

    res.status(200).json({
      success: true,
      message: "Achievement deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
};
