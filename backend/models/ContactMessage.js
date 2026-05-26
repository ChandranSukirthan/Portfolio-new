const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"]
    },
    phoneOrEmail: {
      type: String,
      required: [true, "Phone number or email address is required"]
    },
    message: {
      type: String,
      required: [true, "Message content is required"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
