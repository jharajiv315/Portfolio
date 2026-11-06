import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  FileText,
  Code2,
  Sparkles,
} from "lucide-react";
export default function Hero({ user, projectCount = 0 }) {
  const name = user?.fullName || "Rajiv Jha",
    resume = user?.resume?.url,
    linkedIn = user?.linkedinURL || user?.linkedInURL;
  return (
    <section id="home" className="studio-hero studio-container premium-hero">
      <div className="hero-copy">
        <p className="studio-eyebrow">
          <span className="status-dot" />
          {name} / Developer & builder
        </p>
        <h1>
          Software.
          <br />
          Intelligence.
          <br />
          <span className="hero-name">
            Real-world impact<span className="hero-period">.</span>
          </span>
        </h1>
        <p className="hero-description">
          {user?.aboutMe ||
            "Full-stack developer exploring AI, data, and the systems behind useful software."}
        </p>
        <p className="hero-support">
          I turn ideas into working products—and keep asking how they could work
          better.
        </p>
        <div className="studio-actions">
          <a href="#projects" className="studio-button">
            Discover my work <ArrowUpRight size={18} />
          </a>
          <a
            href={resume || "#contact"}
            target={resume ? "_blank" : undefined}
            rel={resume ? "noopener noreferrer" : undefined}
            className="studio-button studio-button-outline"
          >
            <FileText size={17} />
            {resume ? "View résumé" : "Get in touch"}
          </a>
        </div>
        <div className="hero-socials">
          <span>Find me on</span>
          <a
            href={user?.githubURL || "https://github.com/jharajiv315"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Rajiv on GitHub"
          >
            <Github size={18} />
          </a>
          {linkedIn && (
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Rajiv on LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          )}
          {user?.email && (
            <a href={`mailto:${user.email}`} aria-label="Email Rajiv">
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
      <div className="hero-visual premium-visual">
        <div className="portrait-orbit" aria-hidden="true" />
        <div className="premium-portrait-card">
          <div className="portrait-card-top">
            <span className="portrait-code">&lt;RJ /&gt;</span>
            <span>
              ALWAYS BUILDING <i />
            </span>
          </div>
          <div className="portrait-frame">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={`${name}, software developer`}
                fetchPriority="high"
              />
            ) : (
              <div className="portrait-placeholder" aria-hidden="true">
                RJ.
              </div>
            )}
            <div className="portrait-image-caption">
              <span>Behind the build</span>
              <strong>{name}</strong>
            </div>
          </div>
          <div className="portrait-caption">
            <span>Curiosity is the starting point.</span>
            <ArrowUpRight size={19} />
          </div>
        </div>
        <div className="hero-focus-badge">
          <Sparkles size={19} />
          <div>
            <span>EXPLORING</span>
            <strong>AI × software engineering</strong>
          </div>
        </div>
        <div className="hero-code-tag">
          <Code2 size={16} />
          <span>Think. Build. Refine.</span>
        </div>
      </div>
      <div className="hero-bottom">
        <span>
          <i />
          Engineering ideas into experiences.
        </span>
        <a href="#projects">
          Selected work{" "}
          {projectCount > 0 && (
            <span>/{String(projectCount).padStart(2, "0")}</span>
          )}
          <ArrowDown size={17} />
        </a>
      </div>
    </section>
  );
}
