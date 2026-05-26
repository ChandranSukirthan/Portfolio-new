import React from "react";
import SectionBadge from "./SectionBadge";

function Skills({ skills }) {
  // Category human-readable names
  const categoryNames = {
    PROGRAMMING_LANGUAGES: "Programming Languages",
    DESIGN: "UI/UX Design",
    FULLSTACK: "Full Stack Development",
    TOOLS_PLATFORM: "Tools & Platforms",
    DATABASE: "Database Systems",
    DEVOPS: "DevOps & Cloud",
    MOBILE: "Mobile Development",
    CORE_COMPETENCIES: "Core Competencies",
    OTHER: "Other Tech"
  };

  // Group skills by category
  const groupedSkills = skills ? skills.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = [];
    }
    acc[curr.category].push(curr);
    return acc;
  }, {}) : {};

  return (
    <section 
      id="skills" 
      style={{
        padding: "100px 5%",
        background: "#000000",
        position: "relative",
        borderTop: "1px solid #1f2937"
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <SectionBadge text="Technical Expertise" />
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>Skills & Technologies</h2>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginTop: "10px" }}>
            Technologies I work with and areas of expertise
          </p>
        </div>

        {/* Categories Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {Object.keys(categoryNames).map((key) => {
            const list = groupedSkills[key] || [];
            if (list.length === 0) return null;

            return (
              <div 
                key={key} 
                className="glass-panel" 
                style={{ 
                  padding: "24px", 
                  background: "#080b12", 
                  border: "1px solid #1f2937", 
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "10px" }}>
                  {categoryNames[key]}
                </h3>

                {/* Skill List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {list.map((skill) => (
                    <div 
                      key={skill._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 12px",
                        background: skill.highlight ? "rgba(59, 130, 246, 0.05)" : "transparent",
                        border: skill.highlight ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid transparent",
                        borderRadius: "8px"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {skill.icon && (
                          <span style={{ fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: skill.icon }} />
                        )}
                        <span style={{ fontWeight: 500, color: skill.highlight ? "#3b82f6" : "#e2e8f0" }}>
                          {skill.skillName}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {(!skills || skills.length === 0) && (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            No skills found. Manage them in the admin control center.
          </div>
        )}

      </div>
    </section>
  );
}

export default Skills;
