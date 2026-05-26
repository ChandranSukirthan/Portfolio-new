const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;