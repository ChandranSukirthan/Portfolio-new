import React from "react";
import SectionBadge from "./SectionBadge";
import { ExternalLink, Calendar, ShieldCheck } from "lucide-react";

function Achievements({ achievements }) {
  return (
    <section 
      id="achievements" 
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
          <SectionBadge text="Accomplishments" />
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>Achievements</h2>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginTop: "10px" }}>
            Certifications, awards, and professional milestones
          </p>
        </div>

        {/* Achievement Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {achievements && achievements.map((ach) => (
            <div 
              key={ach._id} 
              className="glass-panel" 
              style={{ 
                padding: "24px", 
                background: "#080b12", 
                border: "1px solid #1f2937", 
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                justifyContent: "space-between",
                height: "100%"
              }}
            >
              <div>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.1)", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
                    <ShieldCheck size={20} style={{ color: "#3b82f6" }} />
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
                    <span>{ach.issuedDate}</span>
                  </span>
                </div>

                {/* Info block */}
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginTop: "14px" }}>
                  {ach.title}
                </h3>
                <h4 style={{ fontSize: "0.9rem", color: "#3b82f6", fontWeight: 600, marginTop: "4px" }}>
                  {ach.issuer}
                </h4>
                {ach.description && (
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "12px", lineHeight: 1.5 }}>
                    {ach.description}
                  </p>
                )}
              </div>

              {/* Action row */}
              {ach.certificateLink && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px", marginTop: "10px" }}>
                  <a 
                    href={ach.certificateLink} 
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
        </div>

        {(!achievements || achievements.length === 0) && (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            No achievements found. Add certifications in the admin dashboard.
          </div>
        )}

      </div>
    </section>
  );
}

export default Achievements;
