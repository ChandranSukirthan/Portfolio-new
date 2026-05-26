const express = require("express");
const router = express.Router();
const {
  getEducationList,
  createEducation,
  updateEducation,
  deleteEducation
} = require("../controllers/educationController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getEducationList);
router.post("/", protect, createEducation);
router.put("/:id", protect, updateEducation);
router.delete("/:id", protect, deleteEducation);

module.exports = router;
