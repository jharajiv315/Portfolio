import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, ArrowUpRight, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

// =====================================================
// INDIVIDUAL PROJECT CARD (Opaque Physical Deck Member)
// =====================================================

function ProjectCard({
  project,
  index,
  total,
  activeIndex,
  onNext,
  onPrev,
  shouldReduceMotion,
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const rawTechList = project?.technologies
    ? (Array.isArray(project.technologies)
        ? project.technologies
        : project.technologies.split(",")
      )
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const techList = isMobile ? rawTechList.slice(0, 4) : rawTechList;

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

  // Physical deck positioning:
  // - Previous cards (index < activeIndex): have slid UP and away (-115%)
  // - Active card (index === activeIndex): resting in full focus (0%, scale 1)
  // - Next cards (index > activeIndex): resting underneath (0%, scale 0.97), completely occluded
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;

  const cardContent = (
    <div
      className="w-full rounded-2xl sm:rounded-3xl border border-[#E8E1D5] p-4 sm:p-7 md:p-9 shadow-[0_12px_40px_rgba(28,25,23,0.08)] relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(184,74,28,0.14)] hover:border-[#B84A1C]/40"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Subtle warm ambient accents inside card */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-[#EFE7D8]/60 via-[#F5EFEB]/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#E8DFC8]/40 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center">
        {/* LEFT COLUMN: Project Details */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-3.5 sm:space-y-5">
          {/* Header / Number & Category with Interactive Navigation */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-1.5 sm:mb-2">
              <span className="text-[#B84A1C] font-sans text-xs font-semibold uppercase tracking-wider">
                {project.stack || "Full-Stack Project"}
              </span>

              {/* Counter + Prev/Next Controls */}
              <div className="flex items-center gap-2">
                <span className="text-[#78716C] font-mono text-xs font-medium">
                  {displayNum} / {totalNum}
                </span>

                {total > 1 && (
                  <div className="flex items-center gap-1 ml-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                      }}
                      disabled={activeIndex === 0}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#E8E1D5] bg-[#FAF7F2] text-[#57534E] hover:text-[#B84A1C] hover:border-[#B84A1C] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                      aria-label="Previous Project"
                      title="Previous project"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                      }}
                      disabled={activeIndex === total - 1}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#E8E1D5] bg-[#FAF7F2] text-[#57534E] hover:text-[#B84A1C] hover:border-[#B84A1C] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                      aria-label="Next Project"
                      title="Next project"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
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
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1.5 sm:pt-3">
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
              <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2.5 bg-[#ECE5D8] border-b border-[#E0D5C3]">
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
              <div className="relative aspect-[16/9] max-h-[170px] sm:max-h-none sm:aspect-[16/10] overflow-hidden bg-[#EFEBE4]">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 sm:p-6">
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
              <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2.5 bg-[#ECE5D8] border-b border-[#E0D5C3]">
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

              <div className="relative aspect-[16/9] max-h-[170px] sm:max-h-none sm:aspect-[16/10] overflow-hidden bg-[#EFEBE4]">
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 sm:p-6">
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

  // If reduced motion is requested or single project
  if (shouldReduceMotion || total <= 1) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        {cardContent}
      </div>
    );
  }

  // Animation values:
  // - Previous cards: slide up to -115% and hide
  // - Active card: y = 0, scale = 1, visible
  // - Next cards: y = 0, scale = 0.97, occluded
  const targetY = isPast ? "-115%" : "0%";
  const targetScale = isActive ? 1.0 : isPast ? 1.0 : 0.97;
  const targetZIndex = isActive ? 30 : isPast ? 10 : (total - index) * 5;

  return (
    <motion.div
      initial={false}
      animate={{
        y: targetY,
        scale: targetScale,
        opacity: 1, // STRICT OCCLUSION: No opacity crossfade
        visibility: isPast ? "hidden" : "visible",
      }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // Smooth physical card dealing curve
      }}
      style={{
        zIndex: targetZIndex,
        pointerEvents: isActive ? "auto" : "none",
      }}
      className="absolute inset-0 w-full max-w-5xl mx-auto"
    >
      {cardContent}
    </motion.div>
  );
}

// =====================================================
// MAIN PROJECTS SECTION (Single Coordinated Project Deck)
// =====================================================

export default function Projects({ projects = [], user }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const deckRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const total = projects?.length || 0;

  const nextProject = useCallback(() => {
    setActiveIndex((prev) => Math.min(prev + 1, total - 1));
  }, [total]);

  const prevProject = useCallback(() => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToProject = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  // Keyboard navigation when section is in view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (total <= 1) return;
      if (e.key === "ArrowRight") {
        nextProject();
      } else if (e.key === "ArrowLeft") {
        prevProject();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextProject, prevProject, total]);

  // Touch Swipe Handlers for mobile & touch screens
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e) => {
    if (total <= 1) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    // Minimum distance and reasonable speed
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (dt < 600) {
      // Horizontal swipe
      if (absX > 45 && absX > absY * 1.2) {
        if (dx < 0) nextProject(); // Swipe Left -> Next
        else prevProject();         // Swipe Right -> Prev
      }
      // Vertical swipe
      else if (absY > 45 && absY > absX * 1.2) {
        if (dy < 0) nextProject(); // Swipe Up -> Next
        else prevProject();         // Swipe Down -> Prev
      }
    }
  };

  if (!projects || total === 0) {
    return null;
  }

  return (
    <section
      id="projects"
      className="relative w-full bg-[#FAF7F2] text-[#1C1917] pt-20 pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Background ambient accents (safely isolated without overflowing) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="pointer-events-none absolute left-[-150px] top-[10%] h-[500px] w-[500px] rounded-full bg-[#EFE7D8]/70 blur-[140px]" />
        <div className="pointer-events-none absolute right-[-150px] top-[40%] h-[500px] w-[500px] rounded-full bg-[#E8DFC8]/60 blur-[140px]" />
        <div className="pointer-events-none absolute left-[30%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-[#EFE7D8]/50 blur-[130px]" />
      </div>

      {/* Section Header */}
      <div className="relative z-10 mx-auto max-w-5xl text-center mb-8 sm:mb-12">
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

      {/* Single Coordinated Project Deck */}
      <div
        ref={deckRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 mx-auto max-w-5xl"
      >
        {total > 1 ? (
          <div>
            {/* The deck viewport has natural height matching the active card */}
            <div className="relative w-full min-h-[550px] sm:min-h-[460px] lg:min-h-[450px]">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project._id || index}
                  project={project}
                  index={index}
                  total={total}
                  activeIndex={activeIndex}
                  onNext={nextProject}
                  onPrev={prevProject}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>

            {/* Deck Navigation Indicator & Pill Controls */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-4">
              {/* Swipe / Keyboard Hint */}
              <div className="text-xs text-[#78716C] font-sans flex items-center gap-1.5 order-2 sm:order-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B84A1C]" />
                <span>Swipe or use arrows to navigate physical deck</span>
              </div>

              {/* Step Pill Selectors */}
              <div className="flex items-center gap-2 order-1 sm:order-2">
                {projects.map((p, i) => {
                  const isCurrent = i === activeIndex;
                  return (
                    <button
                      key={p._id || i}
                      type="button"
                      onClick={() => goToProject(i)}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-[#B84A1C] text-white font-bold shadow-sm"
                          : "bg-white text-[#78716C] border border-[#E8E1D5] hover:text-[#1C1917] hover:border-[#B84A1C]/50"
                      }`}
                      aria-label={`Go to project ${i + 1}`}
                    >
                      {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full">
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id || index}
                project={project}
                index={index}
                total={1}
                activeIndex={0}
                onNext={() => {}}
                onPrev={() => {}}
                shouldReduceMotion={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* GitHub Repositories CTA (Follows immediately with clean, standard margin - NO BLANK SPACE) */}
      <div className="relative z-10 mx-auto max-w-3xl text-center mt-10 sm:mt-14">
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
