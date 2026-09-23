import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Sparkles, ArrowUpRight, Globe } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

// =====================================================
// INDIVIDUAL PROJECT CARD (Sticky Scroll Stack)
// =====================================================

function ProjectCard({ project, index, total, range, targetScale, progress }) {
  const containerRef = useRef(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  const techList = project?.technologies
    ? (Array.isArray(project.technologies)
        ? project.technologies
        : project.technologies.split(",")
      )
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

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

  return (
    <div
      ref={containerRef}
      className="sticky top-24 flex items-center justify-center w-full mb-12 sm:mb-20"
      style={{
        zIndex: index + 1,
      }}
    >
      <motion.div
        style={{
          scale,
        }}
        className="w-full max-w-5xl mx-auto rounded-3xl bg-white/95 border border-[#E8E1D5] p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgba(28,25,23,0.06)] backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:shadow-[0_16px_40px_rgba(184,74,28,0.12)] hover:border-[#B84A1C]/40"
      >
        {/* Glow ambient inside card */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-[#EFE7D8]/60 via-[#F5EFEB]/30 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#E8DFC8]/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT COLUMN: Project Details */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-5">
            {/* Header / Number & Category */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[#B84A1C] font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="animate-pulse" />
                  {project.stack || "Full-Stack Project"}
                </span>
                <span className="text-[#78716C] font-mono text-xs font-medium">
                  {displayNum} / {totalNum}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] hover:text-[#B84A1C] transition-colors leading-tight">
                {project.title}
              </h3>

              <p className="text-[#78716C] text-sm mt-1 font-medium">
                {project.stack || "Production Architecture"}
              </p>
            </div>

            {/* Description */}
            <p className="text-[#57534E] text-sm sm:text-base line-clamp-4 leading-relaxed">
              {project.description}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {techList.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-sans font-medium rounded-full bg-[#FAF7F2] text-[#1C1917] border border-[#E8E1D5]"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {/* Live Preview / Details Button */}
              {isExternalLive ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm text-white bg-[#B84A1C] hover:bg-[#A03D14] transition-all shadow-md hover:shadow-[0_8px_20px_rgba(184,74,28,0.25)] hover:scale-102 active:scale-98"
                >
                  <Globe size={15} />
                  Live Demo
                  <ArrowUpRight size={15} />
                </a>
              ) : (
                <Link
                  to={liveUrl}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm text-white bg-[#B84A1C] hover:bg-[#A03D14] transition-all shadow-md hover:shadow-[0_8px_20px_rgba(184,74,28,0.25)] hover:scale-102 active:scale-98"
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
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm text-[#1C1917] bg-white/80 border border-[#E8E1D5] hover:border-[#1C1917]/30 hover:bg-white transition-all shadow-xs hover:shadow-sm hover:scale-102 active:scale-98"
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
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#ECE5D8] border-b border-[#E0D5C3]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E06C75]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E5C07B]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#98C379]" />
                  </div>
                  <div className="text-[11px] font-mono text-[#57534E] bg-white/90 px-3 py-0.5 rounded-md border border-[#DDD3C2] flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-[280px]">
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
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#ECE5D8] border-b border-[#E0D5C3]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E06C75]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E5C07B]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#98C379]" />
                  </div>
                  <div className="text-[11px] font-mono text-[#57534E] bg-white/90 px-3 py-0.5 rounded-md border border-[#DDD3C2] flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-[280px]">
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
      </motion.div>
    </div>
  );
}

// =====================================================
// MAIN PROJECTS SECTION (Sticky Scroll)
// =====================================================

export default function Projects({ projects = [], user }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-[#FAF7F2] text-[#1C1917] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ================= BACKGROUND GLOWS ================= */}
      <div className="pointer-events-none absolute left-[-150px] top-[10%] h-[500px] w-[500px] rounded-full bg-[#EFE7D8]/70 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-150px] top-[40%] h-[500px] w-[500px] rounded-full bg-[#E8DFC8]/60 blur-[140px]" />
      <div className="pointer-events-none absolute left-[30%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-[#EFE7D8]/50 blur-[130px]" />

      {/* ================= SECTION HEADER ================= */}
      <div className="relative z-10 mx-auto max-w-5xl text-center mb-16 sm:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E8E1D5] text-[#B84A1C] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles size={13} />
            Portfolio Showcase
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-[#1C1917] tracking-tight">
            My <span className="text-[#B84A1C] italic font-serif">Projects</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Explore live deployed web applications, AI tools, and production-ready platforms built with modern technology stacks.
          </p>
        </motion.div>
      </div>

      {/* ================= STACKED SCROLLING CARDS ================= */}
      <div className="relative z-10 mx-auto max-w-5xl">
        {projects.map((project, index) => {
          const targetScale = 1 - (projects.length - index) * 0.04;
          return (
            <ProjectCard
              key={project._id || index}
              project={project}
              index={index}
              total={projects.length}
              range={[index * (1 / projects.length), 1]}
              targetScale={targetScale}
              progress={scrollYProgress}
            />
          );
        })}
      </div>

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
