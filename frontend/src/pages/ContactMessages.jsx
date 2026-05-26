import React, { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { Trash2, Calendar, User, PhoneCall, MessageSquare } from "lucide-react";

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/contact-messages");
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    setSuccess("");
    setError("");
    try {
      const res = await API.delete(`/contact-messages/${id}`);
      if (res.data.success) {
        setSuccess("Message deleted successfully.");
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete contact message.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000000", color: "#f8fafc", paddingLeft: "260px" }}>
      <Navbar isDashboard={true} />
      <AdminSidebar />

      <main style={{ padding: "40px" }}>
        {/* Title */}
        <div style={{ borderBottom: "1px solid #1f2937", paddingBottom: "20px", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>
            Contact <span style={{ color: "#3b82f6" }}>Messages</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
            View and organize direct inquiries submitted by visitors from the public contact form.
          </p>
        </div>

        {success && (
          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#10b981", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px" }}>
            {success}
          </div>
        )}
        
        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <div style={{ width: "30px", height: "30px", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {messages.map((msg) => (
              <div 
                key={msg._id} 
                className="glass-panel" 
                style={{ 
                  padding: "24px", 
                  background: "#080b12", 
                  border: "1px solid #1f2937", 
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px"
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "#fff", fontSize: "1.1rem" }}>
                      <User size={16} style={{ color: "#3b82f6" }} />
                      <span>{msg.fullName}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>
                      <PhoneCall size={14} style={{ color: "#64748b" }} />
                      <span>{msg.phoneOrEmail}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <Calendar size={12} />
                      <span>{formatDate(msg.createdAt)}</span>
                    </span>
                    
                    <button 
                      onClick={() => handleDelete(msg._id)}
                      style={{ 
                        background: "transparent", 
                        border: "none", 
                        color: "#64748b", 
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: "4px"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
                      title="Delete Message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "8px", padding: "16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <MessageSquare size={16} style={{ color: "#64748b", marginTop: "3px", flexShrink: 0 }} />
                  <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" }}>
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px", color: "#64748b", border: "1px dashed #1f2937", borderRadius: "12px" }}>
                No contact messages found.
              </div>
            )}
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

export default ContactMessages;
