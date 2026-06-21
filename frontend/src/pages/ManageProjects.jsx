import React, { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { Plus, Trash2, Edit3, Save, X, Upload } from "lucide-react";

function ManageProjects() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    technologies: "",
    projectImage: "",
    githubLink: "",
    liveDemoLink: "",
    category: "Web Development",
    featured: false
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get("/projects");
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects list.");
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append("file", file);

    setUploadLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/upload", fileData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        setFormData(prev => ({
          ...prev,
          projectImage: res.data.url
        }));
        setSuccess("Project thumbnail uploaded successfully!");
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
      setError(err.response?.data?.message || err.message || "Image upload failed. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setActionLoading(true);

    if (!formData.projectTitle || !formData.description) {
      setError("Please fill out all required fields.");
      setActionLoading(false);
      return;
    }

    const payload = {
      ...formData,
      technologies: typeof formData.technologies === "string" 
        ? formData.technologies.split(",").map(t => t.trim()).filter(Boolean)
        : formData.technologies
    };

    try {
      if (editId) {
        const res = await API.put(`/projects/${editId}`, payload);
        if (res.data.success) {
          setSuccess("Project updated successfully!");
          fetchProjects();
          resetForm();
        }
      } else {
        const res = await API.post("/projects", payload);
        if (res.data.success) {
          setSuccess("Project added successfully!");
          fetchProjects();
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save project.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      projectTitle: item.projectTitle || "",
      description: item.description || "",
      technologies: Array.isArray(item.technologies) ? item.technologies.join(", ") : "",
      projectImage: item.projectImage || "",
      githubLink: item.githubLink || "",
      liveDemoLink: item.liveDemoLink || "",
      category: item.category || "Web Development",
      featured: item.featured || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setSuccess("");
    setError("");
    try {
      const res = await API.delete(`/projects/${id}`);
      if (res.data.success) {
        setSuccess("Project deleted successfully.");
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete project.");
    }
  };

  const resetForm = () => {
    setFormData({
      projectTitle: "",
      description: "",
      technologies: "",
      projectImage: "",
      githubLink: "",
      liveDemoLink: "",
      category: "Web Development",
      featured: false
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
              Manage <span style={{ color: "#3b82f6" }}>Projects</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
              Insert, update, or remove portfolio items and achievements displayed on the website.
            </p>
          </div>

          {!showForm && (
            <button 
              onClick={() => setShowForm(true)} 
              className="btn-primary" 
              style={{ background: "#fff", color: "#000", fontWeight: 600, padding: "8px 16px", borderRadius: "6px" }}
            >
              <Plus size={16} />
              <span>Add Project</span>
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
                {editId ? "Edit Project Details" : "Add New Project"}
              </h3>
              <button type="button" onClick={resetForm} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input name="projectTitle" value={formData.projectTitle} onChange={handleInputChange} required className="input-field" placeholder="e.g. AI Customer Service" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input name="category" value={formData.category} onChange={handleInputChange} className="input-field" placeholder="e.g. Fullstack, AI, Mobile" />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">GitHub Code Link</label>
                <input name="githubLink" value={formData.githubLink} onChange={handleInputChange} className="input-field" placeholder="https://github.com/..." />
              </div>
              <div className="form-group">
                <label className="form-label">Live Demo Link</label>
                <input name="liveDemoLink" value={formData.liveDemoLink} onChange={handleInputChange} className="input-field" placeholder="https://demo.com" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Technologies (Comma separated)</label>
              <input name="technologies" value={formData.technologies} onChange={handleInputChange} className="input-field" placeholder="React, Node.js, Express, MongoDB" />
            </div>

            <div className="form-grid-2" style={{ alignItems: "center" }}>
              <div className="form-group">
                <label className="form-label">Project Image URL (Alternative)</label>
                <input name="projectImage" value={formData.projectImage} onChange={handleInputChange} className="input-field" placeholder="/uploads/project-image.jpg" />
              </div>
              <div className="form-group">
                <label className="form-label">Upload Image File</label>
                <label className="btn-secondary" style={{ cursor: "pointer", display: "inline-flex", gap: "8px", width: "fit-content", padding: "10px 16px" }}>
                  <Upload size={16} />
                  <span>{uploadLoading ? "Uploading..." : "Choose File"}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Project Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required className="input-field" style={{ minHeight: "100px" }} placeholder="Brief description of project requirements, results, and features..." />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleInputChange} style={{ width: "16px", height: "16px" }} />
              <label htmlFor="featured" style={{ fontSize: "0.9rem", color: "#94a3b8", cursor: "pointer" }}>Feature on Homepage</label>
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

        {/* Projects Listing */}
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
                    <span>{item.projectTitle}</span>
                    {item.featured && (
                      <span style={{ fontSize: "0.65rem", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", padding: "2px 6px", borderRadius: "8px" }}>Featured</span>
                    )}
                  </h4>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.category} • {item.technologies?.slice(0, 4).join(", ")}</span>
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
                No projects found. Add one above.
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

export default ManageProjects;
