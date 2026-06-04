import React, { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { Phone, Mail, MapPin, Save } from "lucide-react";

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

function ManageContactInfo() {
  const [formData, setFormData] = useState({
    _id: "",
    phone: "",
    email: "",
    github: "",
    linkedin: "",
    location: ""
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/contact-info");
      if (res.data) {
        setFormData({
          _id: res.data._id || "",
          phone: res.data.phone || "",
          email: res.data.email || "",
          github: res.data.github || "",
          linkedin: res.data.linkedin || "",
          location: res.data.location || ""
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch contact details from backend API.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setActionLoading(true);

    if (!formData.email) {
      setError("Email address is a required field.");
      setActionLoading(false);
      return;
    }

    try {
      if (formData._id) {
        const res = await API.put(`/contact-info/${formData._id}`, formData);
        if (res.data.success) {
          setSuccess("Contact details updated successfully!");
          setFormData(res.data.data);
        }
      } else {
        const payload = { ...formData };
        delete payload._id;
        const res = await API.post("/contact-info", payload);
        if (res.data.success) {
          setSuccess("Contact details created successfully!");
          setFormData(res.data.data);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save contact details.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <Navbar isDashboard={true} />
      <AdminSidebar />

      <main className="admin-main">
        {/* Title */}
        <div style={{ borderBottom: "1px solid #1f2937", paddingBottom: "20px", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>
            Manage <span style={{ color: "#3b82f6" }}>Contact Info</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
            Maintain details shown in the portfolio contact sidebar (phone, email, social links, and physical location).
          </p>
        </div>

        {success && (
          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#10b981", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px" }}>
            {success}
          </div>
        )}
        
        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <div style={{ width: "30px", height: "30px", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
          </div>
        ) : (
          <form 
            onSubmit={handleFormSubmit} 
            className="glass-panel" 
            style={{ 
              padding: "40px", 
              background: "#080b12", 
              border: "1px solid #1f2937", 
              borderRadius: "16px",
              display: "flex", 
              flexDirection: "column", 
              gap: "24px" 
            }}
          >
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Phone size={16} style={{ position: "absolute", left: "12px", color: "#64748b" }} />
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    className="input-field" 
                    style={{ width: "100%", paddingLeft: "38px" }} 
                    placeholder="+94 77 123 4567" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Mail size={16} style={{ position: "absolute", left: "12px", color: "#64748b" }} />
                  <input 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    className="input-field" 
                    style={{ width: "100%", paddingLeft: "38px" }} 
                    placeholder="sukirthan@example.com" 
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">GitHub Account URL</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Github size={16} style={{ position: "absolute", left: "12px", color: "#64748b" }} />
                  <input 
                    name="github" 
                    value={formData.github} 
                    onChange={handleInputChange} 
                    className="input-field" 
                    style={{ width: "100%", paddingLeft: "38px" }} 
                    placeholder="https://github.com/username" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Linkedin size={16} style={{ position: "absolute", left: "12px", color: "#64748b" }} />
                  <input 
                    name="linkedin" 
                    value={formData.linkedin} 
                    onChange={handleInputChange} 
                    className="input-field" 
                    style={{ width: "100%", paddingLeft: "38px" }} 
                    placeholder="https://linkedin.com/in/username" 
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <MapPin size={16} style={{ position: "absolute", left: "12px", color: "#64748b" }} />
                <input 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  className="input-field" 
                  style={{ width: "100%", paddingLeft: "38px" }} 
                  placeholder="Colombo, Sri Lanka" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={actionLoading} 
              className="btn-primary" 
              style={{ 
                width: "fit-content", 
                marginTop: "10px",
                background: "#ffffff",
                color: "#000000" 
              }}
            >
              <Save size={18} />
              <span>{actionLoading ? "Saving..." : "Save Contact Info"}</span>
            </button>
          </form>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ManageContactInfo;
