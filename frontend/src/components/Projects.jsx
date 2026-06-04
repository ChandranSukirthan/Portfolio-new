import React from "react";
import SectionBadge from "./SectionBadge";
import { ExternalLink } from "lucide-react";
import { getBackendBase } from "../api/api";

// Zero-dependency SVG components to handle Lucide brand icon omission
const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

function Projects({ projects }) {
  // Sort projects: featured first, then by date descending
  const sortedProjects = projects ? [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  }) : [];

  const backendBase = getBackendBase();

  return (
    <section 
      id="projects" 
      style={{
        padding: "100px 5%",
        background: "#000000",
        position: "relative",
        borderTop: "1px solid #1f2937"
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <SectionBadge text="My Work" />
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>Featured Projects</h2>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginTop: "10px", maxWidth: "600px", margin: "10px auto 0" }}>
            Explore my latest projects showcasing modern web technologies and creative solutions
          </p>
        </div>

        {/* Project Card Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: "30px" }}>
          {sortedProjects.map((project) => {
            const projectImage = project.projectImage
              ? (project.projectImage.startsWith("http") ? project.projectImage : `${backendBase}${project.projectImage}`)
              : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop";

            return (
              <div 
                key={project._id} 
                className="glass-panel" 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  background: "#080b12", 
                  border: "1px solid #1f2937", 
                  borderRadius: "16px",
                  overflow: "hidden",
                  height: "100%"
                }}
              >
                {/* Image Wrap */}
                <div style={{ width: "100%", height: "200px", position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                  <img 
                    src={projectImage} 
                    alt={project.projectTitle} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                  {project.featured && (
                    <span style={{ 
                      position: "absolute", 
                      top: "12px", 
                      right: "12px", 
                      padding: "2px 10px", 
                      background: "#3b82f6", 
                      color: "#fff", 
                      borderRadius: "10px", 
                      fontSize: "0.7rem", 
                      fontWeight: 700,
                      textTransform: "uppercase" 
                    }}>
                      Featured
                    </span>
                  )}
                </div>

                {/* Content Block */}
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    {project.category && (
                      <span style={{ fontSize: "0.75rem", padding: "2px 8px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", color: "#3b82f6", borderRadius: "10px", fontWeight: 600 }}>
                        {project.category}
                      </span>
                    )}
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginTop: "12px" }}>
                      {project.projectTitle}
                    </h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "10px", lineHeight: 1.5 }}>
                      {project.description}
                    </p>
                  </div>

                  {/* Footer tools */}
                  <div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "16px 0" }}>
                      {project.technologies && project.technologies.map((tech, idx) => (
                        <span key={idx} style={{ fontSize: "0.7rem", padding: "2px 8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", color: "#cbd5e1" }}>
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
                      {project.githubLink && (
                        <a 
                          href={project.githubLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn-secondary" 
                          style={{ flex: 1, justifyContent: "center", padding: "8px 12px", fontSize: "0.85rem", borderRadius: "6px" }}
                        >
                          <GithubIcon style={{ width: "14px", height: "14px" }} />
                          <span>Code</span>
                        </a>
                      )}
                      {project.liveDemoLink && (
                        <a 
                          href={project.liveDemoLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn-primary" 
                          style={{ 
                            flex: 1, 
                            justifyContent: "center", 
                            padding: "8px 12px", 
                            fontSize: "0.85rem", 
                            borderRadius: "6px",
                            background: "#ffffff",
                            color: "#000000" 
                          }}
                        >
                          <ExternalLink size={14} />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {(!projects || projects.length === 0) && (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            No projects found. Add your portfolio works from the admin center.
          </div>
        )}

      </div>
    </section>
  );
}

export default Projects;
