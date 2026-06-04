import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API, { getBackendBase } from "../api/api";
import Navbar from "../components/Navbar";
import { 
  User, Briefcase, GraduationCap, Code, FileText, Image as ImageIcon, 
  Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Save, LogOut, ArrowLeft, Upload, ExternalLink
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();
  const backendBase = getBackendBase();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // -------------------------------------------------------------
  // Data States
  // -------------------------------------------------------------
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    skills: [],
    profileImage: "",
    cv: ""
  });
  
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certificates, setCertificates] = useState([]);
  
  // Skill Input state
  const [skillInput, setSkillInput] = useState("");

  // Edit / Form States
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    technologies: "",
    githubLink: "",
    liveLink: "",
    category: "",
    image: "",
    startDate: "",
    endDate: ""
  });
  const [projectEditId, setProjectEditId] = useState(null);

  const [eduForm, setEduForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    current: false,
    grade: "",
    description: ""
  });
  const [eduEditId, setEduEditId] = useState(null);

  const [expForm, setExpForm] = useState({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: ""
  });
  const [expEditId, setExpEditId] = useState(null);

  const [certForm, setCertForm] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    image: ""
  });
  const [certEditId, setCertEditId] = useState(null);

  // File Upload states
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [projectImgUploading, setProjectImgUploading] = useState(false);
  const [certImgUploading, setCertImgUploading] = useState(false);

  // -------------------------------------------------------------
  // Effects & Load Data
  // -------------------------------------------------------------
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Load Profile
      const profRes = await API.get("/profile");
      if (profRes.data) {
        setProfile({
          ...profRes.data,
          skills: profRes.data.skills || []
        });
      }
      
      // Load Projects, Education, Experience, Certificates
      const [projRes, eduRes, expRes, certRes] = await Promise.all([
        API.get("/projects"),
        API.get("/education"),
        API.get("/experience"),
        API.get("/certificates")
      ]);

      setProjects(projRes.data || []);
      setEducation(eduRes.data || []);
      setExperience(expRes.data || []);
      setCertificates(certRes.data || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      showToast("Failed to load some dashboard data.", "error");
    }
  };

  // Helper: Format Date for input values (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // -------------------------------------------------------------
  // File Upload Handlers
  // -------------------------------------------------------------
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    if (type === "avatar") setAvatarUploading(true);
    if (type === "cv") setCvUploading(true);
    if (type === "project") setProjectImgUploading(true);
    if (type === "cert") setCertImgUploading(true);

    try {
      const res = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        const fileUrl = res.data.url;
        showToast("File uploaded successfully!");
        
        if (type === "avatar") {
          setProfile(prev => ({ ...prev, profileImage: fileUrl }));
        } else if (type === "cv") {
          setProfile(prev => ({ ...prev, cv: fileUrl }));
        } else if (type === "project") {
          setProjectForm(prev => ({ ...prev, image: fileUrl }));
        } else if (type === "cert") {
          setCertForm(prev => ({ ...prev, image: fileUrl }));
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast(err.response?.data?.message || "File upload failed.", "error");
    } finally {
      if (type === "avatar") setAvatarUploading(false);
      if (type === "cv") setCvUploading(false);
      if (type === "project") setProjectImgUploading(false);
      if (type === "cert") setCertImgUploading(false);
    }
  };

  // -------------------------------------------------------------
  // Profile Management
  // -------------------------------------------------------------
  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/profile", profile);
      if (res.data.success) {
        showToast("Profile details updated!");
        setProfile(res.data.data);
      }
    } catch (err) {
      showToast("Failed to save profile.", "error");
    }
  };

  // -------------------------------------------------------------
  // Skills Management
  // -------------------------------------------------------------
  const addSkill = async () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (profile.skills.includes(trimmed)) {
      setSkillInput("");
      return;
    }

    const updatedSkills = [...profile.skills, trimmed];
    try {
      const res = await API.put("/profile", { ...profile, skills: updatedSkills });
      if (res.data.success) {
        setProfile(prev => ({ ...prev, skills: updatedSkills }));
        setSkillInput("");
        showToast(`Skill "${trimmed}" added!`);
      }
    } catch (err) {
      showToast("Failed to add skill.", "error");
    }
  };

  const deleteSkill = async (skillToDelete) => {
    const updatedSkills = profile.skills.filter(s => s !== skillToDelete);
    try {
      const res = await API.put("/profile", { ...profile, skills: updatedSkills });
      if (res.data.success) {
        setProfile(prev => ({ ...prev, skills: updatedSkills }));
        showToast(`Skill "${skillToDelete}" removed!`);
      }
    } catch (err) {
      showToast("Failed to remove skill.", "error");
    }
  };

  // -------------------------------------------------------------
  // Education CRUD
  // -------------------------------------------------------------
  const handleEduChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEduForm({ ...eduForm, [e.target.name]: val });
  };

  const saveEducation = async (e) => {
    e.preventDefault();
    try {
      if (eduEditId) {
        const res = await API.put(`/education/${eduEditId}`, eduForm);
        if (res.data.success) {
          setEducation(education.map(item => item._id === eduEditId ? res.data.data : item));
          showToast("Education item updated!");
          setEduEditId(null);
        }
      } else {
        const res = await API.post("/education", eduForm);
        if (res.data.success) {
          setEducation([res.data.data, ...education]);
          showToast("Education item added!");
        }
      }
      setEduForm({
        institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", current: false, grade: "", description: ""
      });
    } catch (err) {
      showToast("Failed to save education.", "error");
    }
  };

  const editEducation = (item) => {
    setEduEditId(item._id);
    setEduForm({
      institution: item.institution || "",
      degree: item.degree || "",
      fieldOfStudy: item.fieldOfStudy || "",
      startDate: formatDateForInput(item.startDate),
      endDate: formatDateForInput(item.endDate),
      current: item.current || false,
      grade: item.grade || "",
      description: item.description || ""
    });
  };

  const deleteEducation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this education item?")) return;
    try {
      const res = await API.delete(`/education/${id}`);
      if (res.data.success) {
        setEducation(education.filter(item => item._id !== id));
        showToast("Education item deleted.");
      }
    } catch (err) {
      showToast("Failed to delete item.", "error");
    }
  };

  // -------------------------------------------------------------
  // Experience CRUD
  // -------------------------------------------------------------
  const handleExpChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setExpForm({ ...expForm, [e.target.name]: val });
  };

  const saveExperience = async (e) => {
    e.preventDefault();
    try {
      if (expEditId) {
        const res = await API.put(`/experience/${expEditId}`, expForm);
        if (res.data.success) {
          setExperience(experience.map(item => item._id === expEditId ? res.data.data : item));
          showToast("Work experience updated!");
          setExpEditId(null);
        }
      } else {
        const res = await API.post("/experience", expForm);
        if (res.data.success) {
          setExperience([res.data.data, ...experience]);
          showToast("Work experience added!");
        }
      }
      setExpForm({
        company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: ""
      });
    } catch (err) {
      showToast("Failed to save experience.", "error");
    }
  };

  const editExperience = (item) => {
    setExpEditId(item._id);
    setExpForm({
      company: item.company || "",
      position: item.position || "",
      location: item.location || "",
      startDate: formatDateForInput(item.startDate),
      endDate: formatDateForInput(item.endDate),
      current: item.current || false,
      description: item.description || ""
    });
  };

  const deleteExperience = async (id) => {
    if (!window.confirm("Are you sure you want to delete this work experience?")) return;
    try {
      const res = await API.delete(`/experience/${id}`);
      if (res.data.success) {
        setExperience(experience.filter(item => item._id !== id));
        showToast("Experience item deleted.");
      }
    } catch (err) {
      showToast("Failed to delete item.", "error");
    }
  };

  // -------------------------------------------------------------
  // Projects CRUD
  // -------------------------------------------------------------
  const handleProjectChange = (e) => {
    setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
  };

  const saveProject = async (e) => {
    e.preventDefault();
    try {
      const techArray = typeof projectForm.technologies === "string" 
        ? projectForm.technologies.split(",").map(t => t.trim()).filter(Boolean)
        : projectForm.technologies;

      const pData = {
        ...projectForm,
        technologies: techArray
      };

      if (projectEditId) {
        const res = await API.put(`/projects/${projectEditId}`, pData);
        if (res.data.success) {
          setProjects(projects.map(p => p._id === projectEditId ? res.data.data : p));
          showToast("Project details updated!");
          setProjectEditId(null);
        }
      } else {
        const res = await API.post("/projects", pData);
        if (res.data.success) {
          setProjects([res.data.data, ...projects]);
          showToast("New project added!");
        }
      }
      
      setProjectForm({
        title: "", description: "", technologies: "", githubLink: "", liveLink: "", category: "", image: "", startDate: "", endDate: ""
      });
    } catch (err) {
      showToast("Failed to save project.", "error");
    }
  };

  const editProject = (item) => {
    setProjectEditId(item._id);
    setProjectForm({
      title: item.title || "",
      description: item.description || "",
      technologies: item.technologies?.join(", ") || "",
      githubLink: item.githubLink || "",
      liveLink: item.liveLink || "",
      category: item.category || "",
      image: item.image || "",
      startDate: formatDateForInput(item.startDate),
      endDate: formatDateForInput(item.endDate)
    });
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await API.delete(`/projects/${id}`);
      if (res.data.success) {
        setProjects(projects.filter(p => p._id !== id));
        showToast("Project deleted successfully.");
      }
    } catch (err) {
      showToast("Failed to delete project.", "error");
    }
  };

  // -------------------------------------------------------------
  // Certificates CRUD
  // -------------------------------------------------------------
  const handleCertChange = (e) => {
    setCertForm({ ...certForm, [e.target.name]: e.target.value });
  };

  const saveCertificate = async (e) => {
    e.preventDefault();
    try {
      if (certEditId) {
        const res = await API.put(`/certificates/${certEditId}`, certForm);
        if (res.data.success) {
          setCertificates(certificates.map(c => c._id === certEditId ? res.data.data : c));
          showToast("Certificate updated!");
          setCertEditId(null);
        }
      } else {
        const res = await API.post("/certificates", certForm);
        if (res.data.success) {
          setCertificates([res.data.data, ...certificates]);
          showToast("New certificate added!");
        }
      }
      
      setCertForm({
        name: "", issuer: "", issueDate: "", credentialId: "", credentialUrl: "", image: ""
      });
    } catch (err) {
      showToast("Failed to save certificate.", "error");
    }
  };

  const editCertificate = (item) => {
    setCertEditId(item._id);
    setCertForm({
      name: item.name || "",
      issuer: item.issuer || "",
      issueDate: formatDateForInput(item.issueDate),
      credentialId: item.credentialId || "",
      credentialUrl: item.credentialUrl || "",
      image: item.image || ""
    });
  };

  const deleteCertificate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) return;
    try {
      const res = await API.delete(`/certificates/${id}`);
      if (res.data.success) {
        setCertificates(certificates.filter(c => c._id !== id));
        showToast("Certificate deleted.");
      }
    } catch (err) {
      showToast("Failed to delete certificate.", "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080710", color: "#f8fafc", paddingTop: "80px" }}>
      <Navbar isDashboard={true} />
      
      {/* Toast Alert */}
      {toast.show && (
        <div className="toast-notif glass-panel" style={{
          background: toast.type === "success" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
          borderColor: toast.type === "success" ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
          color: toast.type === "success" ? "#4ade80" : "#f87171"
        }}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "30px 20px",
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: "30px"
      }}>
        {/* Sidebar Nav */}
        <aside className="glass-panel" style={{ height: "fit-content", padding: "10px" }}>
          <div style={{ padding: "20px 15px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "10px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Control Room</h3>
            <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>Admin Panel v1.0</p>
          </div>
          <div className="dash-sidebar">
            <div className={`dash-nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
              <User size={18} /> <span>Manage Profile</span>
            </div>
            <div className={`dash-nav-item ${activeTab === "skills" ? "active" : ""}`} onClick={() => setActiveTab("skills")}>
              <Code size={18} /> <span>Manage Skills</span>
            </div>
            <div className={`dash-nav-item ${activeTab === "experience" ? "active" : ""}`} onClick={() => setActiveTab("experience")}>
              <Briefcase size={18} /> <span>Manage Experience</span>
            </div>
            <div className={`dash-nav-item ${activeTab === "education" ? "active" : ""}`} onClick={() => setActiveTab("education")}>
              <GraduationCap size={18} /> <span>Manage Education</span>
            </div>
            <div className={`dash-nav-item ${activeTab === "projects" ? "active" : ""}`} onClick={() => setActiveTab("projects")}>
              <FileText size={18} /> <span>Manage Projects</span>
            </div>
            <div className={`dash-nav-item ${activeTab === "certificates" ? "active" : ""}`} onClick={() => setActiveTab("certificates")}>
              <ImageIcon size={18} /> <span>Manage Certificates</span>
            </div>
          </div>
        </aside>

        {/* Dashboard Main Panel */}
        <main className="glass-panel" style={{ padding: "40px", minHeight: "650px" }}>
          
          {/* TAB 1: PROFILE MANAGEMENT */}
          {activeTab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Manage Profile Details</h2>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>Modify your public personal details, profile avatar, and CV document.</p>
              </div>

              <div className="glass-panel" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(147, 51, 234, 0.3)", background: "rgba(147, 51, 234, 0.02)" }}>
                <div>
                  <h4 style={{ fontWeight: 600, color: "#fff" }}>Homepage Core Profile Settings</h4>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px" }}>Edit Name, Greeting, Bio text, Email, and social URLs as requested.</p>
                </div>
                <a href="/admin/profile" className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  <span>Open Home Settings</span>
                </a>
              </div>

              <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* Upload Section (Avatar and CV side-by-side) */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ position: "relative" }}>
                      {profile.profileImage ? (
                        <img 
                          src={profile.profileImage.startsWith("http") ? profile.profileImage : `${backendBase}${profile.profileImage}`} 
                          alt="Avatar" 
                          style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #a855f7" }}
                        />
                      ) : (
                        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <User size={30} style={{ color: "#64748b" }} />
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Profile Photo</span>
                      <label className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer", display: "inline-flex", width: "fit-content" }}>
                        <Upload size={14} />
                        <span>{avatarUploading ? "Uploading..." : "Upload Photo"}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "avatar")} style={{ display: "none" }} />
                      </label>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{
                      width: "80px", height: "80px", borderRadius: "12px", background: "rgba(147, 51, 234, 0.05)", 
                      display: "flex", justifyContent: "center", alignItems: "center", border: "1px dashed rgba(147, 51, 234, 0.2)"
                    }}>
                      <FileText size={30} style={{ color: "#c084fc" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Curriculum Vitae (PDF)</span>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <label className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer", display: "inline-flex" }}>
                          <Upload size={14} />
                          <span>{cvUploading ? "Uploading..." : "Upload CV"}</span>
                          <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, "cv")} style={{ display: "none" }} />
                        </label>
                        {profile.cv && (
                          <a href={profile.cv.startsWith("http") ? profile.cv : `${backendBase}${profile.cv}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input name="name" value={profile.name} onChange={handleProfileChange} className="input-field" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Professional Title</label>
                    <input name="title" value={profile.title} onChange={handleProfileChange} className="input-field" placeholder="Full Stack Developer / DevOps Engineer" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">About Me Bio</label>
                  <textarea name="bio" value={profile.bio} onChange={handleProfileChange} className="input-field" style={{ minHeight: "120px", resize: "vertical" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Public Email</label>
                    <input name="email" value={profile.email} onChange={handleProfileChange} className="input-field" type="email" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input name="phone" value={profile.phone} onChange={handleProfileChange} className="input-field" />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">GitHub URL</label>
                    <input name="github" value={profile.github} onChange={handleProfileChange} className="input-field" placeholder="https://github.com/username" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn URL</label>
                    <input name="linkedin" value={profile.linkedin} onChange={handleProfileChange} className="input-field" placeholder="https://linkedin.com/in/username" />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: "fit-content", marginTop: "10px" }}>
                  <Save size={18} />
                  <span>Save Profile Details</span>
                </button>

              </form>
            </div>
          )}

          {/* TAB 2: SKILLS MANAGEMENT */}
          {activeTab === "skills" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Manage Technical Skills</h2>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>Add or remove skills to display as glowing chips on your landing page.</p>
              </div>

              <div className="glass-panel" style={{ padding: "30px", display: "flex", gap: "12px", alignItems: "flex-end" }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Skill Name</label>
                  <input 
                    value={skillInput} 
                    onChange={(e) => setSkillInput(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && addSkill()} 
                    placeholder="e.g. Docker, TypeScript, GraphQL" 
                    className="input-field" 
                  />
                </div>
                <button type="button" onClick={addSkill} className="btn-primary" style={{ padding: "12px 24px" }}>
                  <Plus size={18} />
                  <span>Add Skill</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#94a3b8" }}>Current Skills ({profile.skills.length})</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {profile.skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="glass-panel" 
                      style={{ 
                        padding: "8px 16px", borderRadius: "30px", display: "flex", alignItems: "center", gap: "10px", 
                        border: "1px solid rgba(147, 51, 234, 0.2)", background: "rgba(147, 51, 234, 0.03)"
                      }}
                    >
                      <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{skill}</span>
                      <Trash2 
                        size={14} 
                        style={{ color: "#ef4444", cursor: "pointer", transition: "color 0.2s" }} 
                        onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
                        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                        onClick={() => deleteSkill(skill)}
                      />
                    </div>
                  ))}
                  {profile.skills.length === 0 && (
                    <p style={{ color: "#64748b", fontSize: "0.9rem", fontStyle: "italic" }}>No skills added yet. Add your first skill above!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPERIENCE MANAGEMENT */}
          {activeTab === "experience" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Manage Work Experience</h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>Add, edit, or delete professional work experience.</p>
                </div>
                {expEditId && (
                  <button 
                    onClick={() => {
                      setExpEditId(null);
                      setExpForm({ company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" });
                    }}
                    className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  >
                    <ArrowLeft size={14} /> <span>Cancel Edit</span>
                  </button>
                )}
              </div>

              {/* Form Card */}
              <form onSubmit={saveExperience} className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "10px" }}>
                  {expEditId ? "Modify Experience Item" : "Create Experience Item"}
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input name="company" value={expForm.company} onChange={handleExpChange} className="input-field" placeholder="e.g. Google" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Position / Role</label>
                    <input name="position" value={expForm.position} onChange={handleExpChange} className="input-field" placeholder="e.g. Senior Software Engineer" required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", alignItems: "end" }}>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input name="location" value={expForm.location} onChange={handleExpChange} className="input-field" placeholder="e.g. Remote / New York, NY" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input name="startDate" type="date" value={expForm.startDate} onChange={handleExpChange} className="input-field" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input name="endDate" type="date" value={expForm.endDate} onChange={handleExpChange} className="input-field" disabled={expForm.current} />
                  </div>
                </div>

                <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "10px", marginTop: "-5px" }}>
                  <input type="checkbox" name="current" id="current_exp" checked={expForm.current} onChange={handleExpChange} style={{ width: "16px", height: "16px" }} />
                  <label htmlFor="current_exp" style={{ fontSize: "0.9rem", color: "#94a3b8", cursor: "pointer" }}>Currently work here</label>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description / Responsibilities</label>
                  <textarea name="description" value={expForm.description} onChange={handleExpChange} className="input-field" style={{ minHeight: "100px", resize: "vertical" }} placeholder="List key contributions, stack used..." />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "fit-content" }}>
                  <Save size={18} />
                  <span>{expEditId ? "Update Experience" : "Add Experience"}</span>
                </button>
              </form>

              {/* Items List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#94a3b8" }}>Experience History ({experience.length})</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {experience.map((item) => (
                    <div key={item._id} className="glass-panel" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{item.position} <span style={{ color: "#c084fc", fontWeight: 500 }}>@ {item.company}</span></h4>
                        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>
                          {formatDateForInput(item.startDate)} — {item.current ? "Present" : formatDateForInput(item.endDate)} {item.location && `| ${item.location}`}
                        </p>
                        {item.description && (
                          <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "10px", whiteSpace: "pre-line" }}>{item.description}</p>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => editExperience(item)} className="btn-secondary" style={{ padding: "8px", borderRadius: "6px" }} title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteExperience(item._id)} className="btn-secondary" style={{ padding: "8px", borderRadius: "6px", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.1)" }} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {experience.length === 0 && (
                    <p style={{ color: "#64748b", fontSize: "0.9rem", fontStyle: "italic" }}>No work experience added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATION MANAGEMENT */}
          {activeTab === "education" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Manage Education History</h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>Add, edit, or delete academic records.</p>
                </div>
                {eduEditId && (
                  <button 
                    onClick={() => {
                      setEduEditId(null);
                      setEduForm({ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", current: false, grade: "", description: "" });
                    }}
                    className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  >
                    <ArrowLeft size={14} /> <span>Cancel Edit</span>
                  </button>
                )}
              </div>

              {/* Form Card */}
              <form onSubmit={saveEducation} className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "10px" }}>
                  {eduEditId ? "Modify Education Item" : "Create Education Item"}
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Institution / School</label>
                    <input name="institution" value={eduForm.institution} onChange={handleEduChange} className="input-field" placeholder="e.g. Stanford University" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Degree / Qualification</label>
                    <input name="degree" value={eduForm.degree} onChange={handleEduChange} className="input-field" placeholder="e.g. Bachelor of Science" required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", alignItems: "end" }}>
                  <div className="form-group">
                    <label className="form-label">Field of Study</label>
                    <input name="fieldOfStudy" value={eduForm.fieldOfStudy} onChange={handleEduChange} className="input-field" placeholder="e.g. Computer Science" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input name="startDate" type="date" value={eduForm.startDate} onChange={handleEduChange} className="input-field" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input name="endDate" type="date" value={eduForm.endDate} onChange={handleEduChange} className="input-field" disabled={eduForm.current} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", alignItems: "center" }}>
                  <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "10px", marginBottom: 0 }}>
                    <input type="checkbox" name="current" id="current_edu" checked={eduForm.current} onChange={handleEduChange} style={{ width: "16px", height: "16px" }} />
                    <label htmlFor="current_edu" style={{ fontSize: "0.9rem", color: "#94a3b8", cursor: "pointer" }}>Currently studying here</label>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <input name="grade" value={eduForm.grade} onChange={handleEduChange} className="input-field" placeholder="Grade / GPA (e.g. 3.9 / 4.0)" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Description / Honors</label>
                  <textarea name="description" value={eduForm.description} onChange={handleEduChange} className="input-field" style={{ minHeight: "80px", resize: "vertical" }} placeholder="Extracurriculars, specific electives..." />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "fit-content" }}>
                  <Save size={18} />
                  <span>{eduEditId ? "Update Education" : "Add Education"}</span>
                </button>
              </form>

              {/* Items List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#94a3b8" }}>Education History ({education.length})</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {education.map((item) => (
                    <div key={item._id} className="glass-panel" style={{ padding: "20px", display: "flex", justifySide: "space-between", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{item.degree} in {item.fieldOfStudy}</h4>
                        <p style={{ fontSize: "0.85rem", color: "#c084fc", fontWeight: 500, marginTop: "4px" }}>{item.institution}</p>
                        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>
                          {formatDateForInput(item.startDate)} — {item.current ? "Present" : formatDateForInput(item.endDate)} {item.grade && `| GPA: ${item.grade}`}
                        </p>
                        {item.description && (
                          <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "10px", whiteSpace: "pre-line" }}>{item.description}</p>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => editEducation(item)} className="btn-secondary" style={{ padding: "8px", borderRadius: "6px" }} title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteEducation(item._id)} className="btn-secondary" style={{ padding: "8px", borderRadius: "6px", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.1)" }} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {education.length === 0 && (
                    <p style={{ color: "#64748b", fontSize: "0.9rem", fontStyle: "italic" }}>No educational history added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS MANAGEMENT */}
          {activeTab === "projects" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <div style={{ display: "flex", justifySide: "space-between", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Manage Projects</h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>Add, edit, or delete projects and upload screenshots.</p>
                </div>
                {projectEditId && (
                  <button 
                    onClick={() => {
                      setProjectEditId(null);
                      setProjectForm({
                        title: "", description: "", technologies: "", githubLink: "", liveLink: "", category: "", image: "", startDate: "", endDate: ""
                      });
                    }}
                    className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  >
                    <ArrowLeft size={14} /> <span>Cancel Edit</span>
                  </button>
                )}
              </div>

              {/* Form Card */}
              <form onSubmit={saveProject} className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "10px" }}>
                  {projectEditId ? "Modify Project Details" : "Create New Project"}
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Project Title</label>
                    <input name="title" value={projectForm.title} onChange={handleProjectChange} className="input-field" placeholder="e.g. Chat Application" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Category</label>
                    <input name="category" value={projectForm.category} onChange={handleProjectChange} className="input-field" placeholder="e.g. Fullstack / Frontend / DevOps" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Technologies Used (comma separated)</label>
                  <input name="technologies" value={projectForm.technologies} onChange={handleProjectChange} className="input-field" placeholder="React, Node.js, Socket.io, TailwindCSS" />
                </div>

                {/* Project Image Upload */}
                <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "120px", height: "70px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                    {projectForm.image ? (
                      <img src={projectForm.image.startsWith("http") ? projectForm.image : `${backendBase}${projectForm.image}`} alt="Project thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <ImageIcon size={24} style={{ color: "#64748b" }} />
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Project Screenshot</span>
                    <label className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer", display: "inline-flex", width: "fit-content" }}>
                      <Upload size={14} />
                      <span>{projectImgUploading ? "Uploading..." : "Upload Screenshot"}</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "project")} style={{ display: "none" }} />
                    </label>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">GitHub Repository Link</label>
                    <input name="githubLink" value={projectForm.githubLink} onChange={handleProjectChange} className="input-field" placeholder="https://github.com/..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Live Demo Link</label>
                    <input name="liveLink" value={projectForm.liveLink} onChange={handleProjectChange} className="input-field" placeholder="https://..." />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input name="startDate" type="date" value={projectForm.startDate} onChange={handleProjectChange} className="input-field" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input name="endDate" type="date" value={projectForm.endDate} onChange={handleProjectChange} className="input-field" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Project Description</label>
                  <textarea name="description" value={projectForm.description} onChange={handleProjectChange} className="input-field" style={{ minHeight: "100px", resize: "vertical" }} placeholder="Describe the application features, challenges solved, architecture..." required />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "fit-content" }}>
                  <Save size={18} />
                  <span>{projectEditId ? "Update Project" : "Add Project"}</span>
                </button>
              </form>

              {/* Items List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#94a3b8" }}>Project Inventory ({projects.length})</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {projects.map((item) => (
                    <div key={item._id} className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px", justifyContent: "space-between" }}>
                      <div>
                        {item.image && (
                          <div style={{ width: "100%", height: "140px", borderRadius: "8px", overflow: "hidden", marginBottom: "12px" }}>
                            <img src={item.image.startsWith("http") ? item.image : `${backendBase}${item.image}`} alt="Project preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )}
                        <span style={{ 
                          padding: "2px 8px", background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)", 
                          color: "#22d3ee", borderRadius: "10px", fontSize: "0.75rem", fontWeight: 600 
                        }}>
                          {item.category || "General"}
                        </span>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "8px" }}>{item.title}</h4>
                        <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
                          {item.startDate ? formatDateForInput(item.startDate) : "N/A"} — {item.endDate ? formatDateForInput(item.endDate) : "Present"}
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginTop: "8px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {item.description}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                          {item.technologies?.map((tech, idx) => (
                            <span key={idx} style={{ fontSize: "0.75rem", padding: "2px 6px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "#cbd5e1" }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                        <button onClick={() => editProject(item)} className="btn-secondary" style={{ flex: 1, padding: "8px", fontSize: "0.8rem", display: "flex", justifyContent: "center" }}>
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        <button onClick={() => deleteProject(item._id)} className="btn-secondary" style={{ flex: 1, padding: "8px", fontSize: "0.8rem", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.1)", display: "flex", justifyContent: "center" }}>
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p style={{ color: "#64748b", fontSize: "0.9rem", fontStyle: "italic", gridColumn: "1 / -1" }}>No projects added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CERTIFICATES MANAGEMENT */}
          {activeTab === "certificates" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <div style={{ display: "flex", justifySide: "space-between", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Manage Certificates</h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>Add, edit, or delete credentials and badges.</p>
                </div>
                {certEditId && (
                  <button 
                    onClick={() => {
                      setCertEditId(null);
                      setCertForm({ name: "", issuer: "", issueDate: "", credentialId: "", credentialUrl: "", image: "" });
                    }}
                    className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  >
                    <ArrowLeft size={14} /> <span>Cancel Edit</span>
                  </button>
                )}
              </div>

              {/* Form Card */}
              <form onSubmit={saveCertificate} className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "10px" }}>
                  {certEditId ? "Modify Certificate" : "Register Certificate"}
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Certificate / Course Name</label>
                    <input name="name" value={certForm.name} onChange={handleCertChange} className="input-field" placeholder="e.g. AWS Certified Solutions Architect" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issuing Organization</label>
                    <input name="issuer" value={certForm.issuer} onChange={handleCertChange} className="input-field" placeholder="e.g. Amazon Web Services (AWS)" required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Date of Issue</label>
                    <input name="issueDate" type="date" value={certForm.issueDate} onChange={handleCertChange} className="input-field" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Credential ID (Optional)</label>
                    <input name="credentialId" value={certForm.credentialId} onChange={handleCertChange} className="input-field" placeholder="e.g. AWS-ASA-1234" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Verification URL (Optional)</label>
                  <input name="credentialUrl" value={certForm.credentialUrl} onChange={handleCertChange} className="input-field" placeholder="https://..." />
                </div>

                {/* Certificate Badge Upload */}
                <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                    {certForm.image ? (
                      <img src={certForm.image.startsWith("http") ? certForm.image : `${backendBase}${certForm.image}`} alt="Certificate logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      <ImageIcon size={24} style={{ color: "#64748b" }} />
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Certificate Logo / Badge</span>
                    <label className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer", display: "inline-flex", width: "fit-content" }}>
                      <Upload size={14} />
                      <span>{certImgUploading ? "Uploading..." : "Upload Logo"}</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "cert")} style={{ display: "none" }} />
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: "fit-content" }}>
                  <Save size={18} />
                  <span>{certEditId ? "Update Certificate" : "Add Certificate"}</span>
                </button>
              </form>

              {/* Items List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#94a3b8" }}>Certificates & Badges ({certificates.length})</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {certificates.map((item) => (
                    <div key={item._id} className="glass-panel" style={{ padding: "20px", display: "flex", gap: "15px", alignItems: "center" }}>
                      <div style={{ width: "64px", height: "64px", flexShrink: 0, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                        {item.image ? (
                          <img src={item.image.startsWith("http") ? item.image : `${backendBase}${item.image}`} alt={item.issuer} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        ) : (
                          <ImageIcon size={20} style={{ color: "#64748b" }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h4>
                        <p style={{ fontSize: "0.85rem", color: "#c084fc", fontWeight: 500, marginTop: "2px" }}>{item.issuer}</p>
                        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>
                          Issued: {formatDateForInput(item.issueDate)} {item.credentialId && `| ID: ${item.credentialId}`}
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <button onClick={() => editCertificate(item)} className="btn-secondary" style={{ padding: "6px", borderRadius: "6px" }} title="Edit">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => deleteCertificate(item._id)} className="btn-secondary" style={{ padding: "6px", borderRadius: "6px", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.05)" }} title="Delete">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {certificates.length === 0 && (
                    <p style={{ color: "#64748b", fontSize: "0.9rem", fontStyle: "italic", gridColumn: "1 / -1" }}>No certificates registered yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
