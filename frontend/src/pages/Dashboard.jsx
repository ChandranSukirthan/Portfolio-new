import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { Briefcase, Code2, Award, Mail, Building2, GraduationCap, ArrowRight } from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    achievements: 0,
    messages: 0,
    experience: 0,
    education: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const [projRes, skillRes, achRes, msgRes, expRes, eduRes] = await Promise.all([
        API.get("/projects"),
        API.get("/skills"),
        API.get("/achievements"),
        API.get("/contact-messages"),
        API.get("/experience"),
        API.get("/education")
      ]);

      setStats({
        projects: projRes.data?.length || 0,
        skills: skillRes.data?.length || 0,
        achievements: achRes.data?.length || 0,
        messages: msgRes.data?.length || 0,
        experience: expRes.data?.length || 0,
        education: eduRes.data?.length || 0
      });
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
      setError("Error gathering statistics. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Projects", count: stats.projects, icon: Briefcase, color: "#3b82f6", path: "/admin/projects" },
    { label: "Work Experience", count: stats.experience, icon: Building2, color: "#f59e0b", path: "/admin/experience" },
    { label: "Education History", count: stats.education, icon: GraduationCap, color: "#8b5cf6", path: "/admin/education" },
    { label: "Total Skills", count: stats.skills, icon: Code2, color: "#10b981", path: "/admin/skills" },
    { label: "Total Achievements", count: stats.achievements, icon: Award, color: "#ec4899", path: "/admin/achievements" },
    { label: "Total Messages", count: stats.messages, icon: Mail, color: "#ef4444", path: "/admin/messages" }
  ];

  return (
    <div className="admin-container">
      <Navbar isDashboard={true} />
      <AdminSidebar />

      <main className="admin-main">
        {/* Title */}
        <div style={{ marginBottom: "30px", borderBottom: "1px solid #1f2937", paddingBottom: "20px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>
            Dashboard <span style={{ color: "#3b82f6" }}>Home</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
            Overview and summary metrics of your dynamic portfolio CMS database.
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
            <div style={{ width: "36px", height: "36px", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  to={card.path}
                  className="glass-panel"
                  style={{
                    padding: "24px",
                    background: "#080b12",
                    border: "1px solid #1f2937",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "border-color 0.2s, transform 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1f2937";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div>
                    <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>{card.label}</span>
                    <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#fff", marginTop: "8px" }}>
                      {card.count}
                    </h2>
                    <span style={{ fontSize: "0.75rem", color: card.color, display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                      Manage <ArrowRight size={12} />
                    </span>
                  </div>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `rgba(255,255,255,0.02)`, border: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Icon size={22} style={{ color: card.color }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
