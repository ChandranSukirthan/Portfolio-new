const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");

// POST upload file
router.post("/", protect, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded!" });
    }

    // Return the relative path of the file
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: "File uploaded successfully!",
      url: fileUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
