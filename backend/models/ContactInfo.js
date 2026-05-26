const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      required: [true, "Contact email is required"]
    },
    linkedin: {
      type: String,
      default: ""
    },
    github: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ContactInfo", contactInfoSchema);
