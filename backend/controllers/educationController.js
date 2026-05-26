const Education = require("../models/Education");

// Get all education items
// GET /api/education
const getEducationList = async (req, res) => {
  try {
    const education = await Education.find().sort({ startYear: -1 });
    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create education item
// POST /api/education
const createEducation = async (req, res) => {
  try {
    const { instituteName, degree, startYear } = req.body;
    if (!instituteName || !degree || !startYear) {
      return res.status(400).json({ success: false, message: "Required fields missing: instituteName, degree, and startYear are required" });
    }

    const item = await Education.create(req.body);
    res.status(201).json({
      success: true,
      message: "Education item created successfully",
      data: item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update education item
// PUT /api/education/:id
const updateEducation = async (req, res) => {
  try {
    const { instituteName, degree, startYear } = req.body;
    if (!instituteName || !degree || !startYear) {
      return res.status(400).json({ success: false, message: "Required fields missing: instituteName, degree, and startYear are required" });
    }

    const item = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Education item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Education item updated successfully",
      data: item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete education item
// DELETE /api/education/:id
const deleteEducation = async (req, res) => {
  try {
    const item = await Education.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Education item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Education item deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEducationList,
  createEducation,
  updateEducation,
  deleteEducation
};
