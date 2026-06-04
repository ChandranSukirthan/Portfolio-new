import React, { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { Briefcase, Code2, Award, Mail } from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    achievements: 0,
    messages: 0
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
      const [projRes, skillRes, achRes, msgRes] = await Promise.all([
        API.get("/projects"),
        API.get("/skills"),
        API.get("/achievements"),
        API.get("/contact-messages")
      ]);

      setStats({
        projects: projRes.data?.length || 0,
        skills: skillRes.data?.length || 0,
        achievements: achRes.data?.length || 0,
        messages: msgRes.data?.length || 0
      });
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
      setError("Error gathering statistics. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Projects", count: stats.projects, icon: Briefcase, color: "#3b82f6" },
    { label: "Total Skills", count: stats.skills, icon: Code2, color: "#10b981" },
    { label: "Total Achievements", count: stats.achievements, icon: Award, color: "#a855f7" },
    { label: "Total Messages", count: stats.messages, icon: Mail, color: "#ef4444" }
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
                <div 
                  key={idx} 
                  className="glass-panel" 
                  style={{ 
                    padding: "24px", 
                    background: "#080b12", 
                    border: "1px solid #1f2937", 
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>{card.label}</span>
                    <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#fff", marginTop: "8px" }}>
                      {card.count}
                    </h2>
                  </div>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `rgba(255,255,255,0.02)`, border: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Icon size={22} style={{ color: card.color }} />
                  </div>
                </div>
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
