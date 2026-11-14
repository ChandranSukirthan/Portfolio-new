import { useState, useRef, useEffect } from "react";
import { ArrowRight, Download, Volume2, VolumeX, RotateCcw } from "lucide-react";
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
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const hasUserInteractedRef = useRef(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showVideo, setShowVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Play video with audio
  const startVideoPlayback = (withAudio = true) => {
    setShowVideo(true);
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = !withAudio;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(!withAudio);
        })
        .catch((err) => {
          console.warn("Browser policy blocked unmuted autoplay on initial load, falling back to muted:", err);
          video.muted = true;
          setIsMuted(true);
          video.play().catch((e) => console.error("Video play failed:", e));
        });
    }
  };

  // Setup initial playback and interaction listener for unmuted audio
  useEffect(() => {
    // 3D Entrance Animation: smooth outer-to-inner entrance
    if (avatarWrapperRef.current) {
      gsap.fromTo(
        avatarWrapperRef.current,
        {
          scale: 1.5,
          opacity: 0,
          rotationY: -20,
          rotationX: 15,
          filter: "blur(12px) drop-shadow(0 0 50px rgba(0, 245, 255, 0.7))",
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          rotationX: 0,
          filter: "blur(0px) drop-shadow(0 0 35px rgba(0, 245, 255, 0.25))",
          duration: 1.5,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }

    // Enable unmuted audio on first user interaction anywhere
    const handleFirstInteraction = () => {
      hasUserInteractedRef.current = true;
      if (videoRef.current && showVideo) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    // Initial video start
    startVideoPlayback(true);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // When video finishes: show profile pic, wait 30 seconds, then replay video with audio
  const handleVideoEnded = () => {
    setShowVideo(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    // Wait exactly 30 seconds, then automatically play animated video with audio
    timerRef.current = setTimeout(() => {
      startVideoPlayback(true);
    }, 30000);
  };

  // Manual replay button
  const handleReplayVideo = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startVideoPlayback(true);
  };

  // Sound toggle
  const toggleMute = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

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

            {/* Replay 3D Video & Audio Button */}
            <button
              onClick={handleReplayVideo}
              className="btn-secondary"
              style={{
                padding: "14px 22px",
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderColor: showVideo ? "#00f5ff" : "rgba(56, 189, 248, 0.4)",
                background: showVideo ? "rgba(0, 245, 255, 0.1)" : "rgba(3, 7, 18, 0.6)",
                color: showVideo ? "#00f5ff" : "#38bdf8",
                boxShadow: showVideo ? "0 0 18px rgba(0, 245, 255, 0.25)" : "none",
                transition: "all 0.3s ease",
              }}
              title="Play 3D animated video intro with voice"
            >
              {showVideo ? (
                <>
                  <Volume2 size={16} color="#00f5ff" />
                  <span>3D Video Playing</span>
                  <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "12px", marginLeft: "4px" }}>
                    <span className="sound-bar bar-1" />
                    <span className="sound-bar bar-2" />
                    <span className="sound-bar bar-3" />
                  </div>
                </>
              ) : (
                <>
                  <RotateCcw size={15} />
                  <span>Replay 3D Intro 🔊</span>
                </>
              )}
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

        {/* Right Side: Clean Profile Avatar with 3D Tilt & Video Cycle */}
        <div
          ref={avatarContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            minHeight: "360px",
            perspective: "1200px",
          }}
          className="hero-image-side"
        >
          {/* 3D Profile Avatar Shell (Outer circle removed as requested) */}
          <div
            ref={avatarWrapperRef}
            className="avatar-3d-interactive"
            onClick={!showVideo ? handleReplayVideo : undefined}
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg) translateZ(${Math.abs(mousePos.x) * 8}px)`,
              transition: "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)",
              transformStyle: "preserve-3d",
              position: "relative",
              cursor: !showVideo ? "pointer" : "default",
            }}
            title={!showVideo ? "Click to play 3D animated intro with voice" : ""}
          >
            {/* Clean Circular Shell with Dark & Light Blue Neon Borders */}
            <div
              style={{
                width: "var(--avatar-size, 320px)",
                height: "var(--avatar-size, 320px)",
                borderRadius: "50%",
                padding: "5px",
                background: "linear-gradient(135deg, #00f5ff 0%, #38bdf8 50%, #1d4ed8 100%)",
                boxShadow:
                  "0 0 45px rgba(0, 245, 255, 0.35), 0 0 85px rgba(56, 189, 248, 0.22)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
              className="profile-avatar-container"
            >
              {/* Profile Image (Visible after video finishes, shows for 30s) */}
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
                  display: "block",
                  opacity: showVideo ? 0 : 1,
                  transform: showVideo ? "scale(0.96)" : "scale(1)",
                  transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: showVideo ? "none" : "auto",
                }}
              />

              {/* 3D Animated Video (Plays initially, then automatically every 30s with audio) */}
              <video
                ref={videoRef}
                src="/profile-3d.mp4"
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
                  display: "block",
                  opacity: showVideo ? 1 : 0,
                  transform: showVideo ? "scale(1)" : "scale(1.04)",
                  transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: showVideo ? "auto" : "none",
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

              {/* Mute/Unmute audio quick toggle button (Only while video is playing) */}
              {showVideo && (
                <button
                  onClick={toggleMute}
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "rgba(3, 7, 18, 0.8)",
                    border: "1.5px solid rgba(0, 245, 255, 0.6)",
                    color: isMuted ? "#94a3b8" : "#00f5ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 0 12px rgba(0, 245, 255, 0.35)",
                    transition: "all 0.2s ease",
                  }}
                  title={isMuted ? "Click to unmute sound" : "Click to mute sound"}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --avatar-size: 320px;
        }

        .sound-bar {
          display: inline-block;
          width: 3px;
          background: #00f5ff;
          border-radius: 2px;
        }
        .bar-1 { height: 5px; animation: sound-bounce 0.8s ease-in-out infinite alternate; }
        .bar-2 { height: 12px; animation: sound-bounce 0.6s ease-in-out infinite alternate 0.15s; }
        .bar-3 { height: 8px; animation: sound-bounce 0.7s ease-in-out infinite alternate 0.3s; }

        @keyframes sound-bounce {
          0% { height: 3px; }
          100% { height: 12px; }
        }

        .avatar-3d-interactive {
          animation: avatar-float 5s ease-in-out infinite alternate;
        }

        @keyframes avatar-float {
          0% {
            transform: translateY(0px) rotateZ(0deg);
          }
          100% {
            transform: translateY(-8px) rotateZ(0.8deg);
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
          :root { --avatar-size: 260px; }
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 45px !important;
            text-align: center !important;
          }
          .hero-text-side { align-items: center !important; }
          .hero-text-side p { margin: 0 auto !important; }
          .hero-text-side > div { justify-content: center !important; }
        }
        @media (max-width: 480px) {
          :root { --avatar-size: 220px; }
        }
      `}</style>
    </section>
  );
}

export default Hero;
