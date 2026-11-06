import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { API_URL } from "../config";
export const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;
    setLoading(true);
    setError("");
    axios
      .get(`${API_URL}/api/v1/project/get/${id}`, { timeout: 45000 })
      .then(({ data }) => {
        if (active) setProject(data.project);
      })
      .catch(() => {
        if (active)
          setError(
            "This project couldn’t be loaded. Please return to the portfolio and try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);
  const technologies = Array.isArray(project?.technologies)
    ? project.technologies
    : String(project?.technologies || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
  return (
    <div className="portfolio-studio premium-project-detail">
      <main className="studio-container">
        <Link to="/#projects" className="detail-back">
          <ArrowLeft size={17} />
          Back to selected work
        </Link>
        {loading ? (
          <p role="status" className="detail-loading">
            Loading project…
          </p>
        ) : error || !project ? (
          <p role="alert" className="detail-loading">
            {error || "Project not found."}
          </p>
        ) : (
          <article>
            <div className="detail-heading">
              <div>
                <p className="studio-eyebrow">
                  {project.stack || "Project overview"}
                </p>
                <h1>{project.title}</h1>
              </div>
              <div className="studio-actions">
                {project.gitRepoLink && (
                  <a
                    href={project.gitRepoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="studio-button studio-button-outline"
                  >
                    <Github size={17} />
                    Source code
                  </a>
                )}
                {project.projectLink && (
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="studio-button"
                  >
                    Visit live site
                    <ArrowUpRight size={17} />
                  </a>
                )}
              </div>
            </div>
            {project.projectBanner?.url && (
              <div className="detail-image">
                <img
                  src={project.projectBanner.url}
                  alt={`${project.title} application preview`}
                />
              </div>
            )}
            <div className="detail-content">
              <div>
                <p className="studio-eyebrow">The project</p>
                <h2>
                  From idea
                  <br />
                  <em>to implementation.</em>
                </h2>
              </div>
              <div>
                <p className="detail-description">{project.description}</p>
                <h3>Built with</h3>
                <div className="project-technologies">
                  {technologies.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                {project.deployed && (
                  <p className="detail-status">
                    Project status · {project.deployed}
                  </p>
                )}
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default ProjectView;
