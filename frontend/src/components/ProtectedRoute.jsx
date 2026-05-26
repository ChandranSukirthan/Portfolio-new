import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api/api";

function ProtectedRoute({ children }) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setIsAuthenticated(false);
        setIsVerifying(false);
        return;
      }

      try {
        // Set authorization header manually for verification
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await API.get("/auth/verify");
        if (res.data.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("admin_token");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Token verification failed:", err.message);
        localStorage.removeItem("admin_token");
        setIsAuthenticated(false);
      } finally {
        setIsVerifying(false);
      }
    };

    checkAuth();
  }, []);

  if (isVerifying) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#080710",
        color: "#fff",
        fontFamily: "sans-serif"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(255,255,255,0.1)",
          borderTop: "4px solid #9333ea",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "15px"
        }} />
        <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>Verifying credentials...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
