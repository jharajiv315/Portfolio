import { useEffect, useRef } from "react";
import {
  FaJava,
  FaPython,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaFigma,
} from "react-icons/fa";
import {
  SiCplusplus,
  SiMongodb,
  SiPostgresql,
  SiNumpy,
  SiPandas,
  SiExpress,
} from "react-icons/si";
import { Cpu } from "lucide-react";

// Helper icon resolver for backend skill titles
const iconMap = {
  java: <FaJava />,
  python: <FaPython />,
  javascript: <FaJs />,
  "c++": <SiCplusplus />,
  c: <SiCplusplus />,
  html: <FaHtml5 />,
  css: <FaCss3Alt />,
  react: <FaReact />,
  "node.js": <FaNodeJs />,
  "express.js": <SiExpress />,
  postgresql: <SiPostgresql />,
  mongodb: <SiMongodb />,
  numpy: <SiNumpy />,
  pandas: <SiPandas />,
  git: <FaGitAlt />,
  github: <FaGithub />,
  figma: <FaFigma />,
};

function SkillItem({ skill }) {
  const titleLower = (skill.title || skill.name || "").toLowerCase();
  const IconComponent = iconMap[titleLower];
  const svgUrl = skill.svg?.url;

  return (
    <div className="skill-item">
      <div className="skill-icon">
        {IconComponent ? (
          IconComponent
        ) : svgUrl ? (
          <img
            src={svgUrl}
            alt={skill.title || skill.name}
            className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(184,74,28,0.25)]"
          />
        ) : (
          <Cpu />
        )}
      </div>
      <span className="skill-name">{skill.title || skill.name}</span>
    </div>
  );
}

export default function Skills({ skills = [], softwareApplications = [] }) {
  const trackRef = useRef(null);

  // Combine skills and applications dynamically from backend
  const combinedSkills = [...skills, ...softwareApplications];
  const displayList = combinedSkills.length > 0 ? combinedSkills : [];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let direction = 1; // 1: Right to Left (Scroll Down), -1: Left to Right (Scroll Up)
    let lastScrollY = window.scrollY;
    let animationFrameId;
    let lastTime = performance.now();
    const speed = 55; // Pixels per second

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;

      if (Math.abs(diff) > 3) {
        if (diff > 0) {
          direction = 1;
        } else {
          direction = -1;
        }
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const halfWidth = track.scrollWidth / 2;

      if (halfWidth > 0) {
        if (direction === 1) {
          x -= speed * deltaTime;
          if (x <= -halfWidth) {
            x += halfWidth;
          }
        } else {
          x += speed * deltaTime;
          if (x >= 0) {
            x -= halfWidth;
          }
        }
        track.style.transform = `translate3d(${x}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [displayList.length]);

  return (
    <section id="skills" className="skills-section">
      {/* ================= BACKGROUND GLOWS ================= */}
      <div className="skill-glow skill-glow-left" />
      <div className="skill-glow skill-glow-center" />
      <div className="skill-glow skill-glow-right" />

      {/* ================= HEADING ================= */}
      <div className="skills-heading">
        <h2>
          My <span>Skills</span>
        </h2>
        <p>Modern Applications | Modern Technologies</p>
      </div>

      {/* ================= MOVING SKILLS ================= */}
      <div className="skills-wrapper">
        {/* Left Fade */}
        <div className="skills-fade-left" />

        {/* Right Fade */}
        <div className="skills-fade-right" />

        {/* Moving Track */}
        <div className="skills-track" ref={trackRef}>
          {/* First Row */}
          <div className="skills-list">
            {displayList.map((skill, index) => (
              <SkillItem
                key={`skill-first-${skill._id || index}`}
                skill={skill}
              />
            ))}
          </div>

          {/* Duplicate Row */}
          <div className="skills-list" aria-hidden="true">
            {displayList.map((skill, index) => (
              <SkillItem
                key={`skill-second-${skill._id || index}`}
                skill={skill}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= SECTION CSS ================= */}
      <style>{`
        .skills-section {
          position: relative;
          width: 100%;
          margin: 0;
          padding: 70px 0 70px 0;
          overflow: hidden;
          background: #FAF7F2;
          color: #1C1917;
          isolation: isolate;
        }

        .skill-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: -1;
          filter: blur(80px);
        }

        .skill-glow-left {
          width: 360px;
          height: 360px;
          left: -200px;
          top: -80px;
          background: rgba(239, 231, 216, 0.7);
        }

        .skill-glow-center {
          width: 300px;
          height: 300px;
          left: 43%;
          top: 90px;
          background: rgba(184, 74, 28, 0.08);
        }

        .skill-glow-right {
          width: 420px;
          height: 420px;
          right: -230px;
          bottom: -170px;
          background: rgba(232, 223, 200, 0.6);
        }

        .skills-heading {
          position: relative;
          z-index: 2;
          width: 100%;
          margin: 0 0 36px 0;
          padding: 0 20px;
          text-align: center;
        }

        .skills-heading h2 {
          margin: 0;
          padding: 0;
          color: #1C1917;
          font-family: var(--font-heading);
          font-size: clamp(2rem, 3.8vw, 3rem);
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -0.015em;
        }

        .skills-heading h2 span {
          color: #B84A1C;
          font-style: italic;
          font-family: var(--font-heading);
        }

        .skills-heading p {
          margin: 10px 0 0 0;
          padding: 0;
          font-family: var(--font-body);
          font-weight: 400;
          color: #78716C;
          font-size: clamp(0.875rem, 1.2vw, 1rem);
          line-height: 1.6;
        }

        .skills-wrapper {
          position: relative;
          width: 100%;
          margin: 0;
          padding: 24px 0;
          overflow: hidden;
        }

        .skills-track {
          display: flex;
          width: max-content;
          margin: 0;
          padding: 0;
          will-change: transform;
        }

        .skills-list {
          display: flex;
          align-items: center;
          gap: 28px;
          margin: 0;
          padding: 0 28px 0 0;
          flex-shrink: 0;
        }

        .skill-item {
          width: 110px;
          min-width: 110px;
          height: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid #E8E1D5;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(28, 25, 23, 0.04);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .skill-item:hover {
          transform: translateY(-6px) scale(1.04);
          border-color: rgba(184, 74, 28, 0.4);
          box-shadow: 0 10px 24px rgba(184, 74, 28, 0.12);
          background: #ffffff;
        }

        .skill-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 38px;
          color: #B84A1C;
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .skill-item:hover .skill-icon {
          transform: scale(1.1);
          color: #A03D14;
        }

        .skill-name {
          color: #1C1917;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          line-height: 1.2;
          white-space: nowrap;
          text-align: center;
          letter-spacing: normal;
        }

        .skills-fade-left {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 140px;
          z-index: 10;
          pointer-events: none;
          background: linear-gradient(to right, #FAF7F2 0%, rgba(250, 247, 242, 0.95) 25%, rgba(250, 247, 242, 0.6) 55%, transparent 100%);
        }

        .skills-fade-right {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 140px;
          z-index: 10;
          pointer-events: none;
          background: linear-gradient(to left, #FAF7F2 0%, rgba(250, 247, 242, 0.95) 25%, rgba(250, 247, 242, 0.6) 55%, transparent 100%);
        }

        @media (max-width: 768px) {
          .skills-section {
            padding-top: 50px;
            padding-bottom: 50px;
          }
          .skills-heading {
            margin-bottom: 25px;
          }
          .skills-heading h2 {
            font-size: 28px;
          }
          .skills-heading p {
            font-size: 13px;
          }
          .skills-list {
            gap: 20px;
            padding-right: 20px;
          }
          .skill-item {
            width: 90px;
            min-width: 90px;
            height: 95px;
            border-radius: 16px;
          }
          .skill-icon {
            font-size: 32px;
          }
          .skill-name {
            font-size: 11px;
          }
          .skills-fade-left,
          .skills-fade-right {
            width: 60px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skills-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
