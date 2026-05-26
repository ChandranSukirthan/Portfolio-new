import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { Shield, Mail, Lock, LogIn, UserPlus } from "lucide-react";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      {/* Decorative Blobs */}
      <div className="tech-blob blob-purple" style={{ top: "25%", left: "20%" }}></div>
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
            background: "rgba(147, 51, 234, 0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid rgba(147, 51, 234, 0.2)"
          }}>
            <Shield style={{ width: "24px", height: "24px", color: "#a855f7" }} />
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
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ width: "100%", paddingLeft: "42px" }}
              />
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
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{
              color: "#a855f7",
              fontWeight: 600,
              cursor: "pointer",
              transition: "color 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.color = "#c084fc"}
            onMouseLeave={(e) => e.target.style.color = "#a855f7"}
          >
            {isLogin 
              ? "Setup primary administrator account" 
              : "Return to standard log in"}
          </span>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Login;
