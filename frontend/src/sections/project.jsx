import { ArrowUpRight, Github, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Projects({ projects = [], user, loading }) {
  return (
    <section id="projects" className="studio-section project-section">
      <div className="studio-container">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">01 / Selected work</p>
            <h2>
              Ideas made <em>real.</em>
            </h2>
          </div>
          <p>
            A closer look at the products I’m building, the problems they
            address, and the technology behind them.
          </p>
        </div>
        <div className="studio-project-grid">
          {loading && !projects.length
            ? [1, 2, 3].map((n) => (
                <div
                  className="project-skeleton"
                  key={n}
                  aria-label="Loading project"
                >
                  <div />
                  <span />
                  <span />
                </div>
              ))
            : projects.map((project, index) => {
                const id = project._id || project.id;
                const tech = (
                  Array.isArray(project.technologies)
                    ? project.technologies
                    : String(project.technologies || "").split(",")
                )
                  .map((t) => t.trim())
                  .filter(Boolean);
                const live = /^https?:\/\//.test(project.projectLink || "");
                return (
                  <article className="studio-project-card" key={id}>
                    <Link
                      to={`/project/${id}`}
                      className="project-preview"
                      aria-label={`Explore ${project.title}`}
                    >
                      <div className="preview-chrome">
                        <span className="preview-dots">
                          <i />
                          <i />
                          <i />
                        </span>
                        <span>{project.title}</span>
                        <ArrowUpRight size={14} />
                      </div>
                      <div className="project-image-wrap">
                        {project.projectBanner?.url ? (
                          <img
                            src={project.projectBanner.url}
                            alt={`${project.title} application preview`}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.visibility = "hidden";
                            }}
                          />
                        ) : (
                          <span className="preview-unavailable">
                            {project.title}
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="project-card-copy">
                      <div className="project-meta">
                        <span>{project.stack || "Software project"}</span>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <h3>
                        <Link to={`/project/${id}`}>
                          {project.title}
                          <ArrowUpRight size={21} />
                        </Link>
                      </h3>
                      <p className="project-summary">{project.description}</p>
                      <div className="project-technologies">
                        {tech.slice(0, 5).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                        {tech.length > 5 && (
                          <span title={tech.slice(5).join(", ")}>
                            +{tech.length - 5}
                          </span>
                        )}
                      </div>
                      <div className="project-links">
                        <Link to={`/project/${id}`}>
                          Project details <ArrowRight size={15} />
                        </Link>
                        <div>
                          {project.gitRepoLink && (
                            <a
                              href={project.gitRepoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${project.title} source code`}
                            >
                              <Github size={18} />
                            </a>
                          )}
                          {live && (
                            <a
                              href={project.projectLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${project.title} live demo`}
                            >
                              Live <ArrowUpRight size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
        </div>
        {!loading && !projects.length && (
          <p className="studio-empty">
            Projects are being updated. Explore my GitHub in the meantime.
          </p>
        )}
        <a
          className="studio-text-link"
          href={user?.githubURL || "https://github.com/jharajiv315"}
          target="_blank"
          rel="noopener noreferrer"
        >
          More experiments on GitHub <ArrowUpRight size={17} />
        </a>
      </div>
    </section>
  );
}
