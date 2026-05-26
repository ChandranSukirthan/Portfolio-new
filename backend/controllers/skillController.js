const Skill = require("../models/Skill");

// Get all skills
// GET /api/skills
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, skillName: 1 });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create skill
// POST /api/skills
const createSkill = async (req, res) => {
  try {
    const { skillName, category } = req.body;
    if (!skillName || !category) {
      return res.status(400).json({ success: false, message: "skillName and category are required fields" });
    }

    const skill = await Skill.create(req.body);
    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update skill
// PUT /api/skills/:id
const updateSkill = async (req, res) => {
  try {
    const { skillName, category } = req.body;
    if (!skillName || !category) {
      return res.status(400).json({ success: false, message: "skillName and category are required fields" });
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: skill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete skill
// DELETE /api/skills/:id
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill
};
