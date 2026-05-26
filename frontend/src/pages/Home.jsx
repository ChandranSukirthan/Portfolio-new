import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Education from "../components/Education";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Achievements from "../components/Achievements";
import Contact from "../components/Contact";
import { Calendar, MapPin, Briefcase } from "lucide-react";

function Home() {
  const [profile, setProfile] = useState(null);
  const [educationList, setEducationList] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicData();
  }, []);

  const loadPublicData = async () => {
    setLoading(true);
    try {
      const [profRes, eduRes, expRes, projRes, skillRes, achRes, contactRes] = await Promise.all([
        API.get("/profile"),
        API.get("/education"),
        API.get("/experience"),
        API.get("/projects"),
        API.get("/skills"),
        API.get("/achievements"),
        API.get("/contact-info")
      ]);

      if (profRes.data) setProfile(profRes.data);
      setEducationList(eduRes.data || []);
      setExperience(expRes.data || []);
      setProjects(projRes.data || []);
      setSkills(skillRes.data || []);
      setAchievements(achRes.data || []);
      if (contactRes.data) setContactInfo(contactRes.data);
    } catch (error) {
      console.error("Error fetching portfolio public data, using static fallbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000000", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "4px solid rgba(255,255,255,0.1)", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000000", position: "relative", overflowX: "hidden" }}>
      <Navbar />

      {/* Decorative Blobs */}
      <div className="tech-blob blob-purple" style={{ top: "10%", left: "5%" }}></div>
      <div className="tech-blob blob-cyan" style={{ bottom: "20%", right: "5%" }}></div>

      {/* 1. HERO SECTION */}
      <Hero profile={profile} />

      {/* 2. EDUCATION SECTION */}
      <Education educationList={educationList} />

      {/* 3. EXPERIENCE SECTION */}
      <section 
        id="experience" 
        style={{ 
          padding: "100px 5%", 
          background: "#000000",
          borderTop: "1px solid #1f2937",
          position: "relative"
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{
              display: "inline-block",
              padding: "6px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              color: "#94a3b8",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px"
            }}>
              Professional Journey
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>Experience</h2>
            <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginTop: "10px" }}>
              My career track and professional milestones
            </p>
          </div>

          <div className="timeline-container">
            {experience.map((item) => (
              <div key={item._id} className="timeline-item">
                <div className="glass-panel" style={{ padding: "24px", background: "#080b12", border: "1px solid #1f2937" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>{item.position}</h3>
                      <h4 style={{ fontSize: "0.95rem", color: "#3b82f6", fontWeight: 600, marginTop: "4px" }}>{item.company}</h4>
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
              <div className="glass-panel" style={{ padding: "24px", background: "#080b12", border: "1px solid #1f2937", textAlign: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>AI Undergrad & Full-stack Enthusiast</h3>
                <h4 style={{ fontSize: "0.9rem", color: "#3b82f6", fontWeight: 600, marginTop: "4px" }}>Self-Employed</h4>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "10px" }}>
                  Developing MERN stacks and applying neural networks on custom models.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. PROJECTS SECTION */}
      <Projects projects={projects} />

      {/* 5. SKILLS SECTION */}
      <Skills skills={skills} />

      {/* 6. ACHIEVEMENTS SECTION */}
      <Achievements achievements={achievements} />

      {/* 7. CONTACT SECTION */}
      <Contact contactInfo={contactInfo} />

      {/* FOOTER */}
      <footer style={{
        padding: "40px 5%",
        borderTop: "1px solid #1f2937",
        background: "#000000",
        textAlign: "center",
        fontSize: "0.85rem",
        color: "#64748b"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <span>© {new Date().getFullYear()} {profile?.name || "Sukirthan Chandrakumar"}. All rights reserved.</span>
          <span>Built with React & MongoDB CMS</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
