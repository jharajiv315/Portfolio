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
        className="w-full max-w-5xl mx-auto rounded-2xl bg-zinc-950/90 border border-cyan-500/25 p-6 sm:p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden transition-shadow duration-500 hover:shadow-[0_0_60px_rgba(34,211,238,0.2)] hover:border-cyan-400/40"
      >
        {/* Glow ambient inside card */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT COLUMN: Project Details */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-5">
            {/* Header / Number & Category */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-cyan-400 font-body text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="animate-pulse" />
                  {project.stack || "Full-Stack Project"}
                </span>
                <span className="text-gray-500 font-body text-xs font-medium">
                  {displayNum} / {totalNum}
                </span>
              </div>

              <h3 className="card-heading hover:text-cyan-300 transition-colors">
                {project.title}
              </h3>

              <p className="card-subtext mt-1">
                {project.stack || "Production Architecture"}
              </p>
            </div>

            {/* Description */}
            <p className="body-copy-muted line-clamp-4 leading-relaxed">
              {project.description}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {techList.map((item, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 text-xs font-body font-normal rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 backdrop-blur-md"
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-label text-black bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_28px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95"
                >
                  <Globe size={15} />
                  Live Demo
                  <ArrowUpRight size={15} />
                </a>
              ) : (
                <Link
                  to={liveUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-label text-black bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_28px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95"
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-label text-gray-200 bg-zinc-900/80 border border-zinc-700/80 hover:border-cyan-400/60 hover:text-white hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95"
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
                className="group block relative rounded-xl overflow-hidden border border-zinc-700/60 bg-zinc-900/90 shadow-2xl transition-all duration-500 hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]"
              >
                {/* Browser Window Mockup Top Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 bg-zinc-950/80 px-3 py-0.5 rounded-md border border-zinc-800 flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-[280px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {liveUrl.replace("https://", "").replace("http://", "")}
                  </div>
                  <div className="text-gray-500">
                    <ExternalLink size={14} className="group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>

                {/* Project Screenshot Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                  <img
                    src={project.projectBanner?.url || "/placeholder.jpg"}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";
                    }}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-cyan-500/90 backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      Open Live Deployment <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </a>
            ) : (
              <Link
                to={liveUrl}
                className="group block relative rounded-xl overflow-hidden border border-zinc-700/60 bg-zinc-900/90 shadow-2xl transition-all duration-500 hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]"
              >
                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 bg-zinc-950/80 px-3 py-0.5 rounded-md border border-zinc-800 flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-[280px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {project.title.toLowerCase().replace(/\s+/g, "-")}
                  </div>
                  <div className="text-gray-500">
                    <ExternalLink size={14} className="group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                  <img
                    src={project.projectBanner?.url || "/placeholder.jpg"}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-cyan-500/90 backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
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
      className="relative w-full bg-black text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ================= BACKGROUND GLOWS ================= */}
      <div className="pointer-events-none absolute left-[-200px] top-[10%] h-[550px] w-[550px] rounded-full bg-cyan-500/15 blur-[150px]" />
      <div className="pointer-events-none absolute right-[-200px] top-[40%] h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[150px]" />
      <div className="pointer-events-none absolute left-[30%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[130px]" />

      {/* ================= SECTION HEADER ================= */}
      <div className="relative z-10 mx-auto max-w-5xl text-center mb-16 sm:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 section-pill mb-3">
            <Sparkles size={13} />
            Portfolio Showcase
          </div>

          <h2 className="section-heading">
            My <span className="text-cyan-400">Projects</span>
          </h2>

          <p className="mt-3 section-subtext max-w-2xl mx-auto">
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
          className="p-8 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-sm"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Want to see more projects?
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Check out my GitHub for more open-source repositories, experiments, and ongoing projects.
          </p>
          <a
            href={user?.githubURL || "https://github.com/jharajiv315"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white bg-zinc-900 border border-cyan-500/40 hover:bg-cyan-950/50 hover:border-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95"
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
