import React, { useRef, useEffect, useState } from "react";
import SectionBadge from "./SectionBadge";
import { ExternalLink, X, Calendar, Tag, ChevronRight } from "lucide-react";
import { getBackendBase } from "../api/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// ── Detail Modal (slide-up drawer) ─────────────────────────────
function ProjectModal({ project, backendBase, onClose }) {
  const modalRef = useRef(null);
  const drawerRef = useRef(null);

  const projectImage = project.projectImage
    ? (project.projectImage.startsWith("http") || project.projectImage.startsWith("data:"))
      ? project.projectImage
      : `${backendBase}${project.projectImage}`
    : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop";

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = "hidden";
    // Animate in
    gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(drawerRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    gsap.to(drawerRef.current, { y: 40, opacity: 0, duration: 0.25, ease: "power2.in" });
    gsap.to(modalRef.current, { opacity: 0, duration: 0.25, onComplete: onClose });
  };

  return (
    <div
      ref={modalRef}
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        opacity: 0,
      }}
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0a0c1a",
          border: "1px solid rgba(0,245,255,0.15)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "88vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(0,245,255,0.06)",
          position: "relative",
        }}
      >
        {/* Top neon accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #00f5ff, #a855f7)", borderRadius: "20px 20px 0 0" }} />

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {/* Hero image */}
          <div style={{ width: "100%", height: "240px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
            <img
              src={projectImage}
              alt={project.projectTitle}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 40%, rgba(10,12,26,1) 100%)" }} />
            {/* Close button */}
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
            >
              <X size={16} />
            </button>
            {/* Featured badge */}
            {project.featured && (
              <span style={{ position: "absolute", top: "14px", left: "14px", padding: "3px 12px", background: "linear-gradient(90deg, #00f5ff, #a855f7)", color: "#000", borderRadius: "20px", fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase" }}>
                ★ Featured
              </span>
            )}
          </div>

          {/* Details */}
          <div style={{ padding: "24px 28px 32px" }}>
            {/* Category + date */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
              {project.category && (
                <span style={{ fontSize: "0.72rem", padding: "3px 10px", background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)", color: "#00f5ff", borderRadius: "20px", fontWeight: 700 }}>
                  {project.category}
                </span>
              )}
              {(project.startDate || project.endDate) && (
                <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: "#475569" }}>
                  <Calendar size={12} />
                  {formatDate(project.startDate)}
                  {project.startDate && (project.endDate || project.current) && " — "}
                  {project.current ? "Present" : formatDate(project.endDate)}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "14px" }}>
              {project.projectTitle}
            </h2>

            {/* Full description */}
            <p style={{ color: "#94a3b8", fontSize: "0.93rem", lineHeight: 1.75, whiteSpace: "pre-line", marginBottom: "24px" }}>
              {project.description}
            </p>

            {/* All Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <h4 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Tag size={12} /> Technologies Used ({project.technologies.length})
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: "0.78rem",
                        padding: "5px 12px",
                        background: "rgba(0,245,255,0.05)",
                        border: "1px solid rgba(0,245,255,0.15)",
                        borderRadius: "8px",
                        color: "#cbd5e1",
                        fontWeight: 500,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,245,255,0.1)"; e.currentTarget.style.color = "#00f5ff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,245,255,0.05)"; e.currentTarget.style.color = "#cbd5e1"; }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Links */}
            <div style={{ display: "flex", gap: "12px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: "center", padding: "12px", borderRadius: "10px" }}
                >
                  <GithubIcon style={{ width: "16px", height: "16px" }} />
                  <span>View Code</span>
                </a>
              )}
              {project.liveDemoLink && (
                <a
                  href={project.liveDemoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center", padding: "12px", borderRadius: "10px" }}
                >
                  <ExternalLink size={15} />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Project Card ──────────────────────────────────────────────
function ProjectCard({ project, backendBase, onOpenModal, cardIndex }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  const projectImage = project.projectImage
    ? (project.projectImage.startsWith("http") || project.projectImage.startsWith("data:"))
      ? project.projectImage
      : `${backendBase}${project.projectImage}`
    : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop";

  // 3D tilt
  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    gsap.to(cardRef.current, {
      rotateX: ((y - cy) / cy) * -6,
      rotateY: ((x - cx) / cx) * 8,
      transformPerspective: 900,
      duration: 0.3,
      ease: "power2.out",
    });
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(ellipse at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(0,245,255,0.12) 0%, rgba(168,85,247,0.08) 50%, transparent 80%)`;
    }
  };

  const handleMouseLeave = () => {
    if (isMobile || !cardRef.current) return;
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.55, ease: "power3.out" });
    if (glowRef.current) glowRef.current.style.background = "transparent";
  };

  useEffect(() => {
    if (!cardRef.current) return;
    ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 82%",
      onEnter: () => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "power3.out", delay: cardIndex * 0.1 }
        );
      },
      once: true,
    });
  }, [cardIndex]);

  return (
    <div
      ref={cardRef}
      className="project-card-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenModal(project)}
      style={{
        borderRadius: "16px",
        transformStyle: "preserve-3d",
        willChange: "transform",
        cursor: "pointer",
        opacity: 0,
      }}
    >
      {/* Cursor-tracked glow */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "16px",
          pointerEvents: "none",
          zIndex: 1,
          transition: "opacity 0.3s",
        }}
      />

      <div
        style={{
          background: "#080b12",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(0,245,255,0.2)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,245,255,0.07)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div style={{ width: "100%", height: "190px", position: "relative", overflow: "hidden" }}>
          <img
            src={projectImage}
            alt={project.projectTitle}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%, rgba(8,11,18,0.95) 100%)" }} />
          {project.featured && (
            <span className="shimmer-badge" style={{ position: "absolute", top: "12px", right: "12px", padding: "3px 12px", background: "linear-gradient(90deg, #00f5ff, #a855f7)", color: "#000", borderRadius: "20px", fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase" }}>
              ★ Featured
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
          {project.category && (
            <span style={{ fontSize: "0.7rem", padding: "2px 10px", background: "rgba(0,245,255,0.07)", border: "1px solid rgba(0,245,255,0.18)", color: "#00f5ff", borderRadius: "20px", fontWeight: 700, width: "fit-content" }}>
              {project.category}
            </span>
          )}
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginTop: "10px", lineHeight: 1.3 }}>
            {project.projectTitle}
          </h3>
          <p style={{ color: "#64748b", fontSize: "0.83rem", marginTop: "8px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {project.description}
          </p>

          {/* ALL technologies — scrollable */}
          {project.technologies && project.technologies.length > 0 && (
            <div style={{ marginTop: "14px" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                  maxHeight: "72px",
                  overflowY: "auto",
                  paddingRight: "2px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0,245,255,0.2) transparent",
                }}
              >
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.68rem",
                      padding: "3px 8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "6px",
                      color: "#94a3b8",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: "0.65rem", color: "#374151", marginTop: "5px" }}>
                {project.technologies.length} technologies · scroll to see all
              </p>
            </div>
          )}

          {/* "View Details" CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "auto",
              paddingTop: "14px",
              color: "#00f5ff",
              fontSize: "0.8rem",
              fontWeight: 600,
              opacity: 0.7,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            <ChevronRight size={14} />
            Click to view full details
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Projects Section ─────────────────────────────────────
function Projects({ projects }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const backendBase = getBackendBase();

  const sortedProjects = projects
    ? [...projects].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      })
    : [];

  // Unique categories
  const categories = ["All", ...new Set(sortedProjects.map((p) => p.category).filter(Boolean))];

  const filtered =
    selectedCategory === "All"
      ? sortedProjects
      : sortedProjects.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: headerRef.current, start: "top 85%" } }
    );
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ padding: "100px 5%", background: "transparent", position: "relative", borderTop: "1px solid rgba(255, 255, 255, 0.08)", overflow: "hidden" }}
    >
      {/* Ambient blob */}
      <div style={{ position: "absolute", top: "20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: "50px" }}>
          <SectionBadge text="My Work" />
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>
            Featured{" "}
            <span style={{ background: "linear-gradient(135deg, #00f5ff, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Projects
            </span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginTop: "10px", maxWidth: "540px", margin: "10px auto 0" }}>
            Click any project card to see full details, all technologies, and links
          </p>
        </div>

        {/* Category filter tabs */}
        {categories.length > 1 && (
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "40px" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-tag ${selectedCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Project count */}
        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#374151", marginBottom: "28px" }}>
          Showing {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""}
        </p>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "26px",
          }}
        >
          {filtered.map((project, idx) => (
            <ProjectCard
              key={project._id}
              project={project}
              backendBase={backendBase}
              onOpenModal={setActiveModal}
              cardIndex={idx}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
            No projects found
            {selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""}.
          </div>
        )}
      </div>

      {/* Project detail modal */}
      {activeModal && (
        <ProjectModal
          project={activeModal}
          backendBase={backendBase}
          onClose={() => setActiveModal(null)}
        />
      )}

      <style>{`
        .shimmer-badge {
          position: relative;
          overflow: hidden;
        }
        .shimmer-badge::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer-sweep 2.5s ease-in-out infinite;
        }
        @keyframes shimmer-sweep {
          0% { left: -100%; }
          60%, 100% { left: 150%; }
        }
        @media (max-width: 768px) {
          .project-actions { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}

export default Projects;
