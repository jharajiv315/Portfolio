import { useEffect, useRef, useState } from "react";
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
  FaDocker,
} from "react-icons/fa";
import {
  SiCplusplus,
  SiMongodb,
  SiPostgresql,
  SiNumpy,
  SiPandas,
  SiExpress,
  SiPostman,
  SiIntellijidea,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { Cpu } from "lucide-react";

// Robust icon map for both skills and popular software tools
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
  nodejs: <FaNodeJs />,
  "express.js": <SiExpress />,
  express: <SiExpress />,
  postgresql: <SiPostgresql />,
  postgres: <SiPostgresql />,
  mongodb: <SiMongodb />,
  numpy: <SiNumpy />,
  pandas: <SiPandas />,
  git: <FaGitAlt />,
  github: <FaGithub />,
  figma: <FaFigma />,
  docker: <FaDocker />,
  postman: <SiPostman />,
  "visual studio code": <VscVscode />,
  vscode: <VscVscode />,
  "intellij idea": <SiIntellijidea />,
  intellij: <SiIntellijidea />,
};

// Fallback software apps in case database data is still loading
const DEFAULT_APPS = [
  { name: "Git", svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" } },
  { name: "GitHub", svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" } },
  { name: "Visual Studio Code", svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" } },
  { name: "Figma", svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" } },
  { name: "PostgreSQL", svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" } },
  { name: "MongoDB", svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" } },
  { name: "Cloudinary", svg: { url: "https://res.cloudinary.com/cloudinary/image/upload/dpr_auto/w_80/v1/logo/for_white_bg/cloudinary_icon_for_white_bg.svg" } },
  { name: "Intellij IDEA", svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg" } },
];

// Fallback skills in case database data is still loading
const DEFAULT_SKILLS = [
  { title: "Java" },
  { title: "Python" },
  { title: "JavaScript" },
  { title: "React" },
  { title: "Node.js" },
  { title: "Express.js" },
  { title: "C++" },
  { title: "HTML" },
  { title: "CSS" },
  { title: "PostgreSQL" },
  { title: "MongoDB" },
  { title: "Git" },
];

function TechnologyItem({ item }) {
  const [imgError, setImgError] = useState(false);
  const name = item.name || item.title || "";
  const nameLower = name.toLowerCase().trim();
  const IconComponent = iconMap[nameLower];
  const svgUrl = item.svg?.url;

  return (
    <div className="skill-item" title={name}>
      <div className="skill-icon">
        {svgUrl && !imgError ? (
          <img
            src={svgUrl}
            alt={name}
            onError={() => setImgError(true)}
            className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(184,74,28,0.25)]"
            loading="lazy"
          />
        ) : IconComponent ? (
          IconComponent
        ) : (
          <Cpu />
        )}
      </div>
      <span className="skill-name">{name}</span>
    </div>
  );
}

// Utility to expand small lists to prevent empty gaps on wide (4K) monitors
const repeatListToFill = (list, minLength = 16) => {
  if (!list || list.length === 0) return [];
  let result = [...list];
  while (result.length < minLength) {
    result = [...result, ...list];
  }
  return result;
};

export default function Skills({ skills = [], softwareApplications = [] }) {
  const skillsTrackRef = useRef(null);
  const appsTrackRef = useRef(null);

  // Use dynamic backend data, with graceful fallback
  const rawSkills = skills && skills.length > 0 ? skills : DEFAULT_SKILLS;
  const rawApps =
    softwareApplications && softwareApplications.length > 0
      ? softwareApplications
      : DEFAULT_APPS;

  const displaySkills = repeatListToFill(rawSkills, 16);
  const displayApps = repeatListToFill(rawApps, 16);

  useEffect(() => {
    const skillsTrack = skillsTrackRef.current;
    const appsTrack = appsTrackRef.current;
    if (!skillsTrack && !appsTrack) return;

    let xSkills = 0;
    let xApps = 0;
    let direction = 1; // 1: Scroll Down, -1: Scroll Up
    let lastScrollY = window.scrollY;
    let animationFrameId;
    let lastTime = performance.now();
    const speed = 55; // Pixels per second

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;

      if (Math.abs(diff) > 3) {
        direction = diff > 0 ? 1 : -1;
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Track 1: Skills (moving Right-to-Left)
      if (skillsTrack) {
        const halfWidthSkills = skillsTrack.scrollWidth / 2;
        if (halfWidthSkills > 0) {
          if (direction === 1) {
            xSkills -= speed * deltaTime;
            if (xSkills <= -halfWidthSkills) xSkills += halfWidthSkills;
          } else {
            xSkills += speed * deltaTime;
            if (xSkills >= 0) xSkills -= halfWidthSkills;
          }
          skillsTrack.style.transform = `translate3d(${xSkills}px, 0, 0)`;
        }
      }

      // Track 2: Apps (moving Left-to-Right for elegant contrasting motion)
      if (appsTrack) {
        const halfWidthApps = appsTrack.scrollWidth / 2;
        if (halfWidthApps > 0) {
          if (direction === 1) {
            xApps += speed * deltaTime;
            if (xApps >= 0) xApps -= halfWidthApps;
          } else {
            xApps -= speed * deltaTime;
            if (xApps <= -halfWidthApps) xApps += halfWidthApps;
          }
          appsTrack.style.transform = `translate3d(${xApps}px, 0, 0)`;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [displaySkills.length, displayApps.length]);

  return (
    <section id="skills" className="skills-section">
      {/* ================= BACKGROUND GLOWS ================= */}
      <div className="skill-glow skill-glow-left" />
      <div className="skill-glow skill-glow-center" />
      <div className="skill-glow skill-glow-right" />

      {/* ================= SECTION 1: MY SKILLS ================= */}
      <div className="skills-heading">
        <h2>
          My <span>Skills</span>
        </h2>
        <p>Languages, Frameworks & Core Foundations</p>
      </div>

      {/* Moving Track: Skills */}
      <div className="skills-wrapper">
        <div className="skills-fade-left" />
        <div className="skills-fade-right" />

        <div className="skills-track" ref={skillsTrackRef}>
          {/* First Row */}
          <div className="skills-list">
            {displaySkills.map((skill, index) => (
              <TechnologyItem
                key={`skill-first-${skill._id || skill.title || index}-${index}`}
                item={skill}
              />
            ))}
          </div>

          {/* Duplicate Row for Seamless Loop */}
          <div className="skills-list" aria-hidden="true">
            {displaySkills.map((skill, index) => (
              <TechnologyItem
                key={`skill-second-${skill._id || skill.title || index}-${index}`}
                item={skill}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: MY APPS ================= */}
      <div className="skills-heading apps-heading">
        <h2>
          My <span>Apps</span>
        </h2>
        <p>Software Applications & Development Environments</p>
      </div>

      {/* Moving Track: Apps (contrasting counter-flow animation) */}
      <div className="skills-wrapper">
        <div className="skills-fade-left" />
        <div className="skills-fade-right" />

        <div className="skills-track" ref={appsTrackRef}>
          {/* First Row */}
          <div className="skills-list">
            {displayApps.map((app, index) => (
              <TechnologyItem
                key={`app-first-${app._id || app.name || index}-${index}`}
                item={app}
              />
            ))}
          </div>

          {/* Duplicate Row for Seamless Loop */}
          <div className="skills-list" aria-hidden="true">
            {displayApps.map((app, index) => (
              <TechnologyItem
                key={`app-second-${app._id || app.name || index}-${index}`}
                item={app}
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
          padding: 80px 0 80px 0;
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
          margin: 0 0 32px 0;
          padding: 0 20px;
          text-align: center;
        }

        .skills-heading.apps-heading {
          margin-top: 52px;
          margin-bottom: 32px;
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
          padding: 16px 0;
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
          max-width: 95px;
          overflow: hidden;
          text-overflow: ellipsis;
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
            padding-top: 55px;
            padding-bottom: 55px;
          }
          .skills-heading {
            margin-bottom: 22px;
          }
          .skills-heading.apps-heading {
            margin-top: 40px;
            margin-bottom: 22px;
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
            max-width: 80px;
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
