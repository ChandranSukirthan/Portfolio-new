const express = require("express");
const router = express.Router();
const {
  getExperienceList,
  createExperience,
  updateExperience,
  deleteExperience
} = require("../controllers/experienceController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getExperienceList);
router.post("/", protect, createExperience);
router.put("/:id", protect, updateExperience);
router.delete("/:id", protect, deleteExperience);

module.exports = router;
