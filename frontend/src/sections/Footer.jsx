import { ArrowUpRight, Github, Linkedin } from "lucide-react";
export default function Footer({ user }) {
  const linkedin = user?.linkedinURL || user?.linkedInURL;
  return (
    <footer className="premium-footer">
      <div className="studio-container">
        <a href="#home" className="footer-signature">
          {user?.fullName || "Rajiv Jha"}
          <span>Ideas into reality.</span>
        </a>
        <div className="footer-links">
          <a
            href={user?.githubURL || "https://github.com/jharajiv315"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={16} />
            GitHub
            <ArrowUpRight size={14} />
          </a>
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin size={16} />
              LinkedIn
              <ArrowUpRight size={14} />
            </a>
          )}
          <a href="#home">Back to top ↑</a>
        </div>
        <p>
          © {new Date().getFullYear()} {user?.fullName || "Rajiv Jha"} · Built
          with intention.
        </p>
      </div>
    </footer>
  );
}
