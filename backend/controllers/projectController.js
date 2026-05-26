const Project = require("../models/Project");

// Add project
// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { projectTitle, description } = req.body;
    if (!projectTitle || !description) {
      return res.status(400).json({ success: false, message: "projectTitle and description are required fields" });
    }

    const project = await Project.create(req.body);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all projects
// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single project by ID
// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update project
// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const { projectTitle, description } = req.body;
    if (!projectTitle || !description) {
      return res.status(400).json({ success: false, message: "projectTitle and description are required fields" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete project
// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};