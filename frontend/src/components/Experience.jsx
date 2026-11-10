import React from "react";
import SectionBadge from "./SectionBadge";
import { Calendar, MapPin, Building2, Briefcase } from "lucide-react";

function Experience({ experience = [] }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return String(dateString);
      return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    } catch {
      return String(dateString);
    }
  };

  return (
    <section
      id="experience"
      style={{
        padding: "100px 5%",
        background: "transparent",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <SectionBadge text="Career Journey" />
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>
            Work Experience
          </h2>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "1.05rem",
              marginTop: "10px",
              maxWidth: "600px",
              margin: "10px auto 0",
            }}
          >
            My professional career track, roles, and industry milestones
          </p>
        </div>

        {/* Experience List / Timeline */}
        {experience && experience.length > 0 ? (
          <div className="timeline-container">
            {experience.map((item) => (
              <div key={item._id} className="timeline-item">
                <div
                  className="glass-panel"
                  style={{
                    padding: "26px",
                    background: "#080b12",
                    border: "1px solid #1f2937",
                    borderRadius: "16px",
                    transition: "border-color 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1f2937";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          {item.position}
                        </h3>
                        {item.current && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              background: "rgba(16,185,129,0.12)",
                              border: "1px solid rgba(16,185,129,0.3)",
                              color: "#10b981",
                              padding: "2px 10px",
                              borderRadius: "20px",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}
                          >
                            Present
                          </span>
                        )}
                      </div>

                      <h4
                        style={{
                          fontSize: "1rem",
                          color: "#3b82f6",
                          fontWeight: 600,
                          marginTop: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Building2 size={16} />
                        {item.company}
                      </h4>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        fontSize: "0.85rem",
                        color: "#94a3b8",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "rgba(255,255,255,0.03)",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <Calendar size={13} style={{ color: "#3b82f6" }} />
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
                            gap: "5px",
                            color: "#64748b",
                            fontSize: "0.8rem",
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
                        fontSize: "0.92rem",
                        marginTop: "16px",
                        lineHeight: 1.7,
                        whiteSpace: "pre-line",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        paddingTop: "14px",
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: "40px 24px",
              background: "#080b12",
              border: "1px dashed #1f2937",
              borderRadius: "16px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Briefcase size={36} style={{ color: "#3b82f6", opacity: 0.7 }} />
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>
              Seeking Opportunities
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", maxWidth: "480px" }}>
              Passionate AI undergraduate and full-stack developer actively seeking
              internship and software engineering opportunities.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;

