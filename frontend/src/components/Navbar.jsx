import { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Terminal, Shield, Menu, X } from "lucide-react";
import { gsap } from "gsap";

function Navbar({ isDashboard = false }) {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const linksRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDashboard) return;

    // GSAP stagger reveal for nav links on mount
    if (linksRef.current) {
      const items = linksRef.current.querySelectorAll(".nav-link-item");
      gsap.fromTo(
        items,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out", delay: 0.3 }
      );
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

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
    setIsMobileOpen(false);
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

  const toggleAdminSidebar = () => {
    document.body.classList.toggle("admin-sidebar-open");
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Education", id: "education" },
    { label: "Experience", id: "experience" },
    { label: "Projects", id: "projects" },
    { label: "Skills", id: "skills" },
    { label: "Achievements", id: "achievements" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <nav
        className="nav-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          padding: scrolled ? "10px 5%" : "20px 5%",
          background: scrolled
            ? "rgba(3, 7, 18, 0.72)"
            : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(0, 245, 255, 0.08)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 4px 30px rgba(0, 0, 0, 0.4), 0 0 1px rgba(0,245,255,0.1) inset"
            : "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Brand Logo */}
        {!isDashboard ? (
          <div
            onClick={() => scrollToSection("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: "1.2rem",
              color: "#fff",
              letterSpacing: "0.04em",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(0,245,255,0.35)",
              }}
            >
              <Terminal style={{ color: "#000", width: "16px", height: "16px" }} />
            </div>
            <span>SUKIRTHAN</span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={toggleAdminSidebar}
              className="admin-sidebar-toggle"
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Menu size={20} />
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "#fff",
              }}
            >
              <Terminal style={{ color: "#3b82f6", width: "18px", height: "18px" }} />
              <span>
                PORTFOLIO <span style={{ color: "#3b82f6" }}>CMS</span>
              </span>
            </div>
          </div>
        )}

        {/* Hamburger */}
        {!isDashboard && (
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="nav-hamburger"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* Navigation Links */}
        {!isDashboard ? (
          <div ref={linksRef} className={`nav-links ${isMobileOpen ? "open" : ""}`}>
            {navLinks.map((link) => (
              <span
                key={link.id}
                className="nav-link-item"
                onClick={() => scrollToSection(link.id)}
                style={{
                  color: activeSection === link.id ? "#00f5ff" : "#94a3b8",
                  fontWeight: activeSection === link.id ? 600 : 500,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  position: "relative",
                  padding: "4px 0",
                  transition: "color 0.25s ease",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== link.id) e.currentTarget.style.color = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== link.id) e.currentTarget.style.color = "#94a3b8";
                }}
              >
                {link.label}
                {activeSection === link.id && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: 0,
                      width: "100%",
                      height: "2px",
                      background: "linear-gradient(90deg, #00f5ff, #a855f7)",
                      borderRadius: "2px",
                      boxShadow: "0 0 8px rgba(0,245,255,0.6)",
                    }}
                  />
                )}
              </span>
            ))}

            {/* Admin Gate */}
            <RouterLink
              to="/admin"
              onClick={() => setIsMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "6px",
                color: "#374151",
                transition: "color 0.2s ease",
              }}
              title="Admin Dashboard"
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00f5ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
            >
              <Shield style={{ width: "16px", height: "16px" }} />
            </RouterLink>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <RouterLink
              to="/"
              style={{ fontSize: "0.9rem", fontWeight: 600, color: "#94a3b8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
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
                transition: "all 0.2s ease",
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

      <style>{`
        /* Neon glow line under scrolled nav */
        .nav-container::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 5%;
          right: 5%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,245,255,0.25), rgba(168,85,247,0.25), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
      `}</style>
    </>
  );
}

export default Navbar;
