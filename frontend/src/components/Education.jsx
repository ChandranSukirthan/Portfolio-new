import React from "react";
import SectionBadge from "./SectionBadge";

function Education({ educationList }) {
  return (
    <section 
      id="education" 
      style={{
        padding: "100px 5%",
        background: "#000000",
        position: "relative",
        borderTop: "1px solid #1f2937"
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto"}}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <SectionBadge text="Academic Background"/>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>Education</h2>
          <p style={{ color: "#21daeb", fontSize: "1.05rem", marginTop: "10px", maxWidth: "600px", margin: "10px auto 0" }}>
            My academic qualifications and achievements
          </p>
        </div>

        {/* Card Grid Layout */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {educationList && educationList.map((edu) => (
            <div 
              key={edu._id} 
              className="glass-panel" 
              style={{ 
                padding: "30px", 
                background: "#080b12", 
                border: "1px solid #1f2937", 
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}
            >
              {/* Card Top Block */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#fff" }}>
                    {edu.instituteName}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1rem", color: "#3b82f6", fontWeight: 600 }}>{edu.degree}</span>
                    {edu.specialization && (
                      <>
                    
                        <span style={{ fontSize: "1rem", color: "#3b82f6", }}>{edu.specialization}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Badges Column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <span style={{ 
                    padding: "4px 12px", 
                    background: "rgba(59, 130, 246, 0.1)", 
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    borderRadius: "20px", 
                    fontSize: "0.8rem", 
                    fontWeight: 600, 
                    color: "#3b82f6" 
                  }}>
                    {edu.startYear} — {edu.currentStatus ? "Present" : edu.endYear}
                  </span>
                  {edu.gpa && (
                    <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: 700 }}>
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>
              </div>

              {/* Description Body */}
              {edu.description && (
                <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "14px" }}>
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
