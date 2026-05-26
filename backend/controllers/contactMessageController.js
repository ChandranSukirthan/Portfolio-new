const ContactMessage = require("../models/ContactMessage");

// Create public message
// POST /api/contact-messages
const createMessage = async (req, res) => {
  try {
    const { fullName, phoneOrEmail, message } = req.body;
    if (!fullName || !phoneOrEmail || !message) {
      return res.status(400).json({ success: false, message: "fullName, phoneOrEmail, and message are required fields" });
    }

    const newMessage = await ContactMessage.create(req.body);
    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!",
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages (Admin)
// GET /api/contact-messages
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete message by ID (Admin)
// DELETE /api/contact-messages/:id
const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMessage,
  getMessages,
  deleteMessage
};
