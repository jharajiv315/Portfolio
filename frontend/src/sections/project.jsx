import { useRef, useState } from "react";
import { ArrowUpRight, Github, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Projects({
  projects = [],
  user,
  loading,
  copy = {},
  previewToken,
}) {
  const [selected, setSelected] = useState(0);
  const [drag, setDrag] = useState(0);
  const gesture = useRef(null);
  const suppressClick = useRef(false);
  const active = projects.length ? selected % projects.length : 0;
  const move = (delta) => {
    if (projects.length > 1) setSelected((active + delta + projects.length) % projects.length);
    setDrag(0);
  };
  const pointerDown = (event) => {
    if (projects.length < 2 || !event.isPrimary || event.button !== 0) return;
    suppressClick.current = false;
    gesture.current = { x: event.clientX, y: event.clientY, horizontal: false, id: event.pointerId };
  };
  const pointerMove = (event) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (!start.horizontal) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { gesture.current = null; return; }
      if (Math.abs(dx) < 10) return;
      start.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    suppressClick.current = true;
    setDrag(Math.max(-100, Math.min(100, dx * 0.45)));
  };
  const pointerEnd = (event) => {
    const start = gesture.current;
    gesture.current = null;
    if (start?.horizontal && event.type !== 'pointercancel') {
      const dx = event.clientX - start.x;
      if (Math.abs(dx) >= 50) move(dx < 0 ? 1 : -1);
    }
    setDrag(0);
  };
  return (
    <section id="projects" className="studio-section project-section">
      <div className="studio-container">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">01 / Selected work</p>
            <h2>
              {copy.projectsTitle} <em>{copy.projectsAccent}</em>
            </h2>
          </div>
          <p>{copy.projectsIntro}</p>
        </div>
        <div className="project-deck" role="region" aria-roledescription="carousel" aria-label="Selected projects"
          tabIndex={projects.length > 1 ? 0 : undefined}
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return;
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
          }}
          onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onLostPointerCapture={() => { gesture.current = null; setDrag(0); }}
          onDragStart={event => event.preventDefault()}
          onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>
          <div className="project-deck-cards">
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
                const rank = (index - active + projects.length) % projects.length;
                const isActive = rank === 0;
                const detailsURL = `/project/${id}${previewToken ? `#preview=${previewToken}` : ""}`;
                const tech = (
                  Array.isArray(project.technologies)
                    ? project.technologies
                    : String(project.technologies || "").split(",")
                )
                  .map((t) => t.trim())
                  .filter(Boolean);
                const live = /^https?:\/\//.test(project.projectLink || "");
                return (
                  <article className={`studio-project-card project-featured deck-card ${isActive ? 'deck-active' : 'deck-behind'} ${isActive && drag ? 'deck-dragging' : ''}`} key={id}
                    role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${projects.length}: ${project.title}`}
                    aria-hidden={!isActive} inert={isActive ? undefined : ''}
                    style={{ '--deck-rank': Math.min(rank, 2), '--deck-drag': `${isActive ? drag : 0}px`, zIndex: projects.length - rank, visibility: rank > 2 ? 'hidden' : undefined }}>

                    <Link
                      to={detailsURL}
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
                        <Link to={detailsURL}>
                          {project.title}
                          <ArrowUpRight size={21} />
                        </Link>
                      </h3>
                      <p className="project-summary">{String(project.description || "").split(/(?<=[.!?])\s+/)[0]}</p>
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
                        <Link to={detailsURL}>
                          Case study <ArrowRight size={15} />
                        </Link>
                        <div>
                          {project.gitRepoLink && (
                            <a
                              href={project.gitRepoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${project.title} source code`}
                            >
                              <Github size={16} /> GitHub
                            </a>
                          )}
                          {live && (
                            <a
                              href={project.projectLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${project.title} live demo`}
                            >
                              Live demo <ArrowUpRight size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
        </div>
        </div>
        {projects.length > 1 && (
          <div className="project-deck-controls">
            <p className="deck-hint">Swipe to explore <span aria-hidden="true">↔</span></p>
            <div className="deck-pagination">
              <button type="button" onClick={() => move(-1)} aria-label="Previous project"><ChevronLeft size={19} /></button>
              <span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} <span aria-hidden="true">/</span><span className="sr-only">of</span> {String(projects.length).padStart(2, '0')}<span className="sr-only">: {projects[active]?.title}</span></span>
              <button type="button" onClick={() => move(1)} aria-label="Next project"><ChevronRight size={19} /></button>
            </div>
          </div>
        )}
        {!loading && !projects.length && (
          <p className="studio-empty">
            Projects are being updated. Explore my GitHub in the meantime.
          </p>
        )}
        {user?.githubURL && (
          <a
            className="studio-text-link"
            href={user.githubURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            More experiments on GitHub <ArrowUpRight size={17} />
          </a>
        )}
      </div>
    </section>
  );
}
