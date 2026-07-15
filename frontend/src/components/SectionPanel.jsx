import { useEffect, useRef } from "react";
import {
  GitBranch, Globe, Mail, Phone, Download, ExternalLink, Calendar, MapPin,
  Award, Briefcase, GraduationCap, ArrowRight, X, ChevronLeft
} from "lucide-react";
import { downloadFile } from "../utils/download";

/* ─────────────────────────────────────────────────────────────────
   SectionPanel — full-screen overlay rendered when a planet is clicked
───────────────────────────────────────────────────────────────────*/
export default function SectionPanel({
  section,
  onBack,
  profile,
  projects,
  education,
  experience,
  certificates,
  backendBase,
  contactForm,
  handleContactChange,
  handleContactSubmit,
  contactSuccess,
  contactLoading,
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredProjects,
  formatDate,
  activeProjectModal,
  setActiveProjectModal,
}) {
  const panelRef = useRef(null);

  // Scroll to top whenever section changes
  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }, [section]);

  const visible = section !== null;

  return (
    <>
      {/* ── Overlay ───────────────────────────────────────────── */}
      <div
        ref={panelRef}
        className={`section-panel-overlay ${visible ? "visible" : "hidden"}`}
      >
        {/* Back button */}
        <button className="solar-back-btn" onClick={onBack} aria-label="Back to Solar System">
          <ChevronLeft size={18} />
          <span>Solar System</span>
        </button>

        {/* Section content */}
        <div className="section-panel-content">
          {section === "home" && (
            <HomeSection
              profile={profile}
              backendBase={backendBase}
            />
          )}
          {section === "about" && (
            <AboutSection
              profile={profile}
              projects={projects}
              certificates={certificates}
              experience={experience}
              education={education}
            />
          )}
          {section === "skills" && (
            <SkillsSection profile={profile} />
          )}
          {section === "experience" && (
            <ExperienceSection experience={experience} formatDate={formatDate} />
          )}
          {section === "education" && (
            <EducationSection education={education} formatDate={formatDate} />
          )}
          {section === "projects" && (
            <ProjectsSection
              projects={projects}
              filteredProjects={filteredProjects}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              backendBase={backendBase}
              setActiveProjectModal={setActiveProjectModal}
            />
          )}
          {section === "certificates" && (
            <CertificatesSection
              certificates={certificates}
              backendBase={backendBase}
              formatDate={formatDate}
            />
          )}
          {section === "contact" && (
            <ContactSection
              profile={profile}
              contactForm={contactForm}
              handleContactChange={handleContactChange}
              handleContactSubmit={handleContactSubmit}
              contactSuccess={contactSuccess}
              contactLoading={contactLoading}
            />
          )}
        </div>

        {/* Footer */}
        {visible && (
          <footer style={{
            padding: "40px 5%",
            background: "rgba(4,4,14,0.95)",
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#64748b",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            marginTop: "60px"
          }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
              <span>© {new Date().getFullYear()} {profile?.name || "Portfolio"}. All rights reserved.</span>
              <span>Built with React &amp; Three.js · Solar System Navigation</span>
            </div>
          </footer>
        )}
      </div>

      {/* ── Project Modal (lives above the overlay) ────────────── */}
      {activeProjectModal && (
        <div className="modal-overlay" onClick={() => setActiveProjectModal(null)} style={{ zIndex: 6000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveProjectModal(null)}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "50%", color: "#94a3b8",
                width: "36px", height: "36px",
                display: "flex", justifyContent: "center", alignItems: "center",
                cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
              <X size={18} />
            </button>

            {activeProjectModal.image && (
              <div style={{ width: "100%", height: "240px", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                <img src={activeProjectModal.image.startsWith("http") || activeProjectModal.image.startsWith("data:") ? activeProjectModal.image : `${backendBase}${activeProjectModal.image}`} alt={activeProjectModal.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            <div>
              {activeProjectModal.category && (
                <span style={{ fontSize: "0.75rem", padding: "2px 8px", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#22d3ee", borderRadius: "10px", fontWeight: 600 }}>
                  {activeProjectModal.category}
                </span>
              )}
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginTop: "10px" }}>{activeProjectModal.title}</h2>
              <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block", marginTop: "4px" }}>
                Duration: {activeProjectModal.startDate ? formatDate(activeProjectModal.startDate) : "N/A"} — {activeProjectModal.endDate ? formatDate(activeProjectModal.endDate) : "Present"}
              </span>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginTop: "16px", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                {activeProjectModal.description}
              </p>
              <div style={{ marginTop: "24px" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#94a3b8", marginBottom: "10px" }}>Technologies Used</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {activeProjectModal.technologies?.map((tech, idx) => (
                    <span key={idx} style={{ fontSize: "0.8rem", padding: "4px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", color: "#cbd5e1" }}>{tech}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "30px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
                {activeProjectModal.githubLink && (
                  <a href={activeProjectModal.githubLink} target="_blank" rel="noreferrer" className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
                    <Github size={16} /><span>View Code</span>
                  </a>
                )}
                {activeProjectModal.liveLink && (
                  <a href={activeProjectModal.liveLink} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                    <ExternalLink size={16} /><span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Individual Section Components (verbatim content from Portfolio.jsx)
══════════════════════════════════════════════════════════════════ */

/* ── Home / Hero ────────────────────────────────────────────────── */
function HomeSection({ profile, backendBase }) {
  return (
    <header id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "100px 5% 60px", position: "relative"
    }}>
      <div style={{ maxWidth: "1100px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <span style={{
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
            color: "#60a5fa", padding: "4px 12px", borderRadius: "20px",
            fontSize: "0.85rem", fontWeight: 600, width: "fit-content"
          }}>
            Available for Opportunities
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h1 style={{ fontSize: "3.75rem", lineHeight: 1.1 }} className="gradient-text">
              Hi, I'm {profile?.name || "Portfolio Owner"}
            </h1>
            <h2 style={{ fontSize: "2rem", color: "#e2e8f0", fontWeight: 600 }}>
              I build <span className="purple-cyan-text">{profile?.title || "Full Stack Solutions"}</span>
            </h2>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "600px" }}>
            {profile?.bio || "Welcome to my portfolio! Feel free to explore all sections using the Solar System navigation above."}
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "10px" }}>
            <button
              className="btn-primary"
              onClick={() => document.querySelector('.solar-back-btn')?.click()}
              style={{ cursor: "pointer" }}
            >
              <span>Explore Universe</span>
              <ArrowRight size={16} />
            </button>
            {profile?.cv && (
              <button
                onClick={() => downloadFile(profile.cv.startsWith("http") || profile.cv.startsWith("data:") ? profile.cv : `${backendBase}${profile.cv}`, "Sukirthan_CV.pdf")}
                className="btn-secondary"
                style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Download size={16} /><span>Download CV</span>
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "12px", alignItems: "center" }}>
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: "10px", borderRadius: "50%" }}>
                <GitBranch size={20} />
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: "10px", borderRadius: "50%" }}>
                <Globe size={20} />
              </a>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="animate-float" style={{ position: "relative" }}>
            <div style={{
              position: "absolute", top: "-15px", left: "-15px", right: "-15px", bottom: "-15px",
              borderRadius: "30px",
              background: "linear-gradient(135deg, var(--primary-glow) 0%, var(--secondary-glow) 100%)",
              filter: "blur(20px)", zIndex: -1
            }} />
            {profile?.profileImage ? (
              <img
                src={profile.profileImage.startsWith("http") || profile.profileImage.startsWith("data:") ? profile.profileImage : `${backendBase}${profile.profileImage}`}
                alt={profile.name}
                style={{ width: "320px", height: "360px", objectFit: "cover", borderRadius: "24px", border: "2px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
              />
            ) : (
              <div style={{ width: "300px", height: "300px", borderRadius: "24px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Award size={64} style={{ color: "#64748b" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── About ──────────────────────────────────────────────────────── */
function AboutSection({ profile, projects, certificates, experience, education }) {
  return (
    <section id="about" style={{ padding: "80px 5%", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.25rem" }} className="gradient-text">About Me</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "50px", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.5rem", color: "#fff", marginBottom: "16px" }}>Building quality user-centric experiences.</h3>
            <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.7 }}>
              {profile?.bio || "I am a passionate software creator with a dedication to engineering clean, robust codebases."}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="glass-panel" style={{ padding: "24px", textAlign: "center" }}>
              <h4 style={{ fontSize: "2.25rem", color: "#60a5fa", fontWeight: 800 }}>{projects.length}</h4>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>Completed Projects</p>
            </div>
            <div className="glass-panel" style={{ padding: "24px", textAlign: "center" }}>
              <h4 style={{ fontSize: "2.25rem", color: "#22d3ee", fontWeight: 800 }}>{profile?.skills?.length || 0}</h4>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>Acquired Skills</p>
            </div>
            <div className="glass-panel" style={{ padding: "24px", textAlign: "center" }}>
              <h4 style={{ fontSize: "2.25rem", color: "#f472b6", fontWeight: 800 }}>{certificates.length}</h4>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>Certifications</p>
            </div>
            <div className="glass-panel" style={{ padding: "24px", textAlign: "center" }}>
              <h4 style={{ fontSize: "2.25rem", color: "#fb7185", fontWeight: 800 }}>{experience.length + education.length}</h4>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>Timeline Records</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Skills ─────────────────────────────────────────────────────── */
function SkillsSection({ profile }) {
  return (
    <section id="skills" style={{ padding: "80px 5%", minHeight: "60vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.25rem" }} className="gradient-text">Skills</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
          {profile?.skills?.map((skill, index) => (
            <div
              key={index}
              className="glass-panel"
              style={{
                padding: "12px 28px", borderRadius: "30px", fontSize: "1.05rem", fontWeight: 600,
                border: "1px solid rgba(147,51,234,0.15)", background: "rgba(147,51,234,0.02)",
                transition: "all 0.3s ease", cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
                e.currentTarget.style.borderColor = "var(--primary-color)";
                e.currentTarget.style.boxShadow = "0 5px 15px var(--primary-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.borderColor = "rgba(147,51,234,0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {skill}
            </div>
          ))}
          {(!profile?.skills || profile.skills.length === 0) && (
            <p style={{ color: "#64748b", fontSize: "1rem", fontStyle: "italic" }}>Skills will be loaded shortly.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Experience ─────────────────────────────────────────────────── */
function ExperienceSection({ experience, formatDate }) {
  return (
    <section id="experience" style={{ padding: "80px 5%", minHeight: "60vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.25rem" }} className="gradient-text">Experience</h2>
        </div>
        <div className="timeline-container">
          {experience.map((item) => (
            <div key={item._id} className="timeline-item">
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>{item.position}</h3>
                    <h4 style={{ fontSize: "0.95rem", color: "#60a5fa", fontWeight: 600, marginTop: "4px" }}>{item.company}</h4>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", fontSize: "0.8rem", color: "#94a3b8" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} />
                      <span>{formatDate(item.startDate)} — {item.current ? "Present" : formatDate(item.endDate)}</span>
                    </span>
                    {item.location && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <MapPin size={12} /><span>{item.location}</span>
                      </span>
                    )}
                  </div>
                </div>
                {item.description && (
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "14px", lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.description}</p>
                )}
              </div>
            </div>
          ))}
          {experience.length === 0 && (
            <p style={{ color: "#64748b", fontSize: "1rem", fontStyle: "italic", textAlign: "center" }}>No work experience posted yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Education ──────────────────────────────────────────────────── */
function EducationSection({ education, formatDate }) {
  return (
    <section id="education" style={{ padding: "80px 5%", minHeight: "60vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.25rem" }} className="gradient-text">Education</h2>
        </div>
        <div className="timeline-container">
          {education.map((item) => (
            <div key={item._id} className="timeline-item">
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>{item.degree}</h3>
                    <h4 style={{ fontSize: "0.95rem", color: "#06b6d4", fontWeight: 600, marginTop: "4px" }}>
                      {item.institution} {item.fieldOfStudy && `in ${item.fieldOfStudy}`}
                    </h4>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", fontSize: "0.8rem", color: "#94a3b8" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} />
                      <span>{formatDate(item.startDate)} — {item.current ? "Present" : formatDate(item.endDate)}</span>
                    </span>
                    {item.grade && (
                      <span style={{ fontSize: "0.85rem", color: "#22d3ee", fontWeight: 600, marginTop: "4px" }}>GPA: {item.grade}</span>
                    )}
                  </div>
                </div>
                {item.description && (
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "14px", lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.description}</p>
                )}
              </div>
            </div>
          ))}
          {education.length === 0 && (
            <p style={{ color: "#64748b", fontSize: "1rem", fontStyle: "italic", textAlign: "center" }}>No education history posted yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Projects ───────────────────────────────────────────────────── */
function ProjectsSection({ filteredProjects, categories, selectedCategory, setSelectedCategory, backendBase, setActiveProjectModal }) {
  return (
    <section id="projects" style={{ padding: "80px 5%", minHeight: "60vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "2.25rem" }} className="gradient-text">Projects</h2>
        </div>
        {categories.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "40px", flexWrap: "wrap" }}>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-tag ${selectedCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: "30px" }}>
          {filteredProjects.map((item) => (
            <div
              key={item._id}
              className="glass-panel"
              style={{ display: "flex", flexDirection: "column", overflow: "hidden", cursor: "pointer", height: "100%" }}
              onClick={() => setActiveProjectModal(item)}
            >
              <div style={{ width: "100%", height: "180px", position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                {item.image ? (
                  <img src={item.image.startsWith("http") || item.image.startsWith("data:") ? item.image : `${backendBase}${item.image}`} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} className="project-thumbnail" />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Award size={48} style={{ color: "#64748b" }} />
                  </div>
                )}
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  {item.category && (
                    <span style={{ fontSize: "0.75rem", padding: "2px 8px", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#22d3ee", borderRadius: "10px", fontWeight: 600 }}>
                      {item.category}
                    </span>
                  )}
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginTop: "10px" }}>{item.title}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "8px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {item.description}
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "16px" }}>
                  {item.technologies?.slice(0, 4).map((tech, idx) => (
                    <span key={idx} style={{ fontSize: "0.75rem", padding: "2px 6px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px", color: "#cbd5e1" }}>{tech}</span>
                  ))}
                  {item.technologies?.length > 4 && (
                    <span style={{ fontSize: "0.75rem", padding: "2px 6px", color: "#a855f7" }}>+{item.technologies.length - 4} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && (
            <p style={{ color: "#64748b", fontSize: "1rem", fontStyle: "italic", textAlign: "center", gridColumn: "1 / -1" }}>No projects posted under this category yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Certificates ───────────────────────────────────────────────── */
function CertificatesSection({ certificates, backendBase, formatDate }) {
  return (
    <section id="certificates" style={{ padding: "80px 5%", minHeight: "60vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.25rem" }} className="gradient-text">Certifications</h2>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginTop: "10px" }}>
            Certifications, awards, and professional milestones
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {certificates.map((item) => (
            <div
              key={item._id}
              className="glass-panel"
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                justifyContent: "space-between",
                height: "100%"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(59, 130, 246, 0.05)",
                    border: "1px solid rgba(59, 130, 246, 0.1)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0
                  }}>
                    <Award size={20} style={{ color: "#3b82f6" }} />
                  </div>
                  <span style={{
                    padding: "2px 8px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <Calendar size={12} />
                    <span>{item.issuedDate}</span>
                  </span>
                </div>

                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginTop: "14px" }}>
                  {item.title}
                </h3>
                <h4 style={{ fontSize: "0.9rem", color: "#3b82f6", fontWeight: 600, marginTop: "4px" }}>
                  {item.issuer}
                </h4>
                {item.description && (
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "12px", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                    {item.description}
                  </p>
                )}
              </div>

              {item.certificateLink && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px", marginTop: "10px" }}>
                  <a
                    href={item.certificateLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.85rem",
                      color: "#fff",
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#3b82f6"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#fff"}
                  >
                    <span>View Certificate</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          ))}
          {certificates.length === 0 && (
            <p style={{ color: "#64748b", fontSize: "1rem", fontStyle: "italic", textAlign: "center", gridColumn: "1 / -1" }}>No certifications posted yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ────────────────────────────────────────────────────── */
function ContactSection({ profile, contactForm, handleContactChange, handleContactSubmit, contactSuccess, contactLoading }) {
  return (
    <section id="contact" style={{ padding: "80px 5%", minHeight: "60vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.25rem" }} className="gradient-text">Get In Touch</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "40px" }}>
          <div className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "30px", height: "fit-content" }}>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>Contact Information</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "6px" }}>Have an exciting opportunity or question? Feel free to reach out directly.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {profile?.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Mail size={16} style={{ color: "#60a5fa" }} />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>Email Me</span>
                    <a href={`mailto:${profile.email}`} style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>{profile.email}</a>
                  </div>
                </div>
              )}
              {profile?.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Phone size={16} style={{ color: "#22d3ee" }} />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>Call Me</span>
                    <span style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>{profile.phone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {contactSuccess && (
              <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80", padding: "12px 16px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 500 }}>
                {contactSuccess}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input name="name" value={contactForm.name} onChange={handleContactChange} required className="input-field" placeholder="Type your name ..." />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input name="email" type="email" value={contactForm.email} onChange={handleContactChange} required className="input-field" placeholder="Yourname@gmail.com" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input name="subject" value={contactForm.subject} onChange={handleContactChange} required className="input-field" placeholder="Project Discussion" />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea name="message" value={contactForm.message} onChange={handleContactChange} required className="input-field" style={{ minHeight: "120px", resize: "vertical" }} placeholder="Hey! I wanted to inquire about..." />
            </div>
            <button type="submit" disabled={contactLoading} className="btn-primary" style={{ width: "fit-content", cursor: "pointer" }}>
              {contactLoading ? (
                <span style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} />
              ) : (
                <><span>Send Message</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
