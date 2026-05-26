const express = require("express");
const router = express.Router();
const {
  getContactInfo,
  createContactInfo,
  updateContactInfo
} = require("../controllers/contactInfoController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getContactInfo);
router.post("/", protect, createContactInfo);
router.put("/:id", protect, updateContactInfo);

module.exports = router;
