const Certificate = require("../models/Certificate");

// Get all certificate items
const getCertificateList = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ issueDate: -1 });
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create certificate item
const createCertificate = async (req, res) => {
  try {
    const item = await Certificate.create(req.body);
    res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      data: item
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update certificate item
const updateCertificate = async (req, res) => {
  try {
    const item = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!item) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: item
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete certificate item
const deleteCertificate = async (req, res) => {
  try {
    const item = await Certificate.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCertificateList,
  createCertificate,
  updateCertificate,
  deleteCertificate
};
