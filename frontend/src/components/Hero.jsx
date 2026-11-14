import { useState, useRef, useEffect } from "react";
import { ArrowRight, Download, Play, Volume2, Video } from "lucide-react";
import { getBackendBase } from "../api/api";
import { downloadFile } from "../utils/download";
import { gsap } from "gsap";

function Hero({ profile }) {
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

  const avatarContainerRef = useRef(null);
  const avatarWrapperRef = useRef(null);
  const ringsRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // "profile" = show profile photo | "video" = show 3D video
  const [currentMedia, setCurrentMedia] = useState("profile");

  // ── Play 3D Video button ──────────────────────────────────────────────────
  const handlePlayVideo = () => {
    setCurrentMedia("video");
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.volume = 1.0;
      videoRef.current.muted = false;
      videoRef.current.play().catch((err) => {
        console.warn("Video play error:", err);
      });
    }
  };

  // ── Play Voice / Audio button ─────────────────────────────────────────────
  const handlePlayVoice = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch((err) => {
        console.warn("Audio play error:", err);
      });
    }
  };

  // When video ends → back to profile photo
  const handleVideoEnded = () => {
    setCurrentMedia("profile");
  };

  // Clicking the avatar while video plays → stop & return to profile
  const handleAvatarClick = () => {
    if (currentMedia === "video") {
      if (videoRef.current) videoRef.current.pause();
      setCurrentMedia("profile");
    }
  };

  // Pause video if tab hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // 3D Entrance Animation
  useEffect(() => {
    if (avatarWrapperRef.current) {
      gsap.fromTo(
        avatarWrapperRef.current,
        { scale: 1.5, opacity: 0, rotationY: -20, rotationX: 12, filter: "blur(12px)" },
        { scale: 1, opacity: 1, rotationY: 0, rotationX: 0, filter: "blur(0px)", duration: 1.5, ease: "power3.out", delay: 0.2 }
      );
    }
    if (ringsRef.current) {
      gsap.fromTo(
        ringsRef.current,
        { scale: 2, opacity: 0, rotation: -90 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.6, ease: "expo.out", delay: 0.1 }
      );
    }
  }, []);

  // Mouse 3D tilt
  const handleMouseMove = (e) => {
    if (!avatarContainerRef.current) return;
    const rect = avatarContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };
  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

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
      {/* Hidden audio element for voice-only playback */}
      <audio ref={audioRef} src="/profile-3d.mp4" preload="auto" style={{ display: "none" }} />

      {/* Radial gradient overlay */}
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

      {/* Content Grid */}
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
        {/* Left: Text */}
        <div className="hero-text-side" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ display: "inline-block", width: "32px", height: "2px", background: "linear-gradient(90deg, #00f5ff, #38bdf8)", borderRadius: "2px" }} />
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "#00f5ff", letterSpacing: "0.08em", textTransform: "uppercase" }}>{greeting}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.08, color: "#fff", letterSpacing: "-0.03em" }}>{name}</h1>
            <h2 style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)", fontWeight: 600, marginTop: "4px", background: "linear-gradient(90deg, #00f5ff, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{title}</h2>
          </div>

          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.75, maxWidth: "560px" }}>{description}</p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px", alignItems: "center" }}>
            <button onClick={scrollToContact} className="btn-primary btn-submit-glow" id="hero-contact-btn" style={{ padding: "14px 32px", fontSize: "0.95rem" }}>
              <span>Contact Me</span>
              <ArrowRight size={16} />
            </button>
            {resumeLink !== "#" && (
              <button onClick={() => downloadFile(resumeLink, "Sukirthan_Resume.pdf")} className="btn-secondary" style={{ padding: "14px 28px", fontSize: "0.95rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <Download size={16} />
                <span>Download Resume</span>
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", color: "#475569", fontSize: "0.8rem" }}>
            <div className="scroll-indicator" />
            <span>Scroll to explore</span>
          </div>
        </div>

        {/* Right: Avatar with 2 Rings + Buttons */}
        <div
          ref={avatarContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            perspective: "1200px",
            gap: "0px",
          }}
          className="hero-image-side"
        >
          {/* Rings wrapper */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>

            {/* ── Ring Layer (behind avatar) ── */}
            <div
              ref={ringsRef}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              {/* Outer dashed ring */}
              <div
                style={{
                  position: "absolute",
                  width: "calc(var(--avatar-size, 320px) + 86px)",
                  height: "calc(var(--avatar-size, 320px) + 86px)",
                  borderRadius: "50%",
                  border: "1.5px dashed rgba(56, 189, 248, 0.35)",
                  animation: "spin-counter 28s linear infinite",
                }}
              />
              {/* Inner dashed ring */}
              <div
                style={{
                  position: "absolute",
                  width: "calc(var(--avatar-size, 320px) + 46px)",
                  height: "calc(var(--avatar-size, 320px) + 46px)",
                  borderRadius: "50%",
                  border: "1.5px dashed rgba(0, 245, 255, 0.4)",
                  animation: "spin-clockwise 20s linear infinite",
                }}
              />
            </div>

            {/* ── 3D Interactive Avatar Wrapper ── */}
            <div
              ref={avatarWrapperRef}
              className="avatar-3d-interactive"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg) translateZ(${Math.abs(mousePos.x) * 8}px)`,
                transition: "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)",
                transformStyle: "preserve-3d",
                position: "relative",
                zIndex: 3,
              }}
            >
              {/* Circular frame with gradient border */}
              <div
                style={{
                  width: "var(--avatar-size, 320px)",
                  height: "var(--avatar-size, 320px)",
                  borderRadius: "50%",
                  padding: "5px",
                  background: "linear-gradient(135deg, #00f5ff 0%, #38bdf8 50%, #1d4ed8 100%)",
                  boxShadow: "0 0 45px rgba(0, 245, 255, 0.4), 0 0 85px rgba(56, 189, 248, 0.25)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                  cursor: currentMedia === "video" ? "pointer" : "default",
                }}
                className="profile-avatar-container"
                onClick={handleAvatarClick}
                title={currentMedia === "video" ? "Click to return to profile photo" : ""}
              >
                {/* Video element */}
                <video
                  ref={videoRef}
                  src="/profile-3d.mp4"
                  preload="auto"
                  playsInline
                  onEnded={handleVideoEnded}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #030712",
                    background: "#030712",
                    opacity: currentMedia === "video" ? 1 : 0,
                    pointerEvents: currentMedia === "video" ? "auto" : "none",
                    transition: "opacity 0.6s ease-in-out",
                    zIndex: currentMedia === "video" ? 2 : 1,
                  }}
                />

                {/* Profile Image */}
                <img
                  src={profileImage}
                  alt={name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #030712",
                    background: "#030712",
                    opacity: currentMedia === "profile" ? 1 : 0,
                    pointerEvents: currentMedia === "profile" ? "auto" : "none",
                    transition: "opacity 0.6s ease-in-out",
                    zIndex: currentMedia === "profile" ? 2 : 1,
                  }}
                />

                {/* Glass reflection overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%, rgba(0,245,255,0.08) 100%)",
                    pointerEvents: "none",
                    zIndex: 5,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── "3D LIVE AVATAR" badge (shown while video plays) ── */}
          <div
            style={{
              marginTop: "-4px",
              opacity: currentMedia === "video" ? 1 : 0,
              transform: currentMedia === "video" ? "translateY(0px) scale(1)" : "translateY(8px) scale(0.9)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                borderRadius: "24px",
                background: "rgba(3, 7, 18, 0.88)",
                border: "1px solid rgba(0, 245, 255, 0.35)",
                boxShadow: "0 4px 20px rgba(0, 245, 255, 0.18)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 8px #00f5ff", display: "inline-block", animation: "pulse-dot 1.4s ease-in-out infinite" }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.12em", textTransform: "uppercase" }}>✦ 3D Live Avatar</span>
            </div>
          </div>

          {/* ── Voice & 3D Video buttons (shown when profile photo is active) ── */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: currentMedia === "video" ? "0px" : "16px",
              opacity: currentMedia === "profile" ? 1 : 0,
              transform: currentMedia === "profile" ? "translateY(0px)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              pointerEvents: currentMedia === "profile" ? "auto" : "none",
            }}
          >
            {/* Voice button */}
            <button onClick={handlePlayVoice} className="avatar-action-btn" style={{}}>
              <Volume2 size={14} />
              <span>Voice</span>
              <span style={{ fontSize: "0.9rem" }}>🎧</span>
            </button>

            {/* 3D Video button */}
            <button onClick={handlePlayVideo} className="avatar-action-btn" style={{}}>
              <Play size={14} style={{ marginLeft: "1px" }} />
              <span>3D Video</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --avatar-size: 320px;
        }

        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-counter {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        .avatar-3d-interactive {
          animation: avatar-float 5s ease-in-out infinite alternate;
        }
        @keyframes avatar-float {
          0%   { transform: translateY(0px) rotateZ(0deg); }
          100% { transform: translateY(-10px) rotateZ(1deg); }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }

        /* Avatar action buttons */
        .avatar-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          border-radius: 24px;
          background: rgba(3, 7, 18, 0.82);
          border: 1px solid rgba(0, 245, 255, 0.3);
          color: #e2e8f0;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.03em;
          box-shadow: 0 4px 18px rgba(0, 245, 255, 0.12);
          backdrop-filter: blur(10px);
          transition: background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, transform 0.18s ease;
        }
        .avatar-action-btn:hover {
          background: rgba(0, 245, 255, 0.12);
          border-color: rgba(0, 245, 255, 0.6);
          box-shadow: 0 6px 28px rgba(0, 245, 255, 0.28);
          transform: translateY(-2px);
        }
        .avatar-action-btn:active {
          transform: translateY(0px) scale(0.97);
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
          50%       { opacity: 0.3; top: 16px; }
        }

        @media (max-width: 1024px) {
          :root { --avatar-size: 260px; }
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
          :root { --avatar-size: 210px; }
        }
      `}</style>
    </section>
  );
}

export default Hero;
