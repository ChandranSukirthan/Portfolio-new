const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: [true, "Project title is required"]
    },
    description: {
      type: String,
      required: [true, "Project description is required"]
    },
    technologies: [
      {
        type: String
      }
    ],
    projectImage: {
      type: String,
      default: ""
    },
    githubLink: {
      type: String,
      default: ""
    },
    liveDemoLink: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: "Web Development"
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);