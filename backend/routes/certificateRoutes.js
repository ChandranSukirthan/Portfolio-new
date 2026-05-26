const express = require("express");
const router = express.Router();
const {
  getCertificateList,
  createCertificate,
  updateCertificate,
  deleteCertificate
} = require("../controllers/certificateController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getCertificateList);
router.post("/", protect, createCertificate);
router.put("/:id", protect, updateCertificate);
router.delete("/:id", protect, deleteCertificate);

module.exports = router;
