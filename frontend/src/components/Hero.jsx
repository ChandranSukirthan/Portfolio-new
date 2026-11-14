import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, Download } from "lucide-react";
import { getBackendBase } from "../api/api";
import { downloadFile } from "../utils/download";
import { gsap } from "gsap";

function Hero({ profile }) {
  const greeting    = profile?.greeting    || "Hello, I'm";
  const name        = profile?.name        || "Sukirthan Chandrakumar";
  const description = profile?.description ||
    "AI undergraduate specializing in Artificial Intelligence, skilled in MERN stack, machine learning, and full-stack web development. Experienced in building scalable web applications and AI-powered systems. Seeking internship opportunities to contribute to innovative projects.";
  const title = profile?.title || "AI & Full-stack Developer";

  const backendBase   = getBackendBase();
  const profileImage  = profile?.profileImage
    ? (profile.profileImage.startsWith("http") || profile.profileImage.startsWith("data:")
        ? profile.profileImage
        : `${backendBase}${profile.profileImage}`)
    : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop";

  const resumeLink = profile?.resumeLink
    ? (profile.resumeLink.startsWith("http") || profile.resumeLink.startsWith("data:")
        ? profile.resumeLink
        : `${backendBase}${profile.resumeLink}`)
    : profile?.cv
      ? (profile.cv.startsWith("http") || profile.cv.startsWith("data:")
          ? profile.cv
          : `${backendBase}${profile.cv}`)
      : "#";

  // Refs
  const avatarContainerRef = useRef(null);
  const avatarWrapperRef   = useRef(null);
  const ringsRef           = useRef(null);
  const videoRef           = useRef(null);
  const hasAutoPlayedRef   = useRef(false);

  // Initially "video" so 3D animated video plays on page load
  const [mode, setMode]         = useState("video");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // ── First time load: automatically play 3D animated video with audio ──────
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const startAutoPlay = () => {
      if (hasAutoPlayedRef.current) return;
      hasAutoPlayedRef.current = true;
      setMode("video");
      vid.currentTime = 0;
      vid.volume = 1.0;
      vid.muted = false;

      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay with audio blocked by browser policy, starting muted with gesture unmute:", err);
          // Browser requires user gesture for audio: start muted so video animates immediately
          vid.muted = true;
          vid.play().catch(() => {});

          // Unmute on the first touch, click or scroll
          const unmuteOnInteraction = () => {
            vid.muted = false;
            vid.volume = 1.0;
            window.removeEventListener("pointerdown", unmuteOnInteraction);
            window.removeEventListener("touchstart", unmuteOnInteraction);
            window.removeEventListener("click", unmuteOnInteraction);
            window.removeEventListener("scroll", unmuteOnInteraction);
          };
          window.addEventListener("pointerdown", unmuteOnInteraction, { once: true });
          window.addEventListener("touchstart", unmuteOnInteraction, { once: true });
          window.addEventListener("click", unmuteOnInteraction, { once: true });
          window.addEventListener("scroll", unmuteOnInteraction, { once: true });
        });
      }
    };

    if (vid.readyState >= 2) {
      startAutoPlay();
    } else {
      vid.addEventListener("canplaythrough", startAutoPlay, { once: true });
      vid.addEventListener("loadeddata", startAutoPlay, { once: true });
    }

    return () => {
      vid.removeEventListener("canplaythrough", startAutoPlay);
      vid.removeEventListener("loadeddata", startAutoPlay);
    };
  }, []);

  // ── Video finished → seamlessly show profile image ────────────────────────
  const handleVideoEnded = useCallback(() => {
    setMode("profile");
  }, []);

  // ── Just touch/click the profile to replay or toggle ───────────────────────
  const handleAvatarClick = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (mode === "profile") {
      setMode("video");
      vid.currentTime = 0;
      vid.volume = 1.0;
      vid.muted = false;
      requestAnimationFrame(() => {
        vid.play().catch((err) => console.warn("Video play error on click:", err));
      });
    } else {
      // Touching profile while video is playing pauses and returns to profile image
      vid.pause();
      setMode("profile");
    }
  }, [mode]);

  // ── Pause when tab is hidden ──────────────────────────────────────────────
  useEffect(() => {
    const onVisibility = () => {
      const vid = videoRef.current;
      if (document.hidden && vid && !vid.paused) vid.pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // ── 3D Entrance animation (runs once on mount) ────────────────────────────
  useEffect(() => {
    if (avatarWrapperRef.current) {
      gsap.fromTo(
        avatarWrapperRef.current,
        { scale: 1.5, opacity: 0, rotationY: -20, rotationX: 12, filter: "blur(14px)" },
        { scale: 1, opacity: 1, rotationY: 0, rotationX: 0, filter: "blur(0px)",
          duration: 1.5, ease: "power3.out", delay: 0.2 }
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

  // ── Mouse 3D tilt ─────────────────────────────────────────────────────────
  const handleMouseMove = (e) => {
    if (!avatarContainerRef.current) return;
    const rect = avatarContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };
  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isVideo = mode === "video";

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
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(3,7,18,0.82) 0%, rgba(3,7,18,0.45) 60%, transparent 100%)",
          zIndex: 1, pointerEvents: "none",
        }}
      />

      {/* Two-column layout */}
      <div
        className="hero-grid"
        style={{
          maxWidth: "1100px", width: "100%",
          display: "grid", gridTemplateColumns: "1.2fr 0.8fr",
          gap: "60px", alignItems: "center",
          position: "relative", zIndex: 2,
        }}
      >
        {/* ── LEFT: Text ─────────────────────────────────────────────────────── */}
        <div className="hero-text-side" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Greeting */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ display: "inline-block", width: "32px", height: "2px", background: "linear-gradient(90deg,#00f5ff,#38bdf8)", borderRadius: "2px" }} />
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "#00f5ff", letterSpacing: "0.08em", textTransform: "uppercase" }}>{greeting}</span>
          </div>

          {/* Name + Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h1 style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)", fontWeight: 800, lineHeight: 1.08, color: "#fff", letterSpacing: "-0.03em" }}>{name}</h1>
            <h2 style={{ fontSize: "clamp(1.2rem,2.5vw,1.75rem)", fontWeight: 600, marginTop: "4px", background: "linear-gradient(90deg,#00f5ff,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{title}</h2>
          </div>

          {/* Description */}
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.75, maxWidth: "560px" }}>{description}</p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px", alignItems: "center" }}>
            <button onClick={scrollToContact} className="btn-primary btn-submit-glow" style={{ padding: "14px 32px", fontSize: "0.95rem" }}>
              <span>Contact Me</span>
              <ArrowRight size={16} />
            </button>
            {resumeLink !== "#" && (
              <button
                onClick={() => downloadFile(resumeLink, "Sukirthan_Resume.pdf")}
                className="btn-secondary"
                style={{ padding: "14px 28px", fontSize: "0.95rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Download size={16} />
                <span>Download Resume</span>
              </button>
            )}
          </div>

          {/* Scroll hint */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", color: "#475569", fontSize: "0.8rem" }}>
            <div className="scroll-indicator" />
            <span>Scroll to explore</span>
          </div>
        </div>

        {/* ── RIGHT: Avatar ───────────────────────────────────────────────────── */}
        <div
          ref={avatarContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="hero-image-side"
          style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", perspective: "1200px" }}
        >
          {/* Rings + Avatar circle */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>

            {/* Spinning rings (pointer-events: none — clicks pass through to avatar) */}
            <div
              ref={ringsRef}
              style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", pointerEvents: "none" }}
            >
              {/* Outer dashed ring */}
              <div style={{
                position: "absolute",
                width: "calc(var(--avatar-size,320px) + 86px)",
                height: "calc(var(--avatar-size,320px) + 86px)",
                borderRadius: "50%",
                border: "1.5px dashed rgba(56,189,248,0.35)",
                animation: "spin-counter 28s linear infinite",
              }} />
              {/* Inner dashed ring */}
              <div style={{
                position: "absolute",
                width: "calc(var(--avatar-size,320px) + 46px)",
                height: "calc(var(--avatar-size,320px) + 46px)",
                borderRadius: "50%",
                border: "1.5px dashed rgba(0,245,255,0.42)",
                animation: "spin-clockwise 20s linear infinite",
              }} />
            </div>

            {/* 3D tilt wrapper */}
            <div
              ref={avatarWrapperRef}
              className="avatar-3d-interactive"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg) translateZ(${Math.abs(mousePos.x) * 8}px)`,
                transition: "transform 0.18s cubic-bezier(0.2,0.8,0.2,1)",
                transformStyle: "preserve-3d",
                position: "relative",
                zIndex: 3,
              }}
            >
              {/* ── Clickable circular avatar frame (Just touch/click to play or switch) ── */}
              <div
                onClick={handleAvatarClick}
                className="profile-avatar-container"
                style={{
                  width: "var(--avatar-size,320px)",
                  height: "var(--avatar-size,320px)",
                  borderRadius: "50%",
                  padding: "5px",
                  background: "linear-gradient(135deg,#00f5ff 0%,#38bdf8 50%,#1d4ed8 100%)",
                  boxShadow: isVideo
                    ? "0 0 60px rgba(0,245,255,0.6), 0 0 100px rgba(56,189,248,0.35)"
                    : "0 0 45px rgba(0,245,255,0.4), 0 0 85px rgba(56,189,248,0.25)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "box-shadow 0.5s ease",
                }}
              >
                {/* ── VIDEO (plays automatically on initial load, and on touch) ── */}
                <video
                  ref={videoRef}
                  src="/profile-3d.mp4"
                  preload="auto"
                  playsInline
                  onEnded={handleVideoEnded}
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #030712",
                    background: "#030712",
                    opacity: isVideo ? 1 : 0,
                    pointerEvents: isVideo ? "auto" : "none",
                    transition: "opacity 0.5s ease",
                    zIndex: isVideo ? 2 : 0,
                  }}
                />

                {/* ── PROFILE IMAGE (shown after video finishes) ── */}
                <img
                  src={profileImage}
                  alt={name}
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #030712",
                    background: "#030712",
                    opacity: isVideo ? 0 : 1,
                    pointerEvents: isVideo ? "none" : "auto",
                    transition: "opacity 0.5s ease",
                    zIndex: isVideo ? 0 : 2,
                  }}
                />

                {/* ── Glass reflection overlay ── */}
                <div style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,rgba(255,255,255,0.14) 0%,rgba(255,255,255,0) 50%,rgba(0,245,255,0.07) 100%)",
                  pointerEvents: "none",
                  zIndex: 6,
                }} />
              </div>
            </div>
          </div>

          {/* ── "3D LIVE AVATAR" badge — fades in while video plays ── */}
          <div style={{
            marginTop: "14px",
            height: "36px",   // fixed height so layout doesn't shift
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              opacity: isVideo ? 1 : 0,
              transform: isVideo ? "scale(1) translateY(0)" : "scale(0.88) translateY(6px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              pointerEvents: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 20px",
              borderRadius: "24px",
              background: "rgba(3,7,18,0.88)",
              border: "1px solid rgba(0,245,255,0.38)",
              boxShadow: "0 4px 20px rgba(0,245,255,0.18)",
              backdropFilter: "blur(12px)",
            }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 8px #00f5ff", display: "inline-block", animation: "pulse-dot 1.4s ease-in-out infinite" }} />
              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.14em", textTransform: "uppercase" }}>✦ 3D Live Avatar</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scoped styles ──────────────────────────────────────────────────── */}
      <style>{`
        :root { --avatar-size: 320px; }

        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-counter {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        /* Gentle float on the avatar wrapper */
        .avatar-3d-interactive {
          animation: avatar-float 5s ease-in-out infinite alternate;
        }
        @keyframes avatar-float {
          0%   { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }

        /* Scroll indicator */
        .scroll-indicator {
          width: 20px; height: 34px;
          border: 2px solid rgba(255,255,255,0.15);
          border-radius: 12px; position: relative;
        }
        .scroll-indicator::after {
          content: '';
          position: absolute;
          top: 5px; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 8px;
          background: #00f5ff;
          border-radius: 2px;
          animation: scroll-bounce 1.6s ease-in-out infinite;
        }
        @keyframes scroll-bounce {
          0%, 100% { opacity: 1; top: 5px; }
          50%       { opacity: 0.3; top: 16px; }
        }

        /* Responsive breakpoints */
        @media (max-width: 1024px) { :root { --avatar-size: 260px; } }
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
        @media (max-width: 480px) { :root { --avatar-size: 210px; } }
      `}</style>
    </section>
  );
}

export default Hero;
