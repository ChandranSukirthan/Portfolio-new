import React, { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import {
  Plus, Trash2, Edit3, Save, X, Briefcase,
  MapPin, Calendar, Building2, ChevronDown, ChevronUp
} from "lucide-react";

function ManageExperience() {
  const [list, setList]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess]         = useState("");
  const [error, setError]             = useState("");
  const [showForm, setShowForm]       = useState(false);
  const [editId, setEditId]           = useState(null);
  const [expandedId, setExpandedId]   = useState(null);

  const emptyForm = {
    company:     "",
    position:    "",
    location:    "",
    startDate:   "",
    endDate:     "",
    current:     false,
    description: ""
  };
  const [formData, setFormData] = useState(emptyForm);

  /* ─── helpers ────────────────────────────────────────────── */
  const formatDateForInput = (d) => {
    if (!d) return "";
    return new Date(d).toISOString().split("T")[0];
  };

  const formatDisplayDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const clearAlerts = () => { setSuccess(""); setError(""); };

  const showSuccess = (msg) => {
    setSuccess(msg); setError("");
    setTimeout(() => setSuccess(""), 3500);
  };

  const showError = (msg) => {
    setError(msg); setSuccess("");
    setTimeout(() => setError(""), 4000);
  };

  /* ─── data fetch ─────────────────────────────────────────── */
  useEffect(() => { fetchExperience(); }, []);

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const res = await API.get("/experience");
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      showError("Failed to load experience records.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── form handlers ──────────────────────────────────────── */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "current" && checked ? { endDate: "" } : {})
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!formData.company || !formData.position || !formData.startDate) {
      showError("Company, Position, and Start Date are required.");
      return;
    }

    setActionLoading(true);
    try {
      if (editId) {
        const res = await API.put(`/experience/${editId}`, formData);
        if (res.data.success) {
          showSuccess("Experience updated successfully!");
          fetchExperience();
          resetForm();
        }
      } else {
        const res = await API.post("/experience", formData);
        if (res.data.success) {
          showSuccess("Experience record added successfully!");
          fetchExperience();
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Failed to save experience record.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      company:     item.company     || "",
      position:    item.position    || "",
      location:    item.location    || "",
      startDate:   formatDateForInput(item.startDate),
      endDate:     formatDateForInput(item.endDate),
      current:     item.current     || false,
      description: item.description || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience record?")) return;
    clearAlerts();
    try {
      const res = await API.delete(`/experience/${id}`);
      if (res.data.success) {
        showSuccess("Experience record deleted.");
        setList(prev => prev.filter(i => i._id !== id));
      }
    } catch (err) {
      console.error(err);
      showError("Failed to delete record.");
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <div className="admin-container">
      <Navbar isDashboard={true} />
      <AdminSidebar />

      <main className="admin-main">

        {/* ── Page Header ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid #1f2937", paddingBottom: "20px", marginBottom: "30px"
        }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>
              Manage <span style={{ color: "#3b82f6" }}>Experience</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
              Add, edit, or remove professional work experience entries shown on your portfolio.
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
              style={{ background: "#fff", color: "#000", fontWeight: 600, padding: "8px 18px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Plus size={16} />
              <span>Add Experience</span>
            </button>
          )}
        </div>

        {/* ── Alerts ── */}
        {success && (
          <div style={{
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            color: "#10b981", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px",
            display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem"
          }}>
            <span>✓</span> {success}
          </div>
        )}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            color: "#ef4444", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px",
            display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem"
          }}>
            <span>✗</span> {error}
          </div>
        )}

        {/* ── Form ── */}
        {showForm && (
          <form
            onSubmit={handleFormSubmit}
            style={{
              background: "#080b12", border: "1px solid #1f2937", borderRadius: "16px",
              padding: "30px", marginBottom: "32px", display: "flex", flexDirection: "column", gap: "22px"
            }}
          >
            {/* Form Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Briefcase size={16} style={{ color: "#3b82f6" }} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                  {editId ? "Edit Experience Record" : "New Experience Record"}
                </h3>
              </div>
              <button
                type="button" onClick={resetForm}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
              >
                <X size={20} />
              </button>
            </div>

            {/* Row 1: Company + Position */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  Company / Organisation <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Building2 size={14} style={{
                    position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                    color: "#64748b", pointerEvents: "none"
                  }} />
                  <input
                    name="company" value={formData.company} onChange={handleInputChange}
                    required className="input-field"
                    placeholder="e.g. Google, Meta, Startup Inc."
                    style={{ paddingLeft: "36px" }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Position / Role <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Briefcase size={14} style={{
                    position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                    color: "#64748b", pointerEvents: "none"
                  }} />
                  <input
                    name="position" value={formData.position} onChange={handleInputChange}
                    required className="input-field"
                    placeholder="e.g. Senior Software Engineer"
                    style={{ paddingLeft: "36px" }}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Location + Start Date + End Date */}
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Location</label>
                <div style={{ position: "relative" }}>
                  <MapPin size={14} style={{
                    position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                    color: "#64748b", pointerEvents: "none"
                  }} />
                  <input
                    name="location" value={formData.location} onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. Remote / Colombo, LK"
                    style={{ paddingLeft: "36px" }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Start Date <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Calendar size={14} style={{
                    position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                    color: "#64748b", pointerEvents: "none"
                  }} />
                  <input
                    name="startDate" type="date" value={formData.startDate}
                    onChange={handleInputChange} required className="input-field"
                    style={{ paddingLeft: "36px" }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: formData.current ? "#4b5563" : "#94a3b8" }}>End Date</label>
                <div style={{ position: "relative" }}>
                  <Calendar size={14} style={{
                    position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                    color: formData.current ? "#374151" : "#64748b", pointerEvents: "none"
                  }} />
                  <input
                    name="endDate" type="date" value={formData.endDate}
                    onChange={handleInputChange} disabled={formData.current}
                    className="input-field"
                    style={{ paddingLeft: "36px", opacity: formData.current ? 0.4 : 1 }}
                  />
                </div>
              </div>
            </div>

            {/* Currently working checkbox */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "-8px" }}>
              <input
                type="checkbox" name="current" id="exp_current"
                checked={formData.current} onChange={handleInputChange}
                style={{ width: "16px", height: "16px", accentColor: "#3b82f6", cursor: "pointer" }}
              />
              <label htmlFor="exp_current" style={{ fontSize: "0.9rem", color: "#94a3b8", cursor: "pointer", userSelect: "none" }}>
                I currently work here
              </label>
              {formData.current && (
                <span style={{
                  fontSize: "0.7rem", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
                  color: "#3b82f6", padding: "2px 8px", borderRadius: "20px", marginLeft: "4px"
                }}>Present</span>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Job Description / Key Responsibilities</label>
              <textarea
                name="description" value={formData.description} onChange={handleInputChange}
                className="input-field"
                placeholder="Describe key contributions, technologies used, achievements..."
                style={{ minHeight: "110px", resize: "vertical", lineHeight: "1.6" }}
              />
            </div>

            {/* Form Actions */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingTop: "4px" }}>
              <button
                type="submit" disabled={actionLoading} className="btn-primary"
                style={{
                  background: "#fff", color: "#000", fontWeight: 700,
                  padding: "10px 22px", borderRadius: "8px",
                  display: "flex", alignItems: "center", gap: "8px",
                  opacity: actionLoading ? 0.7 : 1
                }}
              >
                <Save size={16} />
                <span>{actionLoading ? "Saving..." : editId ? "Update Record" : "Save Record"}</span>
              </button>
              <button
                type="button" onClick={resetForm}
                className="btn-secondary"
                style={{ padding: "10px 20px", borderRadius: "8px" }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ── Experience List ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#94a3b8" }}>
            Experience History
            <span style={{
              marginLeft: "10px", fontSize: "0.75rem",
              background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
              color: "#3b82f6", padding: "2px 8px", borderRadius: "20px"
            }}>{list.length} record{list.length !== 1 ? "s" : ""}</span>
          </h2>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px" }}>
            <div style={{
              width: "32px", height: "32px",
              border: "3px solid rgba(255,255,255,0.08)",
              borderTop: "3px solid #3b82f6",
              borderRadius: "50%", animation: "spin 0.8s linear infinite"
            }} />
          </div>
        ) : list.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px", color: "#64748b",
            border: "1px dashed #1f2937", borderRadius: "16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "14px"
          }}>
            <Briefcase size={40} style={{ color: "#1f2937" }} />
            <div>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "#374151" }}>No experience records yet</p>
              <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>Click "Add Experience" to create your first entry.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {list.map((item, index) => (
              <div
                key={item._id}
                style={{
                  background: "#080b12", border: "1px solid #1f2937",
                  borderRadius: "14px", overflow: "hidden",
                  transition: "border-color 0.2s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#374151"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1f2937"}
              >
                {/* Card Header */}
                <div style={{
                  padding: "18px 24px",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  {/* Left: index dot + info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <Briefcase size={15} style={{ color: "#3b82f6" }} />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{item.position}</h3>
                        {item.current && (
                          <span style={{
                            fontSize: "0.65rem", background: "rgba(16,185,129,0.1)",
                            border: "1px solid rgba(16,185,129,0.25)", color: "#10b981",
                            padding: "2px 8px", borderRadius: "20px", fontWeight: 600
                          }}>Current</span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.82rem", color: "#3b82f6", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                          <Building2 size={12} /> {item.company}
                        </span>
                        {item.location && (
                          <span style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                            <MapPin size={11} /> {item.location}
                          </span>
                        )}
                        <span style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Calendar size={11} />
                          {formatDisplayDate(item.startDate)} — {item.current ? "Present" : formatDisplayDate(item.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    {item.description && (
                      <button
                        onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                        style={{
                          background: "transparent", border: "none", color: "#64748b",
                          cursor: "pointer", padding: "6px", borderRadius: "6px",
                          display: "flex", alignItems: "center", transition: "color 0.2s"
                        }}
                        title="Toggle description"
                        onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
                        onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
                      >
                        {expandedId === item._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
                        color: "#64748b", cursor: "pointer", padding: "7px 10px",
                        borderRadius: "8px", display: "flex", alignItems: "center", gap: "5px",
                        fontSize: "0.8rem", transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.15)"; e.currentTarget.style.color = "#3b82f6"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.06)"; e.currentTarget.style.color = "#64748b"; }}
                    >
                      <Edit3 size={14} /> <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{
                        background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
                        color: "#64748b", cursor: "pointer", padding: "7px 10px",
                        borderRadius: "8px", display: "flex", alignItems: "center", gap: "5px",
                        fontSize: "0.8rem", transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#ef4444"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "#64748b"; }}
                    >
                      <Trash2 size={14} /> <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Expandable Description */}
                {expandedId === item._id && item.description && (
                  <div style={{
                    padding: "0 24px 18px 76px",
                    borderTop: "1px solid #0f172a"
                  }}>
                    <p style={{
                      fontSize: "0.875rem", color: "#94a3b8",
                      lineHeight: "1.7", paddingTop: "14px",
                      whiteSpace: "pre-wrap"
                    }}>
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 0.82rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.03em; }
        .input-field {
          background: #0f172a; border: 1px solid #1f2937; color: #f8fafc;
          border-radius: 8px; padding: 10px 14px; font-size: 0.9rem;
          width: 100%; box-sizing: border-box; outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #3b82f6; }
        .input-field:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 8px; border: none;
          cursor: pointer; font-size: 0.9rem; font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; transition: opacity 0.2s;
        }
        .btn-primary:hover { opacity: 0.88; }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 8px;
          border: 1px solid #1f2937; background: transparent;
          color: #94a3b8; cursor: pointer; font-size: 0.875rem;
          transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: #374151; color: #fff; }
      `}</style>
    </div>
  );
}

export default ManageExperience;
