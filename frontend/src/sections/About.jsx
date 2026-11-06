import { ArrowUpRight, Code2, BrainCircuit, Layers3 } from "lucide-react";
export default function About({ user, copy = {} }) {
  return (
    <section id="about" className="studio-section">
      <div className="studio-container about-layout">
        <div>
          <p className="studio-eyebrow">02 / A little about me</p>
          <h2>
            {copy.aboutTitle}
            <br />
            <em>{copy.aboutAccent}</em>
          </h2>
          <a href="#contact" className="studio-text-link">
            Let’s connect <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="about-story">
          <p className="about-lead">
            {user?.aboutMe ||
              "Full-stack developer and computer science student."}
          </p>
          <p>{copy.aboutP1}</p>
          <p>{copy.aboutP2}</p>
          <div className="about-focus">
            <span>
              <Code2 size={18} />
              Software engineering
            </span>
            <span>
              <BrainCircuit size={18} />
              AI & data
            </span>
            <span>
              <Layers3 size={18} />
              Full-stack development
            </span>
          </div>
          {user?.resume?.url && (
            <a
              href={user.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="studio-text-link"
            >
              Read my résumé <ArrowUpRight size={17} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
