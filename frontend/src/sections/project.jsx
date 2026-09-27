import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ExternalLink, ArrowUpRight, Globe } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

// =====================================================
// INDIVIDUAL PROJECT CARD (Sticky Scroll Stack)
// =====================================================

function ProjectCard({ project, index, total, progress, shouldReduceMotion }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const stepY = isMobile ? 16 : 26;
  const exitY = isMobile ? -700 : -850;

  // Generate deterministic continuous motion ranges with clean dwell plateaus
  const { inputRange, yRange, scaleRange, opacityRange } = useMemo(() => {
    if (total <= 1) {
      return {
        inputRange: [0, 1],
        yRange: [0, 0],
        scaleRange: [1, 1],
        opacityRange: [1, 1],
      };
    }

    const T = total - 1;
    const step = 1 / T;

    const points = [0];
    for (let k = 0; k < T; k++) {
      const dwellEnd = k * step + step * 0.45;
      const transMid = k * step + step * 0.82;
      const transEnd = (k + 1) * step;
      points.push(Number(dwellEnd.toFixed(4)));
      points.push(Number(transMid.toFixed(4)));
      points.push(Number(transEnd.toFixed(4)));
    }

    const inputRange = Array.from(new Set(points)).sort((a, b) => a - b);
    const yRange = [];
    const scaleRange = [];
    const opacityRange = [];

    for (const p of inputRange) {
      if (p >= (index + 1) * step) {
        // Card has completely exited upward
        yRange.push(exitY);
        scaleRange.push(0.95);
        opacityRange.push(0);
      } else if (p >= index * step + step * 0.45) {
        // Card is currently translating upward off the stack
        const start = index * step + step * 0.45;
        const end = (index + 1) * step;
        const t = (p - start) / (end - start);
        yRange.push(Math.round(exitY * t));
        scaleRange.push(Number((1.0 - 0.05 * t).toFixed(3)));
        // CRITICAL: Card stays 100% solid white (opacity 1.0) while clearing the card below it!
        // It only fades out at the very end when it has physically cleared the stack.
        if (t < 0.75) {
          opacityRange.push(1.0);
        } else {
          const fadeT = (t - 0.75) / 0.25;
          opacityRange.push(Number(Math.max(0, 1.0 - fadeT).toFixed(3)));
        }
      } else if (p >= index * step) {
        // Card is active in the foreground and dwelling
        yRange.push(0);
        scaleRange.push(1.0);
        opacityRange.push(1.0);
      } else {
        // Card is waiting in the stack behind (p < index * step)
        // Only start fading in when the card immediately in front starts exiting!
        const enterStart = (index - 1) * step + step * 0.45;
        const enterEnd = index * step;
        if (p <= enterStart) {
          // Deep in stack: INVISIBLE to prevent ANY text collision or bleed-through!
          yRange.push(stepY);
          scaleRange.push(0.96);
          opacityRange.push(0);
        } else {
          // Rising into active focus as previous card exits
          const t = (p - enterStart) / (enterEnd - enterStart);
          yRange.push(Math.round(stepY * (1 - t)));
          scaleRange.push(Number((0.96 + 0.04 * t).toFixed(3)));
          opacityRange.push(Number((0.3 + 0.7 * t).toFixed(3)));
        }
      }
    }

    return { inputRange, yRange, scaleRange, opacityRange };
  }, [index, total, stepY, exitY]);

  const y = useTransform(progress, inputRange, yRange);
  const scale = useTransform(progress, inputRange, scaleRange);
  const opacity = useTransform(progress, inputRange, opacityRange);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.85 ? "auto" : "none"));

  const rawTechList = project?.technologies
    ? (Array.isArray(project.technologies)
        ? project.technologies
        : project.technologies.split(",")
      )
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const techList = isMobile ? rawTechList.slice(0, 5) : rawTechList;

  const displayNum = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
  const totalNum = total < 10 ? `0${total}` : `${total}`;

  const liveUrl =
    project.projectLink &&
    project.projectLink.trim() !== "" &&
    !project.projectLink.includes("[ADD")
      ? project.projectLink
      : `/project/${project._id}`;

  const hasGitRepo =
    project.gitRepoLink &&
    project.gitRepoLink.trim() !== "" &&
    !project.gitRepoLink.includes("[ADD");

  const isExternalLive = liveUrl.startsWith("http");

  const cardContent = (
    <div className="w-full rounded-2xl sm:rounded-3xl bg-white border border-[#E8E1D5] p-4 sm:p-7 md:p-9 shadow-[0_12px_40px_rgba(28,25,23,0.08)] relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(184,74,28,0.14)] hover:border-[#B84A1C]/40">
      {/* Glow ambient inside card */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-[#EFE7D8]/60 via-[#F5EFEB]/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#E8DFC8]/40 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
        {/* LEFT COLUMN: Project Details */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4 sm:space-y-5">
          {/* Header / Number & Category */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-1.5 sm:mb-2">
              <span className="text-[#B84A1C] font-sans text-xs font-semibold uppercase tracking-wider">
                {project.stack || "Full-Stack Project"}
              </span>
              <span className="text-[#78716C] font-mono text-xs font-medium">
                {displayNum} / {totalNum}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#1C1917] hover:text-[#B84A1C] transition-colors leading-tight">
              {project.title}
            </h3>

            <p className="text-[#78716C] text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              {project.stack || "Production Architecture"}
            </p>
          </div>

          {/* Description */}
          <p className="text-[#57534E] text-xs sm:text-sm md:text-base line-clamp-3 sm:line-clamp-4 leading-relaxed">
            {project.description}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
            {techList.map((item, i) => (
              <span
                key={i}
                className="px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-sans font-medium rounded-full bg-[#FAF7F2] text-[#1C1917] border border-[#E8E1D5]"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 sm:pt-3">
            {/* Live Preview / Details Button */}
            {isExternalLive ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm text-white bg-[#B84A1C] hover:bg-[#A03D14] transition-all shadow-md hover:shadow-[0_8px_20px_rgba(184,74,28,0.25)] hover:scale-102 active:scale-98"
              >
                <Globe size={15} />
                Live Demo
                <ArrowUpRight size={15} />
              </a>
            ) : (
              <Link
                to={liveUrl}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm text-white bg-[#B84A1C] hover:bg-[#A03D14] transition-all shadow-md hover:shadow-[0_8px_20px_rgba(184,74,28,0.25)] hover:scale-102 active:scale-98"
              >
                <Globe size={15} />
                View Details
                <ArrowUpRight size={15} />
              </Link>
            )}

            {/* GitHub Repo Button */}
            {hasGitRepo && (
              <a
                href={project.gitRepoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm text-[#1C1917] bg-white/80 border border-[#E8E1D5] hover:border-[#1C1917]/30 hover:bg-white transition-all shadow-xs hover:shadow-sm hover:scale-102 active:scale-98"
              >
                <FaGithub size={15} />
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Browser Mockup Preview */}
        <div className="lg:col-span-7">
          {isExternalLive ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative rounded-2xl overflow-hidden border border-[#E8E1D5] bg-[#FAF7F2] shadow-lg transition-all duration-500 hover:border-[#B84A1C]/50 hover:shadow-xl"
            >
              {/* Browser Window Mockup Top Bar */}
              <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ECE5D8] border-b border-[#E0D5C3]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E06C75]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5C07B]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#98C379]" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-[#57534E] bg-white/90 px-2.5 sm:px-3 py-0.5 rounded-md border border-[#DDD3C2] flex items-center gap-1.5 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[280px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B84A1C] animate-pulse" />
                  {liveUrl.replace("https://", "").replace("http://", "")}
                </div>
                <div className="text-[#78716C]">
                  <ExternalLink size={14} className="group-hover:text-[#B84A1C] transition-colors" />
                </div>
              </div>

              {/* Project Screenshot Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#EFEBE4]">
                <img
                  src={project.projectBanner?.url || "/placeholder.jpg"}
                  alt={project.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-103"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";
                  }}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#B84A1C] shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    Open Live Deployment <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </a>
          ) : (
            <Link
              to={liveUrl}
              className="group block relative rounded-2xl overflow-hidden border border-[#E8E1D5] bg-[#FAF7F2] shadow-lg transition-all duration-500 hover:border-[#B84A1C]/50 hover:shadow-xl"
            >
              <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ECE5D8] border-b border-[#E0D5C3]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E06C75]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5C07B]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#98C379]" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-[#57534E] bg-white/90 px-2.5 sm:px-3 py-0.5 rounded-md border border-[#DDD3C2] flex items-center gap-1.5 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[280px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B84A1C] animate-pulse" />
                  {project.title.toLowerCase().replace(/\s+/g, "-")}
                </div>
                <div className="text-[#78716C]">
                  <ExternalLink size={14} className="group-hover:text-[#B84A1C] transition-colors" />
                </div>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden bg-[#EFEBE4]">
                <img
                  src={project.projectBanner?.url || "/placeholder.jpg"}
                  alt={project.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-103"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#B84A1C] shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    View Project Details <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  // If reduced motion is requested, render without transform overlays
  if (shouldReduceMotion) {
    return (
      <div className="w-full max-w-5xl mx-auto mb-10 sm:mb-16">
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        zIndex: (total - index) * 10,
        pointerEvents,
      }}
      className={`absolute inset-x-0 mx-auto w-full max-w-5xl ${
        index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"
      }`}
    >
      {cardContent}
    </motion.div>
  );
}

// =====================================================
// MAIN PROJECTS SECTION (Sticky Scroll Stack)
// =====================================================

export default function Projects({ projects = [], user }) {
  const stackContainerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: stackContainerRef,
    offset: ["start start", "end end"],
  });

  if (!projects || projects.length === 0) {
    return null;
  }

  const isMultiProject = projects.length > 1 && !shouldReduceMotion;

  return (
    <section
      id="projects"
      className="relative w-full bg-[#FAF7F2] text-[#1C1917] pt-20 pb-24 px-4 sm:px-6 lg:px-8"
    >
      {/* ================= BACKGROUND GLOWS (Clipped safely without breaking sticky) ================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="pointer-events-none absolute left-[-150px] top-[10%] h-[500px] w-[500px] rounded-full bg-[#EFE7D8]/70 blur-[140px]" />
        <div className="pointer-events-none absolute right-[-150px] top-[40%] h-[500px] w-[500px] rounded-full bg-[#E8DFC8]/60 blur-[140px]" />
        <div className="pointer-events-none absolute left-[30%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-[#EFE7D8]/50 blur-[130px]" />
      </div>

      {/* ================= SECTION HEADER ================= */}
      <div className="relative z-10 mx-auto max-w-5xl text-center mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-[#1C1917] tracking-tight">
            My <span className="text-[#B84A1C] italic font-serif">Projects</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Explore live deployed web applications, AI tools, and production-ready platforms built with modern technology stacks.
          </p>
        </motion.div>
      </div>

      {/* ================= STACKED SCROLLING CARDS ================= */}
      {isMultiProject ? (
        <div
          ref={stackContainerRef}
          className="relative z-10 mx-auto max-w-5xl"
          style={{
            height: `${Math.max(projects.length * 85, 120)}vh`,
          }}
        >
          <div className="sticky top-16 sm:top-24 w-full h-[calc(100vh-4.5rem)] sm:h-[calc(100vh-7rem)] min-h-[460px] flex items-center justify-center pointer-events-none">
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id || index}
                project={project}
                index={index}
                total={projects.length}
                progress={scrollYProgress}
                shouldReduceMotion={false}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 mx-auto max-w-5xl space-y-8 sm:space-y-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={project._id || index}
              project={project}
              index={index}
              total={projects.length}
              progress={scrollYProgress}
              shouldReduceMotion={true}
            />
          ))}
        </div>
      )}

      {/* ================= GITHUB REPOSITORIES CTA ================= */}
      <div className="relative z-10 mx-auto max-w-3xl text-center mt-12 sm:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-3xl bg-white/90 border border-[#E8E1D5] shadow-xs"
        >
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] mb-2">
            Want to see more projects?
          </h3>
          <p className="text-[#57534E] text-sm sm:text-base mb-6 max-w-xl mx-auto">
            Check out my GitHub for more open-source repositories, experiments, and ongoing projects.
          </p>
          <a
            href={user?.githubURL || "https://github.com/jharajiv315"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-medium text-sm text-white bg-[#1C1917] hover:bg-[#B84A1C] transition-all shadow-md hover:shadow-lg hover:scale-102 active:scale-98"
          >
            <FaGithub size={18} />
            Explore All Repositories on GitHub
            <ArrowUpRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
