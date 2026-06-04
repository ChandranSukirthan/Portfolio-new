const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    instituteName: {
      type: String,
      required: [true, "Institute name is required"]
    },
    degree: {
      type: String,
      required: [true, "Degree is required"]
    },
    specialization: {
      type: String,
      default: ""
    },
    startYear: {
      type: String,
      required: [true, "Start year is required"]
    },
    endYear: {
      type: String,
      default: "Present"
    },
    currentStatus: {
      type: Boolean,
      default: false
    },
    gpa: {
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

module.exports = mongoose.models.Education || mongoose.model("Education", educationSchema);
