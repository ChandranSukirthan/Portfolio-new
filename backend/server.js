const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

/* ===============================
   CORS CONFIGURATION
   =============================== */

// Add your frontend URLs here
const allowedOrigins = [
  "http://localhost:5173", // Vite local frontend
  "http://localhost:3000", // React/Next local frontend
  process.env.FRONTEND_URL // Vercel frontend URL from Render environment variable
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin like Postman, mobile apps, server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ===============================
   MIDDLEWARE
   =============================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===============================
   IMPORT ROUTES
   =============================== */

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const educationRoutes = require("./routes/educationRoutes");
const skillRoutes = require("./routes/skillRoutes");
const projectRoutes = require("./routes/projectRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const contactInfoRoutes = require("./routes/contactInfoRoutes");
const contactMessageRoutes = require("./routes/contactMessageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const experienceRoutes = require("./routes/experienceRoutes");

/* ===============================
   REGISTER ROUTES
   =============================== */

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/contact-info", contactInfoRoutes);
app.use("/api/contact-messages", contactMessageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/experience", experienceRoutes);

/* ===============================
   ROOT ENDPOINT
   =============================== */

app.get("/", (req, res) => {
  res.send("Portfolio CMS backend is running successfully...");
});

/* ===============================
   GLOBAL ERROR HANDLER
   =============================== */

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS error: This frontend URL is not allowed"
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

/* ===============================
   DATABASE CONNECTION
   =============================== */

const seedDatabase = require("./config/seed");

const connectWithFallback = async () => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = "mongodb://127.0.0.1:27017/portfolio";

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(primaryUri);
    console.log("MongoDB Atlas connected successfully...");
  } catch (err) {
    console.error("MongoDB Atlas connection failed:", err.message);

    // Local fallback is useful only for local development
    if (process.env.NODE_ENV === "production") {
      throw new Error("MongoDB Atlas connection failed in production");
    }

    console.log("Attempting fallback connection to local MongoDB...");

    try {
      await mongoose.connect(fallbackUri);
      console.log("Local MongoDB connected successfully!");
    } catch (localErr) {
      console.error("Local MongoDB fallback also failed:", localErr.message);
      console.error("\n=========================================================================");
      console.error("DATABASE CONNECTION ERROR:");
      console.error("Could not connect to MongoDB Atlas or local MongoDB.");
      console.error("1. Please check your internet connection.");
      console.error("2. Verify that your MONGO_URI in backend/.env is correct.");
      console.error("3. If using local MongoDB, ensure the service is running.");
      console.error("=========================================================================\n");

      throw new Error("Database connection failed");
    }
  }
};

/* ===============================
   START SERVER
   =============================== */

connectWithFallback()
  .then(async () => {
    // Auto-seed default values
    await seedDatabase();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to start server due to connection error.");
    console.error(err.message);
  });