import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { Shield, Mail, Lock, LogIn, UserPlus, ArrowLeft, Eye, EyeOff } from "lucide-react";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await API.post(endpoint, { email, password });
      
      if (res.data.success) {
        localStorage.setItem("admin_token", res.data.token);
        setSuccess(isLogin ? "Login successful!" : "Admin account created successfully!");
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      padding: "20px",
      background: "radial-gradient(circle at center, #0f0d22 0%, #080710 100%)",
      overflow: "hidden"
    }}>
      {/* Back to Portfolio Button on the left side */}
      <button
        onClick={() => navigate("/")}
        className="login-back-btn"
        title="Back to Portfolio"
        style={{
          position: "fixed",
          top: "28px",
          left: "28px",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 18px",
          background: "rgba(8, 11, 20, 0.85)",
          border: "1px solid rgba(0, 245, 255, 0.3)",
          borderRadius: "24px",
          color: "#00f5ff",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 18px rgba(0, 245, 255, 0.12)",
          zIndex: 100,
          transition: "all 0.25s ease",
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Portfolio</span>
      </button>

      {/* Decorative Blobs */}
      <div className="tech-blob blob-blue" style={{ top: "25%", left: "20%" }}></div>
      <div className="tech-blob blob-cyan" style={{ bottom: "25%", right: "20%" }}></div>

      {/* Login Card */}
      <div className="glass-panel" style={{
        width: "100%",
        maxWidth: "420px",
        padding: "40px 30px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px"
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(0, 245, 255, 0.08)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid rgba(0, 245, 255, 0.25)"
          }}>
            <Shield style={{ width: "24px", height: "24px", color: "#00f5ff" }} />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", marginTop: "10px" }}>
            {isLogin ? "Admin Login" : "Initialize Admin"}
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", textAlign: "center" }}>
            {isLogin 
              ? "Access your portfolio dashboard to manage your content." 
              : "Create the primary administrator account for this portfolio."}
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#f87171",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            color: "#4ade80",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 500
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Mail style={{
                position: "absolute",
                left: "14px",
                width: "18px",
                height: "18px",
                color: "#64748b"
              }} />
              <input
                type="email"
                required
                placeholder="admin@portfolio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ width: "100%", paddingLeft: "42px" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Lock style={{
                position: "absolute",
                left: "14px",
                width: "18px",
                height: "18px",
                color: "#64748b"
              }} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ width: "100%", paddingLeft: "42px", paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "transparent",
                  border: "none",
                  color: showPassword ? "#00f5ff" : "#64748b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  borderRadius: "6px",
                  transition: "color 0.2s ease, transform 0.15s ease",
                }}
              >
                {showPassword ? (
                  <EyeOff style={{ width: "18px", height: "18px" }} />
                ) : (
                  <Eye style={{ width: "18px", height: "18px" }} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "12px",
              fontSize: "0.95rem",
              marginTop: "8px"
            }}
          >
            {loading ? (
              <span className="spinner" style={{
                width: "18px",
                height: "18px",
                border: "2px solid rgba(255,255,255,0.2)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite"
              }}></span>
            ) : isLogin ? (
              <>
                <LogIn style={{ width: "18px", height: "18px" }} />
                <span>Log In</span>
              </>
            ) : (
              <>
                <UserPlus style={{ width: "18px", height: "18px" }} />
                <span>Setup Account</span>
              </>
            )}
          </button>
        </form>

        <div style={{
          display: "flex",
          justifyContent: "center",
          fontSize: "0.85rem",
          color: "#94a3b8"
        }}>
        
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .login-back-btn:hover {
          background: rgba(0, 245, 255, 0.15) !important;
          border-color: #00f5ff !important;
          box-shadow: 0 0 24px rgba(0, 245, 255, 0.35) !important;
          transform: translateX(-3px);
        }
        @media (max-width: 600px) {
          .login-back-btn {
            top: 16px !important;
            left: 16px !important;
            padding: 8px 14px !important;
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;