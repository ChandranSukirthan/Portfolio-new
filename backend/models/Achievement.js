const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Achievement title is required"]
    },
    issuer: {
      type: String,
      required: [true, "Issued organization/issuer is required"]
    },
    issuedDate: {
      type: String,
      required: [true, "Issue date is required"]
    },
    certificateLink: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Achievement", achievementSchema);
