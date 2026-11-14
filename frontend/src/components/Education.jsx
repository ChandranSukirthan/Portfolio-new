import React from "react";
import SectionBadge from "./SectionBadge";

function Education({ educationList }) {
  return (
    <section 
      id="education" 
      style={{
        padding: "100px 5%",
        background: "transparent",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)"
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto"}}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <SectionBadge text="Academic Background"/>
          <h2 className="section-title-3d" style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>Education</h2>
          <p style={{ color: "#21daeb", fontSize: "1.05rem", marginTop: "10px", maxWidth: "600px", margin: "10px auto 0" }}>
            My academic qualifications and achievements
          </p>
        </div>

        {/* Card Grid Layout */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
          {educationList && educationList.map((edu) => (
            <div 
              key={edu._id} 
              className="glass-panel" 
              style={{ 
                width: "100%",
                maxWidth: "900px",
                padding: "32px 28px", 
                background: "#080b12", 
                border: "1px solid #1f2937", 
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "16px"
              }}
            >
              {/* Centered Top Block */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "100%" }}>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", textAlign: "center" }}>
                  {edu.instituteName}
                </h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "1.05rem", color: "#38bdf8", fontWeight: 600 }}>{edu.degree}</span>
                  {edu.specialization && (
                    <>
                      <span style={{ color: "#64748b" }}>•</span>
                      <span style={{ fontSize: "1.05rem", color: "#00f5ff" }}>{edu.specialization}</span>
                    </>
                  )}
                </div>

                {/* Badges Row — Centered */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginTop: "6px" }}>
                  <span style={{ 
                    padding: "4px 14px", 
                    background: "rgba(56, 189, 248, 0.1)", 
                    border: "1px solid rgba(56, 189, 248, 0.25)",
                    borderRadius: "20px", 
                    fontSize: "0.8rem", 
                    fontWeight: 600, 
                    color: "#38bdf8" 
                  }}>
                    {edu.startYear} — {edu.currentStatus ? "Present" : edu.endYear}
                  </span>
                  {edu.gpa && (
                    <span style={{ 
                      padding: "4px 12px",
                      background: "rgba(0, 245, 255, 0.08)",
                      border: "1px solid rgba(0, 245, 255, 0.2)",
                      borderRadius: "20px",
                      fontSize: "0.82rem", 
                      color: "#00f5ff", 
                      fontWeight: 700 
                    }}>
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>
              </div>

              {/* Description Body — Centered */}
              {edu.description && (
                <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px", textAlign: "center", maxWidth: "750px", margin: "0 auto" }}>
                  {edu.description}
                </p>
              )}
            </div>
          ))}

          {(!educationList || educationList.length === 0) && (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              No education records found. Add them from the admin dashboard.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default Education;
