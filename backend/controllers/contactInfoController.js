const ContactInfo = require("../models/ContactInfo");

// Get contact info
// GET /api/contact-info
const getContactInfo = async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne();

    // Auto-seed a default if none exists so the frontend never crashes
    if (!contactInfo) {
      contactInfo = await ContactInfo.create({
        phone: "+94 77 123 4567",
        email: "sukirthan@example.com",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        location: "Colombo, Sri Lanka"
      });
    }

    res.status(200).json(contactInfo);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create contact info
// POST /api/contact-info
const createContactInfo = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is a required field" });
    }

    const contactInfo = await ContactInfo.create(req.body);
    res.status(201).json({
      success: true,
      message: "Contact Info created successfully",
      data: contactInfo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update contact info
// PUT /api/contact-info/:id
const updateContactInfo = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is a required field" });
    }

    const contactInfo = await ContactInfo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!contactInfo) {
      return res.status(404).json({ success: false, message: "Contact Info not found" });
    }

    res.status(200).json({
      success: true,
      message: "Contact Info updated successfully",
      data: contactInfo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getContactInfo,
  createContactInfo,
  updateContactInfo
};
