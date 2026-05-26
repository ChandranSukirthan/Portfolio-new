const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    issueDate: {
      type: Date,
      required: true
    },
    credentialId: {
      type: String
    },
    credentialUrl: {
      type: String
    },
    image: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Certificate", certificateSchema);
