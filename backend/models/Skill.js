const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: [true, "Skill name is required"]
    },
    category: {
      type: String,
      required: [true, "Skill category is required"],
      enum: [
        "PROGRAMMING_LANGUAGES",
        "DESIGN",
        "FULLSTACK",
        "TOOLS_PLATFORM",
        "DATABASE",
        "DEVOPS",
        "MOBILE",
        "CORE_COMPETENCIES",
        "MACHINE_LEARNING",
        "Generative AI",
        "OTHER"
      ]
    },
    level: {
      type: String,
      default: "Intermediate"
    },
    icon: {
      type: String,
      default: ""
    },
    highlight: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Skill", skillSchema);
