import { ArrowRight, Download } from "lucide-react";
import { getBackendBase } from "../api/api";
import { downloadFile } from "../utils/download";

function Hero({ profile }) {
  // Fallbacks
  const greeting = profile?.greeting || "Hello, I'm";
  const name = profile?.name || "Sukirthan Chandrakumar";
  const description =
    profile?.description ||
    "AI undergraduate specializing in Artificial Intelligence, skilled in MERN stack, machine learning, and full-stack web development. Experienced in building scalable web applications and AI-powered systems. Seeking internship opportunities to contribute to innovative projects.";
  const title = profile?.title || "AI & Full-stack Developer";

  const backendBase = getBackendBase();
  const profileImage = profile?.profileImage
    ? profile.profileImage.startsWith("http") || profile.profileImage.startsWith("data:")
      ? profile.profileImage
      : `${backendBase}${profile.profileImage}`
    : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop";

  const resumeLink = profile?.resumeLink
    ? profile.resumeLink.startsWith("http") || profile.resumeLink.startsWith("data:")
      ? profile.resumeLink
      : `${backendBase}${profile.resumeLink}`
    : profile?.cv
    ? profile.cv.startsWith("http") || profile.cv.startsWith("data:")
      ? profile.cv
      : `${backendBase}${profile.cv}`
    : "#";

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 5% 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* Radial gradient overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(3,7,18,0.82) 0%, rgba(3,7,18,0.45) 60%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        className="hero-grid"
        style={{
          maxWidth: "1100px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "60px",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left Side: Introduction Text */}
        <div
          className="hero-text-side"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {/* Greeting badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                display: "inline-block",
                width: "32px",
                height: "2px",
                background: "linear-gradient(90deg, #00f5ff, #a855f7)",
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#00f5ff",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {greeting}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                color: "#fff",
                letterSpacing: "-0.03em",
              }}
            >
              {name}
            </h1>
            <h2
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)",
                fontWeight: 600,
                marginTop: "4px",
                background: "linear-gradient(90deg, #00f5ff, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </h2>
          </div>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "1.05rem",
              lineHeight: 1.75,
              maxWidth: "560px",
            }}
          >
            {description}
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px" }}>
            <button
              onClick={scrollToContact}
              className="btn-primary btn-submit-glow"
              id="hero-contact-btn"
              style={{ padding: "14px 32px", fontSize: "0.95rem" }}
            >
              <span>Contact Me</span>
              <ArrowRight size={16} />
            </button>

            {resumeLink !== "#" && (
              <button
                onClick={() => downloadFile(resumeLink, "Sukirthan_Resume.pdf")}
                className="btn-secondary"
                style={{ padding: "14px 32px", fontSize: "0.95rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Download size={16} />
                <span>Download Resume</span>
              </button>
            )}
          </div>

          {/* Scroll hint */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "16px",
              color: "#475569",
              fontSize: "0.8rem",
            }}
          >
            <div className="scroll-indicator" />
            <span>Scroll to explore</span>
          </div>
        </div>

        {/* Right Side: Profile Image with animated rings */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: "var(--ring-size, 500px)",
          }}
          className="hero-image-side"
        >
          {/* Outer orbit ring */}
          <div
            style={{
              position: "absolute",
              width: "var(--ring-size, 500px)",
              height: "var(--ring-size, 500px)",
              borderRadius: "50%",
              border: "1px solid rgba(0, 245, 255, 0.12)",
              animation: "spin-counterclockwise 25s linear infinite",
            }}
          />

          {/* Dashed middle ring */}
          <div
            style={{
              position: "absolute",
              width: "calc(var(--ring-size, 500px) * 0.85)",
              height: "calc(var(--ring-size, 500px) * 0.85)",
              borderRadius: "50%",
              border: "1px dashed rgba(168, 85, 247, 0.2)",
              animation: "spin-clockwise 18s linear infinite",
            }}
          />

          {/* Orbiting dot */}
          <div
            style={{
              position: "absolute",
              width: "var(--ring-size, 500px)",
              height: "var(--ring-size, 500px)",
              borderRadius: "50%",
              animation: "spin-clockwise 8s linear infinite",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "6px",
                left: "50%",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#00f5ff",
                boxShadow: "0 0 12px #00f5ff, 0 0 24px rgba(0,245,255,0.5)",
                transform: "translateX(-50%)",
              }}
            />
          </div>

          {/* Avatar */}
          <div
            style={{
              width: "var(--avatar-size, 320px)",
              height: "var(--avatar-size, 320px)",
              borderRadius: "50%",
              padding: "4px",
              background: "linear-gradient(135deg, #00f5ff 0%, #a855f7 100%)",
              boxShadow:
                "0 0 50px rgba(0, 245, 255, 0.25), 0 0 100px rgba(168, 85, 247, 0.15)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
            className="profile-avatar-container"
          >
            <img
              src={profileImage}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #030712",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --avatar-size: 320px;
          --ring-size: 440px;
        }

        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-counterclockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        .scroll-indicator {
          width: 20px;
          height: 34px;
          border: 2px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          position: relative;
        }
        .scroll-indicator::after {
          content: '';
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 8px;
          background: #00f5ff;
          border-radius: 2px;
          animation: scroll-bounce 1.6s ease-in-out infinite;
        }
        @keyframes scroll-bounce {
          0%, 100% { opacity: 1; top: 5px; }
          50% { opacity: 0.3; top: 16px; }
        }

        @media (max-width: 1024px) {
          :root { --avatar-size: 260px; --ring-size: 340px; }
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 50px !important;
            text-align: center !important;
          }
          .hero-text-side { align-items: center !important; }
          .hero-text-side p { margin: 0 auto !important; }
          .hero-text-side > div { justify-content: center !important; }
        }
        @media (max-width: 480px) {
          :root { --avatar-size: 200px; --ring-size: 260px; }
        }
      `}</style>
    </section>
  );
}

export default Hero;
