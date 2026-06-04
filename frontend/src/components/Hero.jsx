import { ArrowRight, Download } from "lucide-react";
import { getBackendBase } from "../api/api";

function Hero({ profile }) {
  // Fallbacks
  const greeting = profile?.greeting || "Hello, I’m";
  const name = profile?.name || "Sukirthan Chandrakumar";
  const description = profile?.description || 
    "AI undergraduate specializing in Artificial Intelligence, skilled in MERN stack, machine learning, and full-stack web development. Experienced in building scalable web applications and AI-powered systems. Seeking internship opportunities to contribute to innovative projects.";
  const title = profile?.title || "AI & Full-stack Developer";
  
  const backendBase = getBackendBase();
  const profileImage = profile?.profileImage 
    ? (profile.profileImage.startsWith("http") ? profile.profileImage : `${backendBase}${profile.profileImage}`)
    : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop";

  const resumeLink = profile?.resumeLink 
    ? (profile.resumeLink.startsWith("http") ? profile.resumeLink : `${backendBase}${profile.resumeLink}`)
    : (profile?.cv ? `${backendBase}${profile.cv}` : "#");

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
        background: "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 60%)"
      }}
    >
      <div 
        style={{
          maxWidth: "1100px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "60px",
          alignItems: "center"
        }}
        className="hero-grid"
      >
        {/* Left Side: Introduction Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <span 
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#60a5fa",
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}
          >
            {greeting}
          </span>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h1 
              style={{ 
                fontSize: "3.5rem", 
                fontWeight: 800, 
                lineHeight: 1.1,
                color: "#fff",
                letterSpacing: "-0.02em"
              }}
            >
              {name}
            </h1>
            <h2 
              style={{ 
                fontSize: "1.75rem", 
                fontWeight: 600,
                color: "#06b6d4",
                marginTop: "4px"
              }}
            >
              {title}
            </h2>
          </div>

          <p 
            style={{ 
              color: "#94a3b8", 
              fontSize: "1.05rem", 
              lineHeight: 1.7,
              maxWidth: "600px"
            }}
          >
            {description}
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "15px" }}>
            <button 
              onClick={scrollToContact} 
              className="btn-primary"
              style={{ padding: "14px 28px", fontSize: "0.95rem", background: "linear-gradient(90deg, #3b82f6, #06b6d4)", border: "none", color: "#fff" }}
            >
              <span>Contact Me</span>
              <ArrowRight size={16} />
            </button>
            
            {resumeLink !== "#" && (
              <a 
                href={resumeLink} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-secondary"
                style={{ padding: "14px 28px", fontSize: "0.95rem" }}
                download
              >
                <Download size={16} />
                <span>Download Resume</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Side: Circular Profile Image with Animated Border Rings */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            position: "relative",
            height: "400px"
          }}
        >
          {/* Animated Glowing Outer Ring (Circle 1) */}
          <div 
            style={{
              position: "absolute",
              width: "500px",
              height: "500px",
              borderRadius: "60%",
              border: "1.5px solid rgba(6, 182, 212, 0.2)",
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.1)",
              animation: "spin-counterclockwise 20s linear infinite"
            }}
          />

          {/* Avatar Container with Gradient Border (Circle 2) */}
          <div 
            style={{
              width: "450px",
              height: "450px",
              borderRadius: "50%",
              padding: "8px",
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              boxShadow: "0 0 40px rgba(59, 130, 246, 0.35)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2
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
                border: "4px solid #0f0d22"
              }}
            />
          </div>
        </div>
      </div>

      {/* Styled Animations */}
      <style>{`
        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-counterclockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center !important;
          }
          .hero-grid > div {
            align-items: center !important;
          }
          .hero-grid p {
            margin: 0 auto !important;
          }
          .hero-grid div {
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;
