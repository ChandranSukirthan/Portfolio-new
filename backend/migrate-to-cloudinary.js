require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Initialize Mongoose Schemas (Mini definitions for migration)
const Profile = mongoose.models.Profile || mongoose.model("Profile", new mongoose.Schema({
  profileImage: String,
  resumeLink: String
}, { strict: false }));

const Project = mongoose.models.Project || mongoose.model("Project", new mongoose.Schema({
  projectImage: String
}, { strict: false }));

const Certificate = mongoose.models.Certificate || mongoose.model("Certificate", new mongoose.Schema({
  image: String
}, { strict: false }));

const uploadsDir = path.join(__dirname, "public", "uploads");

async function migrate() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const mongoUri = process.env.MONGO_URI;

  if (!cloudName || !uploadPreset) {
    console.error("\n=============================================================");
    console.error("ERROR: Missing Cloudinary credentials!");
    console.error("Please add the following to your backend/.env file first:");
    console.error("CLOUDINARY_CLOUD_NAME=your_cloud_name");
    console.error("CLOUDINARY_UPLOAD_PRESET=your_upload_preset");
    console.error("=============================================================\n");
    process.exit(1);
  }

  if (!mongoUri) {
    console.error("ERROR: MONGO_URI is missing from backend/.env");
    process.exit(1);
  }

  // 1. Connect to MongoDB
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB successfully!");

  // 2. Read local upload files
  if (!fs.existsSync(uploadsDir)) {
    console.log(`Uploads directory not found at: ${uploadsDir}. Nothing to migrate.`);
    process.exit(0);
  }

  const files = fs.readdirSync(uploadsDir);
  console.log(`Found ${files.length} local files in public/uploads. Starting migration...`);

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    console.log(`\nProcessing file: ${file}`);
    const relativePath = `/uploads/${file}`;

    try {
      // 3. Convert file to base64 Data URI
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(file).toLowerCase();
      let mimeType = "image/jpeg";
      if (ext === ".png") mimeType = "image/png";
      else if (ext === ".webp") mimeType = "image/webp";
      else if (ext === ".pdf") mimeType = "application/pdf";
      
      const base64Data = fileBuffer.toString("base64");
      const dataUri = `data:${mimeType};base64,${base64Data}`;

      // 4. Upload to Cloudinary via REST API
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const formPayload = new URLSearchParams();
      formPayload.append("file", dataUri);
      formPayload.append("upload_preset", uploadPreset);

      console.log(`Uploading ${file} to Cloudinary...`);
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formPayload
      });

      const cloudData = await response.json();

      if (!response.ok || cloudData.error) {
        throw new Error(cloudData.error?.message || "Upload failed");
      }

      const secureUrl = cloudData.secure_url;
      console.log(`SUCCESS: Uploaded to ${secureUrl}`);

      // 5. Update Database entries matching this relativePath
      
      // Update Profiles
      const profilesUpdated = await Profile.updateMany(
        { profileImage: relativePath },
        { profileImage: secureUrl }
      );
      if (profilesUpdated.modifiedCount > 0) {
        console.log(`- Updated profileImage in ${profilesUpdated.modifiedCount} Profile document(s)`);
      }

      const profileResumesUpdated = await Profile.updateMany(
        { resumeLink: relativePath },
        { resumeLink: secureUrl }
      );
      if (profileResumesUpdated.modifiedCount > 0) {
        console.log(`- Updated resumeLink in ${profileResumesUpdated.modifiedCount} Profile document(s)`);
      }

      // Update Projects
      const projectsUpdated = await Project.updateMany(
        { projectImage: relativePath },
        { projectImage: secureUrl }
      );
      if (projectsUpdated.modifiedCount > 0) {
        console.log(`- Updated projectImage in ${projectsUpdated.modifiedCount} Project document(s)`);
      }

      // Update Certificates
      const certsUpdated = await Certificate.updateMany(
        { image: relativePath },
        { image: secureUrl }
      );
      if (certsUpdated.modifiedCount > 0) {
        console.log(`- Updated logo image in ${certsUpdated.modifiedCount} Certificate document(s)`);
      }

    } catch (err) {
      console.error(`FAILED to migrate ${file}:`, err.message);
    }
  }

  console.log("\nMigration completed! Disconnecting from database...");
  await mongoose.disconnect();
  console.log("Disconnected. You can now push your changes to GitHub.");
}

migrate().catch(err => {
  console.error("Migration fatal error:", err);
  process.exit(1);
});
