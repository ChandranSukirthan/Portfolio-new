const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"]
    },
    greeting: {
      type: String,
      default: "Hello, I’m"
    },
    title: {
      type: String,
      required: [true, "Title/Role field is required"]
    },
    description: {
      type: String,
      required: [true, "Description field is required"]
    },
    profileImage: {
      type: String,
      default: ""
    },
    resumeLink: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      required: [true, "Email field is required"]
    },
    phone: {
      type: String,
      default: ""
    },
    github: {
      type: String,
      default: ""
    },
    linkedin: {
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

module.exports = mongoose.model("Profile", profileSchema);