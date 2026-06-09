import { useEffect, useState, useRef } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Education from "../components/Education";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Achievements from "../components/Achievements";
import Contact from "../components/Contact";
import { Calendar, MapPin } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const [profile, setProfile] = useState(null);
  const [educationList, setEducationList] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const cursorDotRef = useRef(null);
  const cursorTrailRef = useRef(null);

  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (loading) return;

    // Skip Three.js on mobile for performance
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Scene setup ──────────────────────────────────────────
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // ── Particle starfield (space background) ────────────────
    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.8 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Mix cyan and purple
      const mixRatio = Math.random();
      colors[i * 3] = mixRatio * 0.66;       // R
      colors[i * 3 + 1] = (1 - mixRatio) * 0.96 + mixRatio * 0.33; // G
      colors[i * 3 + 2] = 1.0;              // B
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── GSAP Camera Drift On Load ────────────────────────────
    camera.position.set(0, 0, 9);
    gsap.to(camera.position, {
      z: 5,
      duration: 2.2,
      ease: "power3.out",
    });

    // ── Mouse Parallax ───────────────────────────────────────
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ── Resize Handler ────────────────────────────────────────
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ── Animation Loop ────────────────────────────────────────
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0002;

      camera.position.x += (mouseRef.current.x * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (mouseRef.current.y * 0.5 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [loading]);

  useEffect(() => {
    loadPublicData();
    initCustomCursor();
    initRevealObserver();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const loadPublicData = async () => {
    setLoading(true);
    try {
      const [profRes, eduRes, expRes, projRes, skillRes, achRes, contactRes] =
        await Promise.all([
          API.get("/profile"),
          API.get("/education"),
          API.get("/experience"),
          API.get("/projects"),
          API.get("/skills"),
          API.get("/achievements"),
          API.get("/contact-info"),
        ]);

      if (profRes.data) setProfile(profRes.data);
      setEducationList(eduRes.data || []);
      setExperience(expRes.data || []);
      setProjects(projRes.data || []);
      setSkills(skillRes.data || []);
      setAchievements(achRes.data || []);
      if (contactRes.data) setContactInfo(contactRes.data);
    } catch (error) {
      console.error("Error fetching portfolio public data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Custom Cursor ────────────────────────────────────────────
  const initCustomCursor = () => {
    // Skip on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    // Create cursor elements if not already present
    let dot = document.getElementById("cursor-dot");
    let trail = document.getElementById("cursor-trail");

    if (!dot) {
      dot = document.createElement("div");
      dot.id = "cursor-dot";
      document.body.appendChild(dot);
    }
    if (!trail) {
      trail = document.createElement("div");
      trail.id = "cursor-trail";
      document.body.appendChild(trail);
    }

    cursorDotRef.current = dot;
    cursorTrailRef.current = trail;

    let trailX = 0;
    let trailY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let rafId = null;

    const updateCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const smoothTrail = () => {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      trail.style.left = `${trailX}px`;
      trail.style.top = `${trailY}px`;
      rafId = requestAnimationFrame(smoothTrail);
    };

    const onMouseOver = (e) => {
      const el = e.target.closest("a, button, [role=button], .flip-card, .project-card-wrap, .filter-tag");
      if (el) {
        trail.classList.add("hovered");
        dot.style.transform = "translate(-50%,-50%) scale(2)";
      } else {
        trail.classList.remove("hovered");
        dot.style.transform = "translate(-50%,-50%) scale(1)";
      }
    };

    document.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseover", onMouseOver);
    smoothTrail();

    return () => {
      document.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
    };
  };

  // ── IntersectionObserver for .reveal elements ─────────────────
  const initRevealObserver = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    // Observe all current and future .reveal elements via a delayed sweep
    const observe = () => {
      document.querySelectorAll(".reveal:not(.observed)").forEach((el) => {
        el.classList.add("observed");
        observer.observe(el);
      });
    };

    // Initial pass
    observe();
    // Re-sweep after data loads (cards added after mount)
    setTimeout(observe, 800);
    setTimeout(observe, 1800);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* Animated loader */}
        <div style={{ position: "relative", width: "60px", height: "60px" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid rgba(0,245,255,0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "#00f5ff",
              borderRightColor: "#a855f7",
              animation: "spin 0.9s linear infinite",
            }}
          />
        </div>
        <span
          style={{
            color: "#475569",
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Loading portfolio...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Global Three.js Canvas in Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.9,
        }}
      />
      <Navbar />

      {/* 1. HERO */}
      <Hero profile={profile} />

      {/* 2. EDUCATION */}
      <Education educationList={educationList} />

      {/* 3. EXPERIENCE */}
      <section
        id="experience"
        style={{
          padding: "100px 5%",
          background: "transparent",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }} className="reveal">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 14px",
                background: "rgba(0,245,255,0.06)",
                border: "1px solid rgba(0,245,255,0.2)",
                borderRadius: "20px",
                color: "#00f5ff",
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "16px",
              }}
            >
              Professional Journey
            </div>
            <h2
              style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}
            >
              Experience
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginTop: "10px" }}>
              My career track and professional milestones
            </p>
          </div>

          <div className="timeline-container">
            {experience.map((item) => (
              <div key={item._id} className="timeline-item reveal">
                <div
                  className="glass-panel"
                  style={{ padding: "24px", background: "#080b12", border: "1px solid #1f2937" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>
                        {item.position}
                      </h3>
                      <h4
                        style={{
                          fontSize: "0.95rem",
                          color: "#00f5ff",
                          fontWeight: 600,
                          marginTop: "4px",
                        }}
                      >
                        {item.company}
                      </h4>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={12} />
                        <span>
                          {formatDate(item.startDate)} —{" "}
                          {item.current ? "Present" : formatDate(item.endDate)}
                        </span>
                      </span>
                      {item.location && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            marginTop: "2px",
                          }}
                        >
                          <MapPin size={12} />
                          <span>{item.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.9rem",
                        marginTop: "14px",
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {experience.length === 0 && (
              <div
                className="glass-panel reveal"
                style={{
                  padding: "24px",
                  background: "#080b12",
                  border: "1px solid #1f2937",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                  AI Undergrad &amp; Full-stack Enthusiast
                </h3>
                <h4
                  style={{
                    fontSize: "0.9rem",
                    color: "#00f5ff",
                    fontWeight: 600,
                    marginTop: "4px",
                  }}
                >
                  Self-Employed
                </h4>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "10px" }}>
                  Developing MERN stacks and applying neural networks on custom models.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. PROJECTS */}
      <Projects projects={projects} />

      {/* 5. SKILLS */}
      <Skills skills={skills} />

      {/* 6. ACHIEVEMENTS */}
      <Achievements achievements={achievements} />

      {/* 7. CONTACT */}
      <Contact contactInfo={contactInfo} />

      {/* FOOTER */}
      <footer
        style={{
          padding: "40px 5%",
          borderTop: "1px solid rgba(0,245,255,0.08)",
          background: "#000000",
          textAlign: "center",
          fontSize: "0.85rem",
          color: "#374151",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Footer neon line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,245,255,0.2), rgba(168,85,247,0.2), transparent)",
          }}
        />
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <span>
            © {new Date().getFullYear()}{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #00f5ff, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 700,
              }}
            >
              {profile?.name || "Sukirthan Chandrakumar"}
            </span>
            . All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
