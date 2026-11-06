import { Code2, PanelsTopLeft, BrainCircuit, Wrench } from "lucide-react";
const groups = [
  {
    name: "Languages",
    icon: Code2,
    keys: ["java", "python", "javascript", "c", "c++", "typescript"],
  },
  {
    name: "Web development",
    icon: PanelsTopLeft,
    keys: [
      "html",
      "css",
      "react",
      "node.js",
      "nodejs",
      "express.js",
      "express",
    ],
  },
  {
    name: "Data & AI",
    icon: BrainCircuit,
    keys: [
      "sql",
      "postgresql",
      "mongodb",
      "numpy",
      "pandas",
      "machine learning",
      "dsa",
      "redis",
    ],
  },
  { name: "Tools & more", icon: Wrench, keys: [] },
];
export default function Skills({
  skills = [],
  softwareApplications = [],
  copy = {},
}) {
  const buckets = groups.map((g) => ({ ...g, items: [] }));
  for (const skill of skills) {
    const key = String(skill.title || "")
      .toLowerCase()
      .trim();
    let index = groups.findIndex((g) => g.keys.includes(key));
    if (index < 0) index = 3;
    buckets[index].items.push(skill);
  }
  return (
    <section id="skills" className="studio-section skills-section">
      <div className="studio-container">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">03 / My toolkit</p>
            <h2>
              {copy.skillsTitle}
              <br />
              <em>{copy.skillsAccent}</em>
            </h2>
          </div>
          <p>{copy.skillsIntro}</p>
        </div>
        <div className="skill-group-grid">
          {buckets
            .filter((g) => g.items.length)
            .map(({ name, icon: Icon, items }) => (
              <div className="skill-group" key={name}>
                <Icon size={22} />
                <h3>{name}</h3>
                <div>
                  {items.map((s) => (
                    <span key={s._id || s.id || s.title}>{s.title}</span>
                  ))}
                </div>
              </div>
            ))}
        </div>
        {softwareApplications.length > 0 && (
          <div className="daily-tools">
            <p>In my everyday workflow</p>
            <div>
              {softwareApplications.map((app) => (
                <span key={app._id || app.id || app.name}>
                  {app.svg?.url && (
                    <img src={app.svg.url} alt="" loading="lazy" />
                  )}
                  {app.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
