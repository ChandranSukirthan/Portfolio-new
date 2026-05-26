import React, { useState } from "react";
import SectionBadge from "./SectionBadge";
import API from "../api/api";
import { Mail, Phone, MapPin } from "lucide-react";

// Zero-dependency SVG components to handle Lucide brand icon omission
const GithubIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

function Contact({ contactInfo }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneOrEmail: "",
    message: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    if (!formData.fullName || !formData.phoneOrEmail || !formData.message) {
      setError("Please fill in all the required form fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/contact-messages", formData);
      if (res.data.success) {
        setSuccess(res.data.message || "Your message was sent successfully!");
        setFormData({ fullName: "", phoneOrEmail: "", message: "" });
      }
    } catch (err) {
      console.error("Failed to submit contact form:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const phone = contactInfo?.phone || "+94 77 123 4567";
  const email = contactInfo?.email || "sukirthan@example.com";
  const github = contactInfo?.github || "https://github.com";
  const linkedin = contactInfo?.linkedin || "https://linkedin.com";
  const location = contactInfo?.location || "Colombo, Sri Lanka";

  return (
    <section 
      id="contact" 
      style={{
        padding: "100px 5%",
        background: "#000000",
        position: "relative",
        borderTop: "1px solid #1f2937"
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <SectionBadge text="Let's Connect" />
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>Get In Touch</h2>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginTop: "10px", maxWidth: "600px", margin: "10px auto 0" }}>
            Have a project opportunity, question, or just want to say hi? Send a message below.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "40px" }} className="contact-grid">
          
          {/* Left: Contact Info */}
          <div className="glass-panel" style={{ padding: "30px", background: "#080b12", border: "1px solid #1f2937", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "24px", height: "fit-content" }}>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>Contact Information</h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>
                Reach out directly or connect through professional socials.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Mail size={16} style={{ color: "#3b82f6" }} />
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>Email</span>
                  <a href={`mailto:${email}`} style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>{email}</a>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Phone size={16} style={{ color: "#10b981" }} />
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>Phone</span>
                  <a href={`tel:${phone}`} style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>{phone}</a>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <MapPin size={16} style={{ color: "#ef4444" }} />
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>Location</span>
                  <span style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>{location}</span>
                </div>
              </div>
            </div>

            {/* Social profiles */}
            <div style={{ display: "flex", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
              <a href={github} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: "8px", borderRadius: "50%", display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                <GithubIcon style={{ width: "18px", height: "18px" }} />
              </a>
              <a href={linkedin} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: "8px", borderRadius: "50%", display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                <LinkedinIcon style={{ width: "18px", height: "18px" }} />
              </a>
            </div>
          </div>

          {/* Right: Contact Form */}
          <form 
            onSubmit={handleFormSubmit} 
            className="glass-panel" 
            style={{ 
              padding: "30px", 
              background: "#080b12", 
              border: "1px solid #1f2937", 
              borderRadius: "16px",
              display: "flex", 
              flexDirection: "column", 
              gap: "20px" 
            }}
          >
            {success && (
              <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#10b981", padding: "12px 16px", borderRadius: "8px", fontSize: "0.9rem" }}>
                {success}
              </div>
            )}
            
            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", padding: "12px 16px", borderRadius: "8px", fontSize: "0.9rem" }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleInputChange} 
                required 
                className="input-field" 
                placeholder="Type your Name ..." 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone or Email Address</label>
              <input 
                name="phoneOrEmail" 
                value={formData.phoneOrEmail} 
                onChange={handleInputChange} 
                required 
                className="input-field" 
                placeholder="+9477 or yourName@gmail.com " 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleInputChange} 
                required 
                className="input-field" 
                style={{ minHeight: "120px", resize: "vertical" }} 
                placeholder="Write your message here..." 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary" 
              style={{ 
                width: "fit-content", 
                marginTop: "10px",
                background: "#ffffff",
                color: "#000000" 
              }}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

export default Contact;
