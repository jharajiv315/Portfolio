import { ArrowUpRight } from "lucide-react";
export default function Experience({ timelines = [] }) {
  return (
    <section id="experience" className="studio-section journey-section">
      <div className="studio-container">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">04 / In progress</p>
            <h2>
              Built on curiosity.
              <br />
              <em>Driven by practice.</em>
            </h2>
          </div>
          <p>
            The education, foundations, and next steps shaping my engineering
            journey.
          </p>
        </div>
        <div className="journey-list">
          {timelines.map((entry, index) => (
            <article
              key={entry._id || entry.id || index}
              className="journey-entry"
            >
              <span className="journey-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="journey-date">
                {entry.timeline?.from || entry.from}
                <span>— {entry.timeline?.to || entry.to}</span>
              </div>
              <div className="journey-content">
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
              </div>
              <ArrowUpRight size={20} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
