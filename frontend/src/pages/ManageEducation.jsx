import React, { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { Plus, Trash2, Edit3, Save, X } from "lucide-react";

function ManageEducation() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    instituteName: "",
    degree: "",
    specialization: "",
    startYear: "",
    endYear: "Present",
    currentStatus: false,
    gpa: "",
    description: ""
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const res = await API.get("/education");
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load education items.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setActionLoading(true);

    if (!formData.instituteName || !formData.degree || !formData.startYear) {
      setError("Please fill out all the required form fields.");
      setActionLoading(false);
      return;
    }

    try {
      if (editId) {
        const res = await API.put(`/education/${editId}`, formData);
        if (res.data.success) {
          setSuccess("Education item updated successfully!");
          fetchEducation();
          resetForm();
        }
      } else {
        const res = await API.post("/education", formData);
        if (res.data.success) {
          setSuccess("Education item added successfully!");
          fetchEducation();
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save education record.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      instituteName: item.instituteName || "",
      degree: item.degree || "",
      specialization: item.specialization || "",
      startYear: item.startYear || "",
      endYear: item.endYear || "Present",
      currentStatus: item.currentStatus || false,
      gpa: item.gpa || "",
      description: item.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this education item?")) return;
    setSuccess("");
    setError("");
    try {
      const res = await API.delete(`/education/${id}`);
      if (res.data.success) {
        setSuccess("Education record deleted successfully.");
        fetchEducation();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete education record.");
    }
  };

  const resetForm = () => {
    setFormData({
      instituteName: "",
      degree: "",
      specialization: "",
      startYear: "",
      endYear: "Present",
      currentStatus: false,
      gpa: "",
      description: ""
    });
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="admin-container">
      <Navbar isDashboard={true} />
      <AdminSidebar />

      <main className="admin-main">
        {/* Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1f2937", paddingBottom: "20px", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>
              Manage <span style={{ color: "#3b82f6" }}>Education</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
              Insert, update, or remove academic qualifications displayed on your portfolio.
            </p>
          </div>

          {!showForm && (
            <button 
              onClick={() => setShowForm(true)} 
              className="btn-primary" 
              style={{ background: "#fff", color: "#000", fontWeight: 600, padding: "8px 16px", borderRadius: "6px" }}
            >
              <Plus size={16} />
              <span>Add Education</span>
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
                {editId ? "Edit Education Record" : "Add New Education Record"}
              </h3>
              <button type="button" onClick={resetForm} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Institute Name</label>
                <input name="instituteName" value={formData.instituteName} onChange={handleInputChange} required className="input-field" placeholder="e.g. Stanford University" />
              </div>
              <div className="form-group">
                <label className="form-label">Degree</label>
                <input name="degree" value={formData.degree} onChange={handleInputChange} required className="input-field" placeholder="e.g. Bachelor of Science" />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Specialization / Major</label>
                <input name="specialization" value={formData.specialization} onChange={handleInputChange} className="input-field" placeholder="e.g. Computer Science" />
              </div>
              <div className="form-group">
                <label className="form-label">GPA</label>
                <input name="gpa" value={formData.gpa} onChange={handleInputChange} className="input-field" placeholder="e.g. 3.9/4.0" />
              </div>
              <div className="form-group">
                <label className="form-label">Start Year</label>
                <input name="startYear" value={formData.startYear} onChange={handleInputChange} required className="input-field" placeholder="e.g. 2022" />
              </div>
            </div>

            <div className="form-grid-2" style={{ alignItems: "center" }}>
              <div className="form-group">
                <label className="form-label">End Year</label>
                <input name="endYear" value={formData.endYear} onChange={handleInputChange} disabled={formData.currentStatus} className="input-field" placeholder="e.g. 2026" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px" }}>
                <input type="checkbox" name="currentStatus" id="currentStatus" checked={formData.currentStatus} onChange={handleInputChange} style={{ width: "16px", height: "16px" }} />
                <label htmlFor="currentStatus" style={{ fontSize: "0.9rem", color: "#94a3b8", cursor: "pointer" }}>Currently Studying Here</label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description / Achievements</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field" style={{ minHeight: "100px" }} placeholder="Describe coursework, honors, or research projects..." />
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

        {/* Records Listing */}
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
                  padding: "20px 24px", 
                  background: "#080b12", 
                  border: "1px solid #1f2937", 
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px"
                }}
              >
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>{item.instituteName}</h4>
                  <span style={{ fontSize: "0.85rem", color: "#3b82f6" }}>{item.degree} {item.specialization && `(${item.specialization})`}</span>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                    <span>{item.startYear} — {item.currentStatus ? "Present" : item.endYear}</span>
                    {item.gpa && <span style={{ marginLeft: "12px" }}>GPA: {item.gpa}</span>}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleEdit(item)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }} onMouseEnter={(e) => e.currentTarget.style.color = "#3b82f6"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }} onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {list.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b", border: "1px dashed #1f2937", borderRadius: "12px" }}>
                No education records found. Add one above.
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

export default ManageEducation;
