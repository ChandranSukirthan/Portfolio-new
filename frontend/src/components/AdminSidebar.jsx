import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, User, GraduationCap, Code2, 
  Briefcase, Award, Phone, Mail, ArrowLeft 
} from "lucide-react";

function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { label: "Dashboard Home", path: "/admin", icon: LayoutDashboard },
    { label: "Manage Profile", path: "/admin/profile", icon: User },
    { label: "Manage Education", path: "/admin/education", icon: GraduationCap },
    { label: "Manage Skills", path: "/admin/skills", icon: Code2 },
    { label: "Manage Projects", path: "/admin/projects", icon: Briefcase },
    { label: "Manage Achievements", path: "/admin/achievements", icon: Award },
    { label: "Manage Contact Info", path: "/admin/contact-info", icon: Phone },
    { label: "View Messages", path: "/admin/messages", icon: Mail }
  ];

  return (
    <aside style={{
      width: "260px",
      minHeight: "100vh",
      background: "#080b12",
      borderRight: "1px solid #1f2937",
      padding: "30px 15px",
      display: "flex",
      flexDirection: "column",
      gap: "40px",
      position: "fixed",
      left: 0,
      top: 0
    }}>
      {/* Title / Logo */}
      <div style={{ padding: "0 15px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>
          PORTFOLIO <span style={{ color: "#3b82f6" }}>CMS</span>
        </h3>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Admin Control Center</span>
      </div>

      {/* Navigation list */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Link 
              key={idx}
              to={item.path}
              className={`dash-nav-item ${isActive ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: isActive ? "#fff" : "#94a3b8",
                background: isActive ? "#1e293b" : "transparent",
                borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent",
                transition: "all 0.2s ease"
              }}
            >
              <Icon size={16} style={{ color: isActive ? "#3b82f6" : "#64748b" }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to Site */}
      <div style={{ marginTop: "auto", padding: "0 15px" }}>
        <Link 
          to="/" 
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.85rem",
            color: "#94a3b8",
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
        >
          <ArrowLeft size={14} />
          <span>View Public Site</span>
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;
