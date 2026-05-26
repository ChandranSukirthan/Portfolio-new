import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { 
  Github, Linkedin, Mail, Phone, Download, ExternalLink, Calendar, MapPin, 
  Award, Briefcase, GraduationCap, ArrowRight, ShieldCheck, ChevronRight, X 
} from "lucide-react";

function Portfolio() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certificates, setCertificates] = useState([]);
  
  // Category Filtering
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  // Project Modal State
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    loadPublicData();
  }, []);

  const loadPublicData = async () => {
    try {
      const [profRes, projRes, eduRes, expRes, certRes] = await Promise.all([
        API.get("/profile"),
        API.get("/projects"),
        API.get("/education"),
        API.get("/experience"),
        API.get("/certificates")
      ]);

      if (profRes.data) {
        setProfile(profRes.data);
      }
      
      const projs = projRes.data || [];
      setProjects(projs);
      setEducation(eduRes.data || []);
      setExperience(expRes.data || []);
      setCertificates(certRes.data || []);

      // Pull unique categories
      const uniqueCats = ["All", ...new Set(projs.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCats);
    } catch (error) {
      console.error("Error fetching portfolio public data:", error);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactSuccess("");

    // Simulate sending email
    setTimeout(() => {
      setContactSuccess("Your message has been sent successfully! I will get back to you shortly.");
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setContactLoading(false);
    }, 1500);
  };

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <Navbar />

      {/* Background blobs */}
      <div className="tech-blob blob-purple" style={{ top: "10%" }}></div>
      <div className="tech-blob blob-cyan" style={{ bottom: "20%" }}></div>

      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <header id="home" style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 5% 40px",
        position: "relative"
      }}>
        <div style={{
          maxWidth: "1100px",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "40px",
          alignItems: "center"
        }}>
          {/* Hero Bio */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              color: "#60a5fa",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: 600,
              width: "fit-content"
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
              {profile?.bio || "Welcome to my portfolio! Here you will find my latest academic achievements, career experience, personal projects, and verified credentials. Feel free to download my resume or contact me directly below."}
            </p>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "10px" }}>
              <a href="#contact" className="btn-primary">
                <span>Get in touch</span>
                <ArrowRight size={16} />
              </a>
              {profile?.cv && (
                <a 
                  href={`http://localhost:5000${profile.cv}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-secondary"
                  download
                >
                  <Download size={16} />
                  <span>Download CV</span>
                </a>
              )}
            </div>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "16px", marginTop: "12px", alignItems: "center" }}>
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: "10px", borderRadius: "50%" }}>
                  <Github size={20} />
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: "10px", borderRadius: "50%" }}>
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Hero Profile Photo Panel */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="animate-float" style={{ position: "relative" }}>
              <div style={{
                position: "absolute",
                top: "-15px",
                left: "-15px",
                right: "-15px",
                bottom: "-15px",
                borderRadius: "30px",
                background: "linear-gradient(135deg, var(--primary-glow) 0%, var(--secondary-glow) 100%)",
                filter: "blur(20px)",
                zIndex: -1
              }} />
              {profile?.profileImage ? (
                <img 
                  src={`http://localhost:5000${profile.profileImage}`} 
                  alt={profile.name} 
                  style={{
                    width: "320px",
                    height: "360px",
                    objectFit: "cover",
                    borderRadius: "24px",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)"
                  }}
                />
              ) : (
                <div style={{
                  width: "300px",
                  height: "300px",
                  borderRadius: "24px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px dashed rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <Award size={64} style={{ color: "#64748b" }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. ABOUT ME & STATS SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="about" style={{ padding: "100px 5%", background: "rgba(15, 13, 34, 0.4)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "2.25rem" }} className="gradient-text">About Me</h2>

          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "50px", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "1.5rem", color: "#fff", marginBottom: "16px" }}>Building quality user-centric experiences.</h3>
              <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.7 }}>
                {profile?.bio || "I am a passionate software creator with a dedication to engineering clean, robust codebases. I specialize in designing full stack solutions with responsive interfaces, robust microservices, and interactive dashboards."}
              </p>
            </div>

            {/* Dynamically Populated Quick Stats */}
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

      {/* ------------------------------------------------------------- */}
      {/* 3. SKILLS SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="skills" style={{ padding: "100px 5%" }}>
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
                  border: "1px solid rgba(147, 51, 234, 0.15)", background: "rgba(147, 51, 234, 0.02)",
                  transition: "all 0.3s ease",
                  cursor: "default"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
                  e.currentTarget.style.borderColor = "var(--primary-color)";
                  e.currentTarget.style.boxShadow = "0 5px 15px var(--primary-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1) translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(147, 51, 234, 0.15)";
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

      {/* ------------------------------------------------------------- */}
      {/* 4. EXPERIENCE SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="experience" style={{ padding: "100px 5%", background: "rgba(15, 13, 34, 0.4)" }}>
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
                          <MapPin size={12} />
                          <span>{item.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "14px", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                      {item.description}
                    </p>
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

      {/* ------------------------------------------------------------- */}
      {/* 5. EDUCATION SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="education" style={{ padding: "100px 5%" }}>
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
                      <h4 style={{ fontSize: "0.95rem", color: "#06b6d4", fontWeight: 600, marginTop: "4px" }}>{item.institution} {item.fieldOfStudy && `in ${item.fieldOfStudy}`}</h4>
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
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "14px", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                      {item.description}
                    </p>
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

      {/* ------------------------------------------------------------- */}
      {/* 6. PROJECTS SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="projects" style={{ padding: "100px 5%", background: "rgba(15, 13, 34, 0.4)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "2.25rem" }} className="gradient-text">Projects</h2>

          </div>

          {/* Filtering Tabs */}
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

          {/* Grid Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: "30px" }}>
            {filteredProjects.map((item) => (
              <div 
                key={item._id} 
                className="glass-panel" 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  overflow: "hidden", 
                  cursor: "pointer",
                  height: "100%"
                }}
                onClick={() => setActiveProjectModal(item)}
              >
                {/* Image panel */}
                <div style={{ width: "100%", height: "180px", position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                  {item.image ? (
                    <img src={`http://localhost:5000${item.image}`} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} className="project-thumbnail" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <Award size={48} style={{ color: "#64748b" }} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifySide: "space-between", justifyContent: "space-between" }}>
                  <div>
                    {item.category && (
                      <span style={{ fontSize: "0.75rem", padding: "2px 8px", background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)", color: "#22d3ee", borderRadius: "10px", fontWeight: 600 }}>
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
                      <span key={idx} style={{ fontSize: "0.75rem", padding: "2px 6px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "#cbd5e1" }}>
                        {tech}
                      </span>
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

      {/* ------------------------------------------------------------- */}
      {/* 7. CERTIFICATES SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="certificates" style={{ padding: "100px 5%" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "2.25rem" }} className="gradient-text">Certifications</h2>

          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {certificates.map((item) => (
              <div key={item._id} className="glass-panel" style={{ padding: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{
                  width: "56px", height: "56px", flexShrink: 0, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center",
                  background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px"
                }}>
                  {item.image ? (
                    <img src={`http://localhost:5000${item.image}`} alt={item.issuer} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                  ) : (
                    <Award size={24} style={{ color: "#60a5fa" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h3>
                  <h4 style={{ fontSize: "0.85rem", color: "#60a5fa", fontWeight: 600, marginTop: "2px" }}>{item.issuer}</h4>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginTop: "2px" }}>Issued: {formatDate(item.issueDate)}</span>
                </div>
                {item.credentialUrl && (
                  <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: "8px", borderRadius: "8px" }} title="Verify Credentials">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}

            {certificates.length === 0 && (
              <p style={{ color: "#64748b", fontSize: "1rem", fontStyle: "italic", textAlign: "center", gridColumn: "1 / -1" }}>No credentials posted yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. CONTACT SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="contact" style={{ padding: "100px 5%", background: "rgba(15, 13, 34, 0.4)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "2.25rem" }} className="gradient-text">Get In Touch</h2>

          </div>

          <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "40px" }}>
            {/* Contact Details Card */}
            <div className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "30px", height: "fit-content" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>Contact Information</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "6px" }}>Have an exciting opportunity or question? Feel free to reach out directly.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {profile?.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(6, 182, 212, 0.05)", border: "1px solid rgba(6, 182, 212, 0.1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
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

            {/* Interactive Contact Form */}
            <form onSubmit={handleContactSubmit} className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {contactSuccess && (
                <div style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  color: "#4ade80",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: 500
                }}>
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
                  <input name="email" type="email" value={contactForm.email} onChange={handleContactChange} required className="input-field" placeholder="+94 7.... or Yourname@gmail.com" />
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

              <button type="submit" disabled={contactLoading} className="btn-primary" style={{ width: "fit-content" }}>
                {contactLoading ? (
                  <span className="spinner" style={{
                    width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.6s linear infinite"
                  }}></span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer style={{
        padding: "40px 5%",
        background: "#080710",
        textAlign: "center",
        fontSize: "0.85rem",
        color: "#64748b"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <span>© {new Date().getFullYear()} {profile?.name || "Portfolio"}. All rights reserved.</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            Built with React & custom HSL glassmorphism.
          </span>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* PROJECT DETAILS MODAL */}
      {/* ------------------------------------------------------------- */}
      {activeProjectModal && (
        <div className="modal-overlay" onClick={() => setActiveProjectModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setActiveProjectModal(null)} 
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-color)",
                borderRadius: "50%",
                color: "#94a3b8",
                width: "36px",
                height: "36px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
              }}
            >
              <X size={18} />
            </button>

            {activeProjectModal.image && (
              <div style={{ width: "100%", height: "240px", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                <img src={`http://localhost:5000${activeProjectModal.image}`} alt={activeProjectModal.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            <div>
              {activeProjectModal.category && (
                <span style={{ fontSize: "0.75rem", padding: "2px 8px", background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)", color: "#22d3ee", borderRadius: "10px", fontWeight: 600 }}>
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
                    <span key={idx} style={{ fontSize: "0.8rem", padding: "4px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "#cbd5e1" }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "30px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
                {activeProjectModal.githubLink && (
                  <a href={activeProjectModal.githubLink} target="_blank" rel="noreferrer" className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
                    <Github size={16} />
                    <span>View Code</span>
                  </a>
                )}
                {activeProjectModal.liveLink && (
                  <a href={activeProjectModal.liveLink} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .project-thumbnail:hover {
          transform: scale(1.05);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Portfolio;