import React from "react";

function SectionBadge({ text }) {
  return (
    <div 
      className="section-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "6px 18px",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "20px",
        color: "#f0cfba",
        fontSize: "0.8rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: "16px",
        margin: "0 auto 16px auto",
      }}
    >
      {text}
    </div>
  );
}

export default SectionBadge;
