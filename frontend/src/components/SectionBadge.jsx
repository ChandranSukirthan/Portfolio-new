import React from "react";

function SectionBadge({ text }) {
  return (
    <div 
      style={{
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
      }}
    >
      {text}
    </div>
  );
}

export default SectionBadge;
