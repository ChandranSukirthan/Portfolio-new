const express = require("express");
const router = express.Router();
const {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require("../controllers/achievementController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getAchievements);
router.post("/", protect, createAchievement);
router.put("/:id", protect, updateAchievement);
router.delete("/:id", protect, deleteAchievement);

module.exports = router;
