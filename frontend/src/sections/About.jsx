import { ArrowUpRight, Code2, BrainCircuit, Layers3 } from "lucide-react";
export default function About({ user }) {
  return (
    <section id="about" className="studio-section">
      <div className="studio-container about-layout">
        <div>
          <p className="studio-eyebrow">02 / A little about me</p>
          <h2>
            Curious by nature.
            <br />
            <em>Engineer by practice.</em>
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
          <p>
            I’m studying computer science and building my foundations in
            software engineering and AI/ML. I enjoy turning a complex problem
            into smaller, understandable pieces—and then into something people
            can use.
          </p>
          <p>
            My work brings together full-stack development, data, and
            algorithms. Every project is a chance to make better decisions,
            understand a system more deeply, and improve the details that
            matter.
          </p>
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
