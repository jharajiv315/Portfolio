import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  FileText,
} from "lucide-react";
import developerMascot from "../assets/developer-mascot.png";

export default function Hero({ user, projectCount = 0 }) {
  const name = user?.fullName || "Rajiv Jha";
  const resume = user?.resume?.url;
  const linkedIn = user?.linkedinURL || user?.linkedInURL;
  return (
    <section id="home" className="studio-hero studio-container">
      <div className="hero-copy">
        <p className="studio-eyebrow">
          <span className="status-dot" />
          Computer science · Full-stack · AI/ML
        </p>
        <h1>
          Thoughtful code.
          <br />
          Useful products.
          <br />
          <span className="hero-name">I’m {name}.</span>
        </h1>
        <p className="hero-description">
          {user?.aboutMe ||
            "Full-stack developer and computer science student exploring AI, data, and the systems behind useful software."}
        </p>
        <p className="hero-support">
          From an idea to a working application, I learn by building, testing,
          and improving.
        </p>
        <div className="studio-actions">
          <a href="#projects" className="studio-button">
            Explore my work <ArrowDown size={17} />
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
          <span>Find me online</span>
          <a
            href={user?.githubURL || "https://github.com/jharajiv315"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Rajiv on GitHub"
          >
            <Github size={19} />
          </a>
          {linkedIn && (
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Rajiv on LinkedIn"
            >
              <Linkedin size={19} />
            </a>
          )}
          {user?.email && (
            <a href={`mailto:${user.email}`} aria-label="Email Rajiv">
              <Mail size={19} />
            </a>
          )}
        </div>
      </div>
      <div className="hero-visual">
        <div className="portrait-label">
          <span>THE PERSON BEHIND THE CODE</span>
          <ArrowUpRight size={18} />
        </div>
        <div className="portrait-frame">
          <img
            src={user?.avatar?.url || developerMascot}
            alt={`${name}, software developer`}
            fetchPriority="high"
          />
        </div>
        <div className="portrait-caption">
          <div>
            <strong>Always a work in progress.</strong>
            <span>Curiosity → code → iteration</span>
          </div>
          <span className="portrait-mark">RJ.</span>
        </div>
      </div>
      <div className="hero-bottom">
        <span>Building at the intersection of software & AI.</span>
        <a href="#projects">
          Selected work{" "}
          {projectCount > 0 && (
            <span>({String(projectCount).padStart(2, "0")})</span>
          )}{" "}
          <ArrowDown size={15} />
        </a>
      </div>
    </section>
  );
}
