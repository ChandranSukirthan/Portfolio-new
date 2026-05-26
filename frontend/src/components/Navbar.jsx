import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Terminal, Shield } from "lucide-react";

function Navbar({ isDashboard = false }) {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDashboard) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // ScrollSpy logic for the 7 key sections
      const sections = ["home", "education", "experience", "projects", "skills", "achievements", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDashboard]);

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 7 standard nav links requested by user
  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Education", id: "education" },
    { label: "Experience", id: "experience" },
    { label: "Projects", id: "projects" },
    { label: "Skills", id: "skills" },
    { label: "Achievements", id: "achievements" },
    { label: "Contact", id: "contact" }
  ];

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 100,
      padding: scrolled ? "12px 5%" : "20px 5%",
      background: scrolled ? "rgba(8, 7, 16, 0.75)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid transparent",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "all 0.3s ease"
    }}>
      {/* Brand Logo / Name */}
      {!isDashboard ? (
        <div 
          onClick={() => scrollToSection("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "#fff"
          }}
        >
          <Terminal style={{ color: "#3b82f6", width: "22px", height: "22px" }} />
          <span>SUKIRTHAN<span style={{ color: "#06b6d4" }}>.</span></span>
        </div>
      ) : (
        <div />
      )}

      {/* Navigation Links */}
      {!isDashboard ? (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "24px"
        }}>
          {navLinks.map((link) => (
            <span
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              style={{
                color: activeSection === link.id ? "#60a5fa" : "#94a3b8",
                fontWeight: 500,
                fontSize: "0.95rem",
                cursor: "pointer",
                position: "relative",
                padding: "4px 0",
                transition: "color 0.2s ease"
              }}
            >
              {link.label}
              {activeSection === link.id && (
                <span style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                  borderRadius: "2px"
                }} />
              )}
            </span>
          ))}

          {/* Secure Admin Gate */}
          <RouterLink 
            to="/admin" 
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "10px",
              color: "#64748b",
              transition: "color 0.2s ease"
            }}
            title="Admin Dashboard"
            onMouseEnter={(e) => e.currentTarget.style.color = "#3b82f6"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
          >
            <Shield style={{ width: "18px", height: "18px" }} />
          </RouterLink>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <RouterLink to="/" style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#94a3b8"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
          >
            View Live Site
          </RouterLink>
          <button 
            onClick={() => {
              localStorage.removeItem("admin_token");
              navigate("/login", { replace: true });
            }}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#ef4444",
              padding: "6px 12px",
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ef4444";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.color = "#ef4444";
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
