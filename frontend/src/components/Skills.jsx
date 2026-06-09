import React, { useRef, useEffect, useState } from "react";
import SectionBadge from "./SectionBadge";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const categoryNames = {
  PROGRAMMING_LANGUAGES: "Programming Languages",
  DESIGN: "UI/UX Design",
  FULLSTACK: "Full Stack Development",
  TOOLS_PLATFORM: "Tools & Platforms",
  DATABASE: "Database Systems",
  DEVOPS: "DevOps & Cloud",
  MOBILE: "Mobile Development",
  MACHINE_LEARNING: "Machine Learning",
  Generative_AI: "Generative AI",
  CORE_COMPETENCIES: "Core Competencies",
  OTHER: "Other Tech",
};

const CATEGORY_ICONS = {
  PROGRAMMING_LANGUAGES: "⌨️",
  DESIGN: "🎨",
  FULLSTACK: "🌐",
  TOOLS_PLATFORM: "🔧",
  DATABASE: "🗄️",
  DEVOPS: "☁️",
  MOBILE: "📱",
  MACHINE_LEARNING: "🧠",
  Generative_AI: "✨",
  CORE_COMPETENCIES: "💡",
  OTHER: "🔬",
};

function SkillCard({ categoryKey, skills, cardIndex, expanded, onToggle }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: "power3.out",
            delay: cardIndex * 0.08,
          }
        );
      },
      once: true,
    });

    return () => trigger.kill();
  }, [cardIndex]);

  return (
    <div
      ref={cardRef}
      style={{
        background: "rgba(8,11,18,0.95)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        overflow: "hidden",
        opacity: 0,
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,245,255,0.2)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,245,255,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Card Header */}
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          cursor: "pointer",
          borderBottom: expanded
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
          transition: "border-color 0.3s",
          background: expanded
            ? "rgba(0,245,255,0.02)"
            : "transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: "1.4rem",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,245,255,0.06)",
              borderRadius: "10px",
              border: "1px solid rgba(0,245,255,0.12)",
            }}
          >
            {CATEGORY_ICONS[categoryKey] || "💻"}
          </span>
          <div>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              {categoryNames[categoryKey]}
            </h3>
            <span style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 600 }}>
              {skills.length} skill{skills.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <ChevronDown
          size={16}
          style={{
            color: "#00f5ff",
            transition: "transform 0.3s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </div>

      {/* Collapsible Skill List */}
      <div
        style={{
          maxHeight: expanded ? "600px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          style={{
            padding: "16px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            overflowY: "auto",
            maxHeight: "560px",
          }}
        >
          {skills.map((skill, i) => (
            <div
              key={skill._id || i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {skill.icon && (
                  <span
                    style={{ fontSize: "0.9rem" }}
                    dangerouslySetInnerHTML={{ __html: skill.icon }}
                  />
                )}
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: skill.highlight ? 700 : 500,
                    color: skill.highlight ? "#00f5ff" : "#e2e8f0",
                  }}
                >
                  {skill.skillName}
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "#475569",
                  textAlign: "right",
                }}
              >
                {skill.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Skills({ skills }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const groupedSkills = skills
    ? skills.reduce((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = [];
        acc[curr.category].push(curr);
        return acc;
      }, {})
    : {};

  const categoryKeys = Object.keys(categoryNames).filter(
    (k) => groupedSkills[k] && groupedSkills[k].length > 0
  );

  // Calculate totals for summary bar
  const totalSkills = skills?.length || 0;

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        padding: "100px 5%",
        background: "transparent",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: "absolute", top: "15%", left: "-8%", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)", filter: "blur(70px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-8%", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: "56px" }}>
          <SectionBadge text="Technical Expertise" />
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>
            Skills &amp;{" "}
            <span style={{ background: "linear-gradient(135deg, #00f5ff, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Technologies
            </span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginTop: "10px" }}>
            {totalSkills > 0
              ? `${totalSkills} skills across ${categoryKeys.length} categories — click a category to view its skills`
              : "Technologies I work with and areas of expertise"}
          </p>
        </div>

        {/* Stats row */}
        {categoryKeys.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "40px",
            }}
          >
            {[
              { label: "Total Skills", value: totalSkills, color: "#00f5ff" },
              { label: "Categories", value: categoryKeys.length, color: "#a855f7" },
              { label: "Expert+", value: skills?.filter((s) => s.level === "Expert" || s.level === "Master" || s.level === "Advanced").length || 0, color: "#f59e0b" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(8,11,18,0.8)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  padding: "14px 28px",
                  textAlign: "center",
                  minWidth: "120px",
                }}
              >
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#475569", marginTop: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills grid */}
        {categoryKeys.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxWidth: "720px",
              margin: "0 auto",
            }}
          >
            {categoryKeys.map((key, idx) => (
              <SkillCard
                key={key}
                categoryKey={key}
                skills={groupedSkills[key]}
                cardIndex={idx}
                expanded={activeCategory === key}
                onToggle={() =>
                  setActiveCategory((current) => (current === key ? null : key))
                }
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            No skills found. Add your skills from the admin center.
          </div>
        )}
      </div>
    </section>
  );
}

export default Skills;
