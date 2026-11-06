import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  FileText,
} from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import developerMascot from "../assets/developer-mascot.png";

export default function Hero({ user, projectCount = 0, copy = {} }) {
  const name = user?.fullName || "Rajiv Jha";
  const resume = user?.resume?.url;
  const linkedIn = user?.linkedinURL || user?.linkedInURL;
  return (
    <section id="home" className="studio-hero studio-container">
      <div className="hero-copy">
        <p className="studio-eyebrow">
          <span className="status-dot" />
          {copy.heroEyebrow}
        </p>
        <h1>
          {copy.heroLine1}
          <br />
          {copy.heroLine2}
          <br />
          <span className="hero-name">
            {copy.heroNameTemplate?.replace("{name}", name)}
          </span>
        </h1>
        <p className="hero-description">
          {user?.aboutMe ||
            "Full-stack developer and computer science student exploring AI, data, and the systems behind useful software."}
        </p>
        <p className="hero-support">{copy.heroSupport}</p>
        <div className="studio-actions">
          <a href="#projects" className="studio-button">
            {copy.heroPrimaryLabel} <ArrowDown size={17} />
          </a>
          <a
            href={resume || "#contact"}
            target={resume ? "_blank" : undefined}
            rel={resume ? "noopener noreferrer" : undefined}
            className="studio-button studio-button-outline"
          >
            <FileText size={17} />
            {resume ? copy.heroResumeLabel : "Get in touch"}
          </a>
        </div>
        <div className="hero-socials flex-wrap">
          <span>Find me online</span>
          <a
            href={user?.githubURL || "https://github.com/jharajiv315"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Rajiv on GitHub"
          >
            <Github size={19} />
          </a>
          <a
            href={user?.leetcodeURL || "https://leetcode.com/u/Rajiv_Jha/"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Rajiv on LeetCode"
            title="LeetCode"
          >
            <SiLeetcode size={19} />
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
          <span>{copy.portraitLabel}</span>
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
            <strong>{copy.portraitCaption}</strong>
            <span>{copy.portraitSubcaption}</span>
          </div>
          <span className="portrait-mark">RJ.</span>
        </div>
      </div>
      <div className="hero-bottom">
        <span>{copy.heroFooter}</span>
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
