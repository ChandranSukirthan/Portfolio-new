const User = require("../models/User");
const Profile = require("../models/Profile");
const Education = require("../models/Education");
const Skill = require("../models/Skill");
const Project = require("../models/Project");
const Achievement = require("../models/Achievement");
const ContactInfo = require("../models/ContactInfo");
const Experience = require("../models/Experience");

const seedDatabase = async () => {
  try {
    console.log("Checking and seeding database defaults if needed...");

    // 1. Seed Admin User
    const adminEmail = "sukirsukirthan21@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log(`Seeding default admin: ${adminEmail}`);
      await User.create({
        email: adminEmail,
        password: "admin123" // Default password
      });
      console.log("Default admin seeded successfully with password: admin123");
    } else {
      console.log(`Admin user '${adminEmail}' already exists in database.`);
    }

    // 2. Seed Profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      console.log("Seeding default profile information...");
      await Profile.create({
        name: "Sukirthan Chandrakumar",
        greeting: "Hello, I’m",
        title: "Full Stack Developer & AI Specialist",
        description: "Passionate about building highly optimized dynamic web applications, machine learning workflows, and cloud-native software architectures.",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
        resumeLink: "",
        email: adminEmail,
        phone: "+94 77 123 4567",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        location: "Colombo, Sri Lanka"
      });
      console.log("Default profile seeded successfully.");
    }

    // 3. Seed Contact Info
    const contactInfoCount = await ContactInfo.countDocuments();
    if (contactInfoCount === 0) {
      console.log("Seeding default contact details...");
      await ContactInfo.create({
        phone: "+94 77 123 4567",
        email: adminEmail,
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        location: "Colombo, Sri Lanka"
      });
      console.log("Default contact info seeded successfully.");
    }

    // 4. Seed Education
    const educationCount = await Education.countDocuments();
    if (educationCount === 0) {
      console.log("Seeding default education record...");
      await Education.create({
        instituteName: "University of Moratuwa",
        degree: "Bachelor of Science",
        specialization: "Artificial Intelligence & Software Engineering",
        startYear: "2022",
        endYear: "2026",
        currentStatus: true,
        gpa: "3.92 / 4.0",
        description: "Specializing in Intelligent Systems, Machine Learning algorithms, and high-performance full-stack web computing."
      });
      console.log("Default education seeded successfully.");
    }

    // 5. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      console.log("Seeding default technical skills...");
      const defaultSkills = [
        { skillName: "React.js", category: "FULLSTACK", level: "Expert", highlight: true },
        { skillName: "Node.js", category: "FULLSTACK", level: "Expert", highlight: true },
        { skillName: "ExpressJS", category: "FULLSTACK", level: "Expert", highlight: false },
        { skillName: "MongoDB", category: "DATABASE", level: "Expert", highlight: true },
        { skillName: "JavaScript", category: "PROGRAMMING_LANGUAGES", level: "Expert", highlight: true },
        { skillName: "Python", category: "PROGRAMMING_LANGUAGES", level: "Advanced", highlight: false },
        { skillName: "CSS & HTML", category: "DESIGN", level: "Expert", highlight: false },
        { skillName: "Tailwind CSS", category: "DESIGN", level: "Advanced", highlight: true },
        { skillName: "Git & GitHub", category: "TOOLS_PLATFORM", level: "Advanced", highlight: true }
      ];
      await Skill.insertMany(defaultSkills);
      console.log("Default skills seeded successfully.");
    }

    // 6. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log("Seeding default featured project...");
      await Project.create({
        projectTitle: "AI Powered Dynamic Portfolio CMS",
        description: "A high-performance CMS built with Node.js, Express, and React to manage portfolio items with real-time updates and interactive dashboards.",
        technologies: ["React", "Express", "Node.js", "MongoDB", "Tailwind CSS"],
        projectImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
        githubLink: "https://github.com",
        liveDemoLink: "https://github.com",
        category: "Full-Stack Web App",
        featured: true
      });
      console.log("Default project seeded successfully.");
    }

    // 7. Seed Achievements
    const achievementCount = await Achievement.countDocuments();
    if (achievementCount === 0) {
      console.log("Seeding default achievement card...");
      await Achievement.create({
        title: "Global AI Hackathon Winner",
        issuer: "TechCorp Labs",
        issuedDate: "2025",
        certificateLink: "https://github.com",
        description: "First place out of 500+ participants for developing an autonomous agentic system for web development."
      });
      console.log("Default achievement seeded successfully.");
    }

    // 8. Seed Experience
    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      console.log("Seeding default experience timeline...");
      await Experience.create({
        company: "Tech Solutions Ltd",
        position: "Software Engineering Intern",
        location: "Colombo, Sri Lanka",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-06-30"),
        current: false,
        description: "Assisted in building RESTful APIs using Express and Node.js. Enhanced UI responsiveness by leveraging CSS Grid and Tailwind CSS."
      });
      console.log("Default experience seeded successfully.");
    }

    console.log("All necessary defaults checked/seeded successfully!");
  } catch (error) {
    console.error("Error seeding default values to DB:", error.message);
  }
};

module.exports = seedDatabase;
