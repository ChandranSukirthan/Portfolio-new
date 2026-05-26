import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { 
  User, Mail, FileText, Globe, 
  CheckCircle2, AlertCircle, Save, ArrowLeft, Upload, Edit3, Lock 
} from "lucide-react";

// Zero-dependency SVG components to handle Lucide brand icon omission
const Github = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Linkedin = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

function ManageProfile() {
  const [profile, setProfile] = useState({
    _id: "",
    name: "",
    greeting: "",
    title: "",
    description: "",
    profileImage: "",
    resumeLink: "",
    email: "",
    github: "",
    linkedin: ""
  });

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  
  // Feedback alerts
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password Change state
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/profile");
      if (res.data) {
        setProfile({
          _id: res.data._id || "",
          name: res.data.name || "",
          greeting: res.data.greeting || "",
          title: res.data.title || "",
          description: res.data.description || "",
          profileImage: res.data.profileImage || "",
          resumeLink: res.data.resumeLink || "",
          email: res.data.email || "",
          github: res.data.github || "",
          linkedin: res.data.linkedin || ""
        });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile details. Please try reloading the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // Upload Avatar or PDF resume
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    if (type === "image") setImageUploading(true);
    if (type === "resume") setResumeUploading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        const fileUrl = res.data.url;
        setProfile(prev => ({
          ...prev,
          [type === "image" ? "profileImage" : "resumeLink"]: fileUrl
        }));
        setSuccess(`${type === "image" ? "Profile Image" : "Resume"} uploaded successfully!`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.response?.data?.message || "File upload failed.");
    } finally {
      if (type === "image") setImageUploading(false);
      if (type === "resume") setResumeUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaveLoading(true);

    if (!profile.name) {
      setError("Name field is required.");
      setSaveLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      let res;
      if (profile._id) {
        res = await API.put(`/profile/${profile._id}`, profile, config);
      } else {
        const payload = { ...profile };
        delete payload._id;
        res = await API.post("/profile", payload, config);
      }

      if (res.data.success) {
        setSuccess("Profile updated successfully!");
        setProfile(res.data.data);
        // Refresh the profile to ensure UI reflects latest data
        fetchProfile();
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");
    setPwdLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const res = await API.post("/auth/change-password", passwords, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        setPwdSuccess("Password updated successfully!");
        setPasswords({ currentPassword: "", newPassword: "" });
      }
    } catch (err) {
      console.error("Password update error:", err);
      setPwdError(err.response?.data?.message || "Failed to update password. Please try again.");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080710", color: "#f8fafc", paddingTop: "90px", paddingBottom: "50px" }}>
      <Navbar isDashboard={true} />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
        
        {/* Navigation back */}
        <div style={{ marginBottom: "20px" }}>
          <a href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "#94a3b8" }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </a>
        </div>

        {/* Dashboard Form Card */}
        <div className="glass-panel" style={{ padding: "40px" }}>
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "20px", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
              <Edit3 size={24} style={{ color: "#3b82f6" }} />
              <span>Manage <span style={{ color: "#3b82f6" }}>Profile Home Details</span></span>
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
              Modify the exact text and links displayed in the primary portfolio Hero & About section.
            </p>
          </div>

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#f87171",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px"
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              color: "#4ade80",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px"
            }}>
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 0" }}>
              <div style={{
                width: "36px", height: "36px", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #9333ea", borderRadius: "50%", animation: "spin 0.8s linear infinite"
              }}></div>
              <p style={{ marginTop: "15px", color: "#94a3b8" }}>Loading profile record...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Media File Upload Fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Profile Image field */}
                <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
                    {profile.profileImage ? (
                      <img src={profile.profileImage.startsWith("http") ? profile.profileImage : `http://localhost:5000${profile.profileImage}`} alt="Avatar preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <User size={24} style={{ color: "#64748b" }} />
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Profile Image</span>
                    <label className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.75rem", cursor: "pointer", display: "inline-flex", gap: "6px", width: "fit-content" }}>
                      <Upload size={12} />
                      <span>{imageUploading ? "Uploading..." : "Upload Photo"}</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} style={{ display: "none" }} />
                    </label>
                  </div>
                </div>

                {/* Resume Link field */}
                <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "8px", background: "rgba(147, 51, 234, 0.04)", border: "1px dashed rgba(147, 51, 234, 0.2)", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
                    <FileText size={24} style={{ color: "#c084fc" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Curriculum Vitae</span>
                    <label className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.75rem", cursor: "pointer", display: "inline-flex", gap: "6px", width: "fit-content" }}>
                      <Upload size={12} />
                      <span>{resumeUploading ? "Uploading..." : "Upload CV PDF"}</span>
                      <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, "resume")} style={{ display: "none" }} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="form-group">
                  <label className="form-label">Greeting String</label>
                  <input name="greeting" value={profile.greeting} onChange={handleInputChange} className="input-field" placeholder="e.g. Hello, I’m" />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="name" value={profile.name} onChange={handleInputChange} className="input-field" placeholder="Sukirthan Chandrakumar" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Professional Header / Title</label>
                <input name="title" value={profile.title} onChange={handleInputChange} className="input-field" placeholder="AI undergrad specializing in Artificial Intelligence" required />
              </div>

              <div className="form-group">
                <label className="form-label">Profile Image URL (Alternative to file upload)</label>
                <input name="profileImage" value={profile.profileImage} onChange={handleInputChange} className="input-field" placeholder="https://example.com/avatar.jpg" />
              </div>

              <div className="form-group">
                <label className="form-label">Resume / CV Link URL (Alternative to file upload)</label>
                <input name="resumeLink" value={profile.resumeLink} onChange={handleInputChange} className="input-field" placeholder="https://example.com/resume.pdf" />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Bio / Description</label>
                <textarea name="description" value={profile.description} onChange={handleInputChange} className="input-field" style={{ minHeight: "120px", resize: "vertical" }} placeholder="Brief overview of studies, core competencies, and career goals..." required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: "12px", color: "#64748b" }} />
                    <input name="email" value={profile.email} onChange={handleInputChange} className="input-field" style={{ width: "100%", paddingLeft: "38px" }} placeholder="mail@example.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub Link</label>
                  <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                    <Github size={16} style={{ position: "absolute", left: "12px", color: "#64748b" }} />
                    <input name="github" value={profile.github} onChange={handleInputChange} className="input-field" style={{ width: "100%", paddingLeft: "38px" }} placeholder="https://github.com/..." />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">LinkedIn Link</label>
                  <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                    <Linkedin size={16} style={{ position: "absolute", left: "12px", color: "#64748b" }} />
                    <input name="linkedin" value={profile.linkedin} onChange={handleInputChange} className="input-field" style={{ width: "100%", paddingLeft: "38px" }} placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={saveLoading} className="btn-primary" style={{ width: "fit-content", marginTop: "10px" }}>
                {saveLoading ? (
                  <span className="spinner" style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }}></span>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Home Settings</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

        {/* Change Password Card */}
        <div className="glass-panel" style={{ padding: "40px", marginTop: "30px" }}>
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "20px", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
              <Lock size={24} style={{ color: "#3b82f6" }} />
              <span>Change <span style={{ color: "#3b82f6" }}>Security Password</span></span>
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
              Update the administrator password for the login credentials of sukirsukirthan21@gmail.com.
            </p>
          </div>

          {pwdError && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#f87171",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px"
            }}>
              <AlertCircle size={18} />
              <span>{pwdError}</span>
            </div>
          )}

          {pwdSuccess && (
            <div style={{
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              color: "#4ade80",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px"
            }}>
              <CheckCircle2 size={18} />
              <span>{pwdSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "12px", color: "#64748b" }} />
                  <input
                    type="password"
                    required
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="input-field"
                    style={{ width: "100%", paddingLeft: "38px" }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "12px", color: "#64748b" }} />
                  <input
                    type="password"
                    required
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="input-field"
                    style={{ width: "100%", paddingLeft: "38px" }}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={pwdLoading} className="btn-primary" style={{ width: "fit-content", marginTop: "10px" }}>
              {pwdLoading ? (
                <span className="spinner" style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }}></span>
              ) : (
                <>
                  <Save size={18} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ManageProfile;
