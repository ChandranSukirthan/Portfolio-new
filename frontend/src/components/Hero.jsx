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
  const ringsRef = useRef(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentMedia, setCurrentMedia] = useState("video"); // "video" | "profile"
  const [isMuted, setIsMuted] = useState(false);

  // Video ended -> Switch to Profile Pic for 30s -> Automatically replay video with audio
  const handleVideoEnded = () => {
    setCurrentMedia("profile");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrentMedia("video");
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.volume = 1.0;
        videoRef.current.muted = false;
        setIsMuted(false);
        videoRef.current.play().catch((err) => {
          console.warn("Video replay error:", err);
        });
      }
    }, 30000); // 30 seconds
  };

  // 3D Entrance Animation & Audio Autoplay setup
  useEffect(() => {
    // 3D entrance for Avatar
    if (avatarWrapperRef.current) {
      gsap.fromTo(
        avatarWrapperRef.current,
        {
          scale: 1.5,
          opacity: 0,
          rotationY: -20,
          rotationX: 12,
          filter: "blur(12px) drop-shadow(0 0 45px rgba(0, 245, 255, 0.7))",
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          rotationX: 0,
          filter: "blur(0px) drop-shadow(0 0 30px rgba(0, 245, 255, 0.25))",
          duration: 1.5,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }

    // 3D entrance for 3 Outer Rings
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

    // Start video playback with audio
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.volume = 1.0;
      videoRef.current.muted = false;
      videoRef.current
        .play()
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {
          // If browser restricts unmuted autoplay before user interaction, start muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
    }

    // Unmute immediately on ANY first user interaction across the page
    const unlockAudio = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        setIsMuted(false);
      }
    };

    const events = ["click", "touchstart", "pointerdown", "keydown", "wheel"];
    events.forEach((evt) => {
      window.addEventListener(evt, unlockAudio, { once: true, passive: true });
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((evt) => {
        window.removeEventListener(evt, unlockAudio);
      });
    };
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

  // Toggle Mute / Unmute and ensure audio plays with full volume
  const toggleMute = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.volume = 1.0;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Manually replay video with sound immediately
  const playVideoWithSound = (e) => {
    e?.stopPropagation();
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentMedia("video");
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.volume = 1.0;
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch((err) => {
        console.warn("Play error:", err);
      });
    }
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
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px", alignItems: "center" }}>
            <button
              onClick={scrollToContact}
              className="btn-primary btn-submit-glow"
              id="hero-contact-btn"
              style={{ padding: "14px 32px", fontSize: "0.95rem" }}
            >
              <span>Contact Me</span>
              <ArrowRight size={16} />
            </button>

            {/* Play/Unmute Intro Video with Sound button */}
            <button
              onClick={playVideoWithSound}
              className="btn-secondary"
              style={{
                padding: "14px 24px",
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderColor: !isMuted && currentMedia === "video" ? "#00f5ff" : "rgba(0, 245, 255, 0.4)",
                background: !isMuted && currentMedia === "video" ? "rgba(0, 245, 255, 0.12)" : "rgba(3, 7, 18, 0.6)",
                boxShadow: !isMuted && currentMedia === "video" ? "0 0 20px rgba(0, 245, 255, 0.3)" : "none",
                color: "#00f5ff",
                transition: "all 0.3s ease",
              }}
              title="Play 3D video with sound"
            >
              {currentMedia === "video" && !isMuted ? (
                <>
                  <Volume2 size={17} color="#00f5ff" />
                  <span>Audio Playing 🔊</span>
                </>
              ) : (
                <>
                  <Volume2 size={17} color="#00f5ff" />
                  <span>Play with Sound 🔊</span>
                </>
              )}
            </button>

            {resumeLink !== "#" && (
              <button
                onClick={() => downloadFile(resumeLink, "Sukirthan_Resume.pdf")}
                className="btn-secondary"
                style={{
                  padding: "14px 28px",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
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

        {/* Right Side: 3 Outer Circles & 3D Interactive Avatar */}
        <div
          ref={avatarContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: "var(--ring-size, 470px)",
            perspective: "1200px",
          }}
          className="hero-image-side"
        >
          {/* Animated Cosmic Rings Group (3 outer circles) */}
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
            {/* Circle 1: Outer solid orbit ring */}
            <div
              style={{
                position: "absolute",
                width: "var(--ring-size, 470px)",
                height: "var(--ring-size, 470px)",
                borderRadius: "50%",
                border: "1.5px solid rgba(0, 245, 255, 0.18)",
                boxShadow: "0 0 25px rgba(0, 245, 255, 0.08) inset",
                animation: "spin-counterclockwise 25s linear infinite",
              }}
            />

            {/* Circle 2: Dashed middle ring */}
            <div
              style={{
                position: "absolute",
                width: "calc(var(--ring-size, 470px) * 0.85)",
                height: "calc(var(--ring-size, 470px) * 0.85)",
                borderRadius: "50%",
                border: "1.5px dashed rgba(56, 189, 248, 0.32)",
                animation: "spin-clockwise 18s linear infinite",
              }}
            />

            {/* Circle 3: Orbiting celestial beacon path & glowing dot */}
            <div
              style={{
                position: "absolute",
                width: "var(--ring-size, 470px)",
                height: "var(--ring-size, 470px)",
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
                  boxShadow: "0 0 14px #00f5ff, 0 0 28px rgba(0,245,255,0.7)",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </div>

          {/* 3D Profile Avatar Wrapper with Dynamic Tilt & Float */}
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
            {/* Center Circular Shell with Dark & Light Blue Neon Borders */}
            <div
              style={{
                width: "var(--avatar-size, 320px)",
                height: "var(--avatar-size, 320px)",
                borderRadius: "50%",
                padding: "5px",
                background: "linear-gradient(135deg, #00f5ff 0%, #38bdf8 50%, #1d4ed8 100%)",
                boxShadow:
                  "0 0 45px rgba(0, 245, 255, 0.4), 0 0 85px rgba(56, 189, 248, 0.25)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
              className="profile-avatar-container"
              onClick={toggleMute}
              title={isMuted ? "Click to hear audio" : "Click to mute"}
            >
              {/* 3D Animated Character Video */}
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
                  opacity: currentMedia === "video" ? 1 : 0,
                  pointerEvents: currentMedia === "video" ? "auto" : "none",
                  transition: "opacity 0.7s ease-in-out",
                  zIndex: currentMedia === "video" ? 2 : 1,
                }}
              />

              {/* Profile Image (Displays when video finishes, stays for 30s) */}
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
                  transition: "opacity 0.7s ease-in-out",
                  zIndex: currentMedia === "profile" ? 2 : 1,
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
                  zIndex: 3,
                }}
              />

              {/* Discreet Audio Pill Toggle (shows directly on avatar) */}
              {currentMedia === "video" && (
                <button
                  onClick={toggleMute}
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    background: isMuted
                      ? "linear-gradient(135deg, rgba(0, 245, 255, 0.95), rgba(56, 189, 248, 0.95))"
                      : "rgba(3, 7, 18, 0.85)",
                    backdropFilter: "blur(8px)",
                    border: isMuted ? "1.5px solid #00f5ff" : "1px solid rgba(0, 245, 255, 0.4)",
                    borderRadius: "9999px",
                    padding: "6px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: isMuted ? "#030712" : "#00f5ff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    zIndex: 4,
                    boxShadow: isMuted
                      ? "0 0 16px rgba(0, 245, 255, 0.6)"
                      : "0 2px 10px rgba(0,0,0,0.5)",
                    transition: "all 0.25s ease",
                  }}
                  title={isMuted ? "Click to unmute and hear audio" : "Audio playing (click to mute)"}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{isMuted ? "Tap to Hear Audio 🔊" : "Sound On"}</span>
                </button>
              )}

              {/* In profile image mode: quick replay icon */}
              {currentMedia === "profile" && (
                <button
                  onClick={playVideoWithSound}
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    background: "rgba(3, 7, 18, 0.85)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(0, 245, 255, 0.4)",
                    borderRadius: "9999px",
                    padding: "6px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#00f5ff",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    zIndex: 4,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                    transition: "all 0.25s ease",
                  }}
                  title="Replay video now with sound"
                >
                  <RotateCcw size={13} />
                  <span>Replay Video</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --avatar-size: 320px;
          --ring-size: 470px;
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
          :root { --avatar-size: 260px; --ring-size: 380px; }
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
          :root { --avatar-size: 210px; --ring-size: 290px; }
        }
      `}</style>
    </section>
  );
}

export default Hero;