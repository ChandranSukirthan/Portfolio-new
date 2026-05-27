import React, { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { Plus, Trash2, Edit3, Save, X } from "lucide-react";

function ManageSkills() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    skillName: "",
    category: "PROGRAMMING_LANGUAGES",
    level: "Intermediate",
    icon: "",
    highlight: false
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const categories = [
    { label: "Programming Languages", value: "PROGRAMMING_LANGUAGES" },
    { label: "UI/UX Design", value: "DESIGN" },
    { label: "Full Stack Development", value: "FULLSTACK" },
    { label: "Tools & Platforms", value: "TOOLS_PLATFORM" },
    { label: "Database Systems", value: "DATABASE" },
    { label: "DevOps & Cloud", value: "DEVOPS" },
    { label: "Mobile Development", value: "MOBILE" },
    { label: "Machine Learning", value: "MACHINE_LEARNING" },
    { label: "Generative AI", value: "Generative AI" },
    { label: "Core Competencies", value: "CORE_COMPETENCIES" },
    { label: "Other Tech", value: "OTHER" }
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await API.get("/skills");
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load skills list.");
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

    if (!formData.skillName || !formData.category) {
      setError("Please fill out all required fields.");
      setActionLoading(false);
      return;
    }

    try {
      if (editId) {
        const res = await API.put(`/skills/${editId}`, formData);
        if (res.data.success) {
          setSuccess("Skill updated successfully!");
          fetchSkills();
          resetForm();
        }
      } else {
        const res = await API.post("/skills", formData);
        if (res.data.success) {
          setSuccess("Skill added successfully!");
          fetchSkills();
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save skill.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      skillName: item.skillName || "",
      category: item.category || "PROGRAMMING_LANGUAGES",
      level: item.level || "Intermediate",
      icon: item.icon || "",
      highlight: item.highlight || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    setSuccess("");
    setError("");
    try {
      const res = await API.delete(`/skills/${id}`);
      if (res.data.success) {
        setSuccess("Skill deleted successfully.");
        fetchSkills();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete skill.");
    }
  };

  const resetForm = () => {
    setFormData({
      skillName: "",
      category: "PROGRAMMING_LANGUAGES",
      level: "Intermediate",
      icon: "",
      highlight: false
    });
    setEditId(null);
    setShowForm(false);
  };

  const getCategoryLabel = (catVal) => {
    const matched = categories.find(c => c.value === catVal);
    return matched ? matched.label : catVal;
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
              Manage <span style={{ color: "#3b82f6" }}>Skills</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
              Insert, update, or remove technical skills and categorize them accordingly.
            </p>
          </div>

          {!showForm && (
            <button 
              onClick={() => setShowForm(true)} 
              className="btn-primary" 
              style={{ background: "#fff", color: "#000", fontWeight: 600, padding: "8px 16px", borderRadius: "6px" }}
            >
              <Plus size={16} />
              <span>Add Skill</span>
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
                {editId ? "Edit Skill Record" : "Add New Skill Record"}
              </h3>
              <button type="button" onClick={resetForm} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label">Skill Name</label>
                <input name="skillName" value={formData.skillName} onChange={handleInputChange} required className="input-field" placeholder="e.g. JavaScript" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="input-field" style={{ background: "#0f172a" }}>
                  {categories.map((c, idx) => (
                    <option key={idx} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label">Proficiency Level</label>
                <input name="level" value={formData.level} onChange={handleInputChange} className="input-field" placeholder="e.g. Expert / Intermediate" />
              </div>
              <div className="form-group">
                <label className="form-label">Icon Markup / SVG (Optional)</label>
                <input name="icon" value={formData.icon} onChange={handleInputChange} className="input-field" placeholder='e.g. <i class="devicon-js-plain"></i>' />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="checkbox" name="highlight" id="highlight" checked={formData.highlight} onChange={handleInputChange} style={{ width: "16px", height: "16px" }} />
              <label htmlFor="highlight" style={{ fontSize: "0.9rem", color: "#94a3b8", cursor: "pointer" }}>Highlight / Focus Skill</label>
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

        {/* Skills Listing */}
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
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                    {item.icon && <span dangerouslySetInnerHTML={{ __html: item.icon }} />}
                    <span>{item.skillName}</span>
                    {item.highlight && (
                      <span style={{ fontSize: "0.65rem", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", padding: "2px 6px", borderRadius: "8px" }}>Highlighted</span>
                    )}
                  </h4>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{getCategoryLabel(item.category)} • {item.level}</span>
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
                No skills records found. Add one above.
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

export default ManageSkills;
