import React, { useState, useRef, useEffect } from "react";
import SectionBadge from "./SectionBadge";
import API from "../api/api";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GithubIcon = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Floating Label Input Component
function FloatInput({ label, name, type = "text", value, onChange, required, isTextarea }) {
  const inputId = `float-${name}`;
  const hasValue = value && value.length > 0;

  const sharedProps = {
    id: inputId,
    name,
    value,
    onChange,
    required,
    placeholder: " ",
    className: `float-input${hasValue ? " has-value" : ""}`,
  };

  return (
    <div className={`float-group${isTextarea ? " textarea-group" : ""}`}>
      {isTextarea ? (
        <textarea
          {...sharedProps}
          style={{ minHeight: "120px", resize: "vertical" }}
        />
      ) : (
        <input {...sharedProps} type={type} />
      )}
      <label htmlFor={inputId} className="float-label">
        {label}
      </label>
    </div>
  );
}

function Contact({ contactInfo }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneOrEmail: "",
    message: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const submitBtnRef = useRef(null);

  const phone = contactInfo?.phone || "+94 77 123 4567";
  const email = contactInfo?.email || "sukirthan@example.com";
  const github = contactInfo?.github || "https://github.com";
  const linkedin = contactInfo?.linkedin || "https://linkedin.com";
  const location = contactInfo?.location || "Colombo, Sri Lanka";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Ripple effect on button click
  const handleButtonClick = (e) => {
    const btn = submitBtnRef.current;
    if (!btn) return;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  };

  // GSAP section entrance
  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
        },
      }
    );

    const cols = sectionRef.current.querySelectorAll(".contact-col");
    gsap.fromTo(
      cols,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current.querySelector(".contact-grid"),
          start: "top 80%",
        },
      }
    );
  }, []);

  const contactItems = [
    {
      icon: <Mail size={16} />,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      color: "#00f5ff",
      bg: "rgba(0,245,255,0.06)",
      border: "rgba(0,245,255,0.15)",
    },
    {
      icon: <Phone size={16} />,
      label: "Phone",
      value: phone,
      href: `tel:${phone}`,
      color: "#a855f7",
      bg: "rgba(168,85,247,0.06)",
      border: "rgba(168,85,247,0.15)",
    },
    {
      icon: <MapPin size={16} />,
      label: "Location",
      value: location,
      href: null,
      color: "#f472b6",
      bg: "rgba(244,114,182,0.06)",
      border: "rgba(244,114,182,0.15)",
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        padding: "100px 5%",
        background: "transparent",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(0,245,255,0.04) 0%, rgba(168,85,247,0.03) 50%, transparent 80%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: "60px" }}>
          <SectionBadge text="Let's Connect" />
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>
            Get In{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Touch
            </span>
          </h2>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "1.05rem",
              marginTop: "10px",
              maxWidth: "520px",
              margin: "10px auto 0",
            }}
          >
            Have a project opportunity or question? Send a message below.
          </p>
        </div>

        {/* Two-column grid */}
        <div
          className="contact-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "32px" }}
        >
          {/* Left: Info panel */}
          <div
            className="contact-col"
            style={{
              background: "rgba(8,11,18,0.9)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px",
              padding: "32px",
              backdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              height: "fit-content",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top neon accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, #00f5ff, #a855f7)",
                borderRadius: "20px 20px 0 0",
              }}
            />

            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>
                Contact Information
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "6px" }}>
                Reach out directly or connect through socials.
              </p>
            </div>

            {/* Contact items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", alignItems: "center", gap: "14px" }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: item.bg,
                      border: `1px solid ${item.border}`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: item.color,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#475569",
                        display: "block",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        style={{
                          fontSize: "0.88rem",
                          color: "#cbd5e1",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = item.color)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e1")}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span style={{ fontSize: "0.88rem", color: "#cbd5e1" }}>
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{
                  padding: "10px",
                  borderRadius: "12px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                title="GitHub"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{
                  padding: "10px",
                  borderRadius: "12px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                title="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <form
            className="contact-col"
            onSubmit={handleFormSubmit}
            style={{
              background: "rgba(8,11,18,0.9)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px",
              padding: "32px",
              backdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top neon accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, #a855f7, #00f5ff)",
                borderRadius: "20px 20px 0 0",
              }}
            />

            {success && (
              <div
                style={{
                  background: "rgba(0,245,255,0.06)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  color: "#00f5ff",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontSize: "0.88rem",
                  fontWeight: 500,
                }}
              >
                ✓ {success}
              </div>
            )}
            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#ef4444",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontSize: "0.88rem",
                }}
              >
                {error}
              </div>
            )}

            <FloatInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <FloatInput
              label="Phone or Email Address"
              name="phoneOrEmail"
              value={formData.phoneOrEmail}
              onChange={handleInputChange}
              required
            />
            <FloatInput
              label="Your Message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              isTextarea
            />

            <button
              ref={submitBtnRef}
              type="submit"
              disabled={loading}
              onClick={handleButtonClick}
              className="btn-primary btn-submit-glow"
              id="contact-submit-btn"
              style={{
                width: "fit-content",
                marginTop: "4px",
                padding: "14px 36px",
                fontSize: "0.95rem",
                gap: "10px",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(0,0,0,0.2)",
                      borderTop: "2px solid #000",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export default Contact;
