const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
  deleteMessage
} = require("../controllers/contactMessageController");
const { protect } = require("../middlewares/authMiddleware");

// Public submit form endpoint
router.post("/", createMessage);

// Protected endpoints to fetch and manage message listings
router.get("/", protect, getMessages);
router.delete("/:id", protect, deleteMessage);

module.exports = router;
