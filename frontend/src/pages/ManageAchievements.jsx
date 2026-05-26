import React, { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { Plus, Trash2, Edit3, Save, X } from "lucide-react";

function ManageAchievements() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issuedDate: "",
    certificateLink: "",
    description: ""
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await API.get("/achievements");
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load achievements list.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setActionLoading(true);

    if (!formData.title || !formData.issuer || !formData.issuedDate) {
      setError("Please fill out all the required form fields.");
      setActionLoading(false);
      return;
    }

    try {
      if (editId) {
        const res = await API.put(`/achievements/${editId}`, formData);
        if (res.data.success) {
          setSuccess("Achievement updated successfully!");
          fetchAchievements();
          resetForm();
        }
      } else {
        const res = await API.post("/achievements", formData);
        if (res.data.success) {
          setSuccess("Achievement added successfully!");
          fetchAchievements();
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save achievement.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title || "",
      issuer: item.issuer || "",
      issuedDate: item.issuedDate || "",
      certificateLink: item.certificateLink || "",
      description: item.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this achievement?")) return;
    setSuccess("");
    setError("");
    try {
      const res = await API.delete(`/achievements/${id}`);
      if (res.data.success) {
        setSuccess("Achievement deleted successfully.");
        fetchAchievements();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete achievement.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      issuedDate: "",
      certificateLink: "",
      description: ""
    });
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000000", color: "#f8fafc", paddingLeft: "260px" }}>
      <Navbar isDashboard={true} />
      <AdminSidebar />

      <main style={{ padding: "40px" }}>
        {/* Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1f2937", paddingBottom: "20px", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>
              Manage <span style={{ color: "#3b82f6" }}>Achievements</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
              Insert, update, or remove certifications and achievements shown on your portfolio.
            </p>
          </div>

          {!showForm && (
            <button 
              onClick={() => setShowForm(true)} 
              className="btn-primary" 
              style={{ background: "#fff", color: "#000", fontWeight: 600, padding: "8px 16px", borderRadius: "6px" }}
            >
              <Plus size={16} />
              <span>Add Achievement</span>
            </button>
          )}
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

        {/* Dynamic Form */}
        {showForm && (
          <form onSubmit={handleFormSubmit} className="glass-panel" style={{ padding: "30px", background: "#080b12", border: "1px solid #1f2937", borderRadius: "16px", marginBottom: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                {editId ? "Edit Achievement Details" : "Add New Achievement"}
              </h3>
              <button type="button" onClick={resetForm} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label">Achievement Title</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required className="input-field" placeholder="e.g. AWS Certified Solutions Architect" />
              </div>
              <div className="form-group">
                <label className="form-label">Issuer</label>
                <input name="issuer" value={formData.issuer} onChange={handleInputChange} required className="input-field" placeholder="e.g. Amazon Web Services" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label">Issued Date</label>
                <input name="issuedDate" value={formData.issuedDate} onChange={handleInputChange} required className="input-field" placeholder="e.g. November 2025" />
              </div>
              <div className="form-group">
                <label className="form-label">Certificate Verification URL</label>
                <input name="certificateLink" value={formData.certificateLink} onChange={handleInputChange} className="input-field" placeholder="https://verify.com/cert/..." />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Achievement Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field" style={{ minHeight: "100px" }} placeholder="Brief description of the accomplishment..." />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" disabled={actionLoading} className="btn-primary" style={{ background: "#fff", color: "#000" }}>
                <Save size={16} />
                <span>{actionLoading ? "Saving..." : "Save Record"}</span>
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        )}

        {/* Achievements Listing */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <div style={{ width: "30px", height: "30px", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {list.map((item) => (
              <div 
                key={item._id} 
                className="glass-panel" 
                style={{ 
                  padding: "16px 24px", 
                  background: "#080b12", 
                  border: "1px solid #1f2937", 
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>{item.title}</h4>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.issuer} • {item.issuedDate}</span>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleEdit(item)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.color = "#3b82f6"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {list.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b", border: "1px dashed #1f2937", borderRadius: "12px" }}>
                No achievement records found. Add one above.
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

export default ManageAchievements;
