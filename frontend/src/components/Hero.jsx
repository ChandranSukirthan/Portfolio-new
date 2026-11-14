import { useState, useRef, useEffect } from "react";
import { ArrowRight, Download, Volume2, VolumeX, Play, Sparkles, X } from "lucide-react";
import { getBackendBase } from "../api/api";
import { downloadFile } from "../utils/download";
import { gsap } from "gsap";

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

  const avatarContainerRef = useRef(null);
  const avatarWrapperRef = useRef(null);
  const ringsRef = useRef(null);
  const audioRef = useRef(null);
  const modalVideoRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Toggle Intro Voice Audio Playback
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      if (modalVideoRef.current && !modalVideoRef.current.paused) {
        modalVideoRef.current.pause();
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
        });
    }
  };

  const handleOpenVideoModal = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    setShowVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setShowVideoModal(false);
  };

  // 3D Entrance Animation: Glides smoothly inside on load
  useEffect(() => {
    if (avatarWrapperRef.current) {
      gsap.fromTo(
        avatarWrapperRef.current,
        {
          scale: 1.6,
          opacity: 0,
          rotationY: -25,
          rotationX: 15,
          filter: "blur(12px) drop-shadow(0 0 50px rgba(0, 245, 255, 0.7))",
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          rotationX: 0,
          filter: "blur(0px) drop-shadow(0 0 35px rgba(0, 245, 255, 0.25))",
          duration: 1.6,
          ease: "power3.out",
          delay: 0.25,
        }
      );
    }

    if (ringsRef.current) {
      gsap.fromTo(
        ringsRef.current,
        {
          scale: 2.2,
          opacity: 0,
          rotation: -120,
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.8,
          ease: "expo.out",
          delay: 0.1,
        }
      );
    }
  }, []);

  // Interactive 3D tilt tracking with mouse movement
  const handleMouseMove = (e) => {
    if (!avatarContainerRef.current) return;
    const rect = avatarContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

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
                background: "linear-gradient(90deg, #00f5ff, #38bdf8)",
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
                background: "linear-gradient(90deg, #00f5ff, #38bdf8)",
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
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "8px", alignItems: "center" }}>
            <button
              onClick={scrollToContact}
              className="btn-primary btn-submit-glow"
              id="hero-contact-btn"
              style={{ padding: "14px 28px", fontSize: "0.95rem" }}
            >
              <span>Contact Me</span>
              <ArrowRight size={16} />
            </button>

            {/* Voice Intro Greeting Audio Button */}
            <button
              onClick={toggleAudio}
              className="btn-secondary"
              style={{
                padding: "14px 24px",
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                borderColor: isPlayingAudio ? "#00f5ff" : "rgba(0, 245, 255, 0.35)",
                background: isPlayingAudio ? "rgba(0, 245, 255, 0.12)" : "rgba(3, 7, 18, 0.6)",
                boxShadow: isPlayingAudio ? "0 0 20px rgba(0, 245, 255, 0.35)" : "none",
                color: "#fff",
                transition: "all 0.3s ease",
              }}
              title="Click to play/pause voice greeting"
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 size={18} color="#00f5ff" />
                  <span style={{ color: "#00f5ff", fontWeight: 600 }}>Pause Voice</span>
                  <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "14px" }}>
                    <span className="sound-bar bar-1" />
                    <span className="sound-bar bar-2" />
                    <span className="sound-bar bar-3" />
                    <span className="sound-bar bar-4" />
                  </div>
                </>
              ) : (
                <>
                  <Volume2 size={18} color="#38bdf8" />
                  <span>Voice Intro 🔊</span>
                </>
              )}
            </button>

            {/* Watch 3D Video Intro Button */}
            <button
              onClick={handleOpenVideoModal}
              className="btn-secondary"
              style={{
                padding: "14px 22px",
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderColor: "rgba(56, 189, 248, 0.4)",
                color: "#38bdf8",
              }}
              title="Watch 3D animated intro with audio"
            >
              <Play size={15} fill="#38bdf8" />
              <span>3D Intro Video</span>
            </button>

            {resumeLink !== "#" && (
              <button
                onClick={() => downloadFile(resumeLink, "Sukirthan_Resume.pdf")}
                className="btn-secondary"
                style={{ padding: "14px 24px", fontSize: "0.95rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Download size={16} />
                <span>Resume</span>
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

        {/* Right Side: Profile Image with 3D Animated Rings */}
        <div
          ref={avatarContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: "var(--ring-size, 500px)",
            perspective: "1200px",
          }}
          className="hero-image-side"
        >
          {/* Animated Cosmic Rings Group */}
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
            {/* Outer orbit ring */}
            <div
              style={{
                position: "absolute",
                width: "var(--ring-size, 500px)",
                height: "var(--ring-size, 500px)",
                borderRadius: "50%",
                border: "1.5px solid rgba(0, 245, 255, 0.16)",
                boxShadow: "0 0 25px rgba(0, 245, 255, 0.08) inset",
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
                border: "1.5px dashed rgba(56, 189, 248, 0.28)",
                animation: "spin-clockwise 18s linear infinite",
              }}
            />

            {/* Orbiting celestial beacon */}
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
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#00f5ff",
                  boxShadow: "0 0 14px #00f5ff, 0 0 28px rgba(0,245,255,0.6)",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </div>

          {/* 3D Profile Image Wrapper with Dynamic Tilt & Floating Animation */}
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
            {/* Circular Shell with Dark & Light Blue Neon Borders */}
            <div
              style={{
                width: "var(--avatar-size, 320px)",
                height: "var(--avatar-size, 320px)",
                borderRadius: "50%",
                padding: "5px",
                background: "linear-gradient(135deg, #00f5ff 0%, #38bdf8 50%, #1d4ed8 100%)",
                boxShadow:
                  "0 0 50px rgba(0, 245, 255, 0.35), 0 0 90px rgba(56, 189, 248, 0.25)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
              className="profile-avatar-container"
            >
              {/* Profile Image */}
              <img
                src={profileImage}
                alt={name}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #030712",
                  background: "#030712",
                  display: "block",
                }}
              />

              {/* Subtle glass reflection overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%, rgba(0,245,255,0.08) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Quick Interactive Audio & 3D Video Floating Badges */}
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                zIndex: 10,
                whiteSpace: "nowrap",
              }}
            >
              <button
                onClick={toggleAudio}
                style={{
                  background: isPlayingAudio
                    ? "linear-gradient(135deg, #00f5ff, #38bdf8)"
                    : "rgba(3, 7, 18, 0.9)",
                  color: isPlayingAudio ? "#030712" : "#00f5ff",
                  border: "1.5px solid rgba(0, 245, 255, 0.6)",
                  borderRadius: "9999px",
                  padding: "7px 14px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 18px rgba(0, 245, 255, 0.3)",
                  transition: "all 0.25s ease",
                }}
                title="Toggle voice intro sound"
              >
                {isPlayingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isPlayingAudio ? "Mute Voice" : "Voice 🔊"}</span>
              </button>

              <button
                onClick={handleOpenVideoModal}
                style={{
                  background: "rgba(3, 7, 18, 0.9)",
                  color: "#38bdf8",
                  border: "1.5px solid rgba(56, 189, 248, 0.5)",
                  borderRadius: "9999px",
                  padding: "7px 14px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 14px rgba(56, 189, 248, 0.2)",
                  transition: "all 0.25s ease",
                }}
                title="Watch 3D animated video"
              >
                <Play size={13} fill="#38bdf8" />
                <span>3D Video</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element for High Fidelity Voice Intro */}
      <audio
        ref={audioRef}
        src="/intro-audio.m4a"
        preload="auto"
        onEnded={() => setIsPlayingAudio(false)}
      />

      {/* Interactive 3D Animated Video Modal (With Unmuted Sound) */}
      {showVideoModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(3, 7, 18, 0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={handleCloseVideoModal}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "520px",
              background: "linear-gradient(145deg, #071529 0%, #030712 100%)",
              border: "1.5px solid rgba(0, 245, 255, 0.4)",
              borderRadius: "24px",
              boxShadow: "0 0 60px rgba(0, 245, 255, 0.3), 0 25px 50px rgba(0, 0, 0, 0.8)",
              overflow: "hidden",
              padding: "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={18} color="#00f5ff" />
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.01em",
                  }}
                >
                  3D Animated Intro & Voice
                </h3>
              </div>
              <button
                onClick={handleCloseVideoModal}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(0, 245, 255, 0.2)",
                  borderRadius: "50%",
                  width: "34px",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                title="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Video Player With Audio */}
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(0, 245, 255, 0.25)",
                background: "#000",
                position: "relative",
              }}
            >
              <video
                ref={modalVideoRef}
                src="/profile-3d.mp4"
                controls
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "65vh",
                  display: "block",
                  borderRadius: "16px",
                }}
              />
            </div>

            {/* Modal Footer */}
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                🔊 Sound is enabled. Use the video volume slider if needed.
              </p>
              <button
                onClick={handleCloseVideoModal}
                className="btn-primary"
                style={{ padding: "8px 22px", fontSize: "0.85rem" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        :root {
          --avatar-size: 320px;
          --ring-size: 460px;
        }

        .sound-bar {
          display: inline-block;
          width: 3px;
          background: #00f5ff;
          border-radius: 2px;
        }
        .bar-1 { height: 6px; animation: sound-bounce 0.8s ease-in-out infinite alternate; }
        .bar-2 { height: 14px; animation: sound-bounce 0.6s ease-in-out infinite alternate 0.15s; }
        .bar-3 { height: 10px; animation: sound-bounce 0.7s ease-in-out infinite alternate 0.3s; }
        .bar-4 { height: 5px; animation: sound-bounce 0.5s ease-in-out infinite alternate 0.1s; }

        @keyframes sound-bounce {
          0% { height: 3px; }
          100% { height: 14px; }
        }

        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-counterclockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        .avatar-3d-interactive {
          animation: avatar-float 5s ease-in-out infinite alternate;
        }

        @keyframes avatar-float {
          0% {
            transform: translateY(0px) rotateZ(0deg);
          }
          100% {
            transform: translateY(-10px) rotateZ(1deg);
          }
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
          :root { --avatar-size: 260px; --ring-size: 360px; }
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
          :root { --avatar-size: 210px; --ring-size: 280px; }
        }
      `}</style>
    </section>
  );
}

export default Hero;
