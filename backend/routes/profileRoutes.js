const express = require("express");
const router = express.Router();

const {
  createProfile,
  getProfile,
  updateProfile
} = require("../controllers/profileController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getProfile);
router.post("/", protect, createProfile);
router.put("/:id", protect, updateProfile);

module.exports = router;