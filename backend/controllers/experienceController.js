const Experience = require("../models/Experience");

// Get all experience items
const getExperienceList = async (req, res) => {
  try {
    const experience = await Experience.find().sort({ startDate: -1 });
    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create experience item
const createExperience = async (req, res) => {
  try {
    const item = await Experience.create(req.body);
    res.status(201).json({
      success: true,
      message: "Experience item created successfully",
      data: item
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update experience item
const updateExperience = async (req, res) => {
  try {
    const item = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!item) {
      return res.status(404).json({ message: "Experience item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Experience item updated successfully",
      data: item
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete experience item
const deleteExperience = async (req, res) => {
  try {
    const item = await Experience.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Experience item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Experience item deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExperienceList,
  createExperience,
  updateExperience,
  deleteExperience
};
