const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  verifyAdmin,
  changePassword
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/verify", protect, verifyAdmin);
router.post("/change-password", protect, changePassword);

module.exports = router;
