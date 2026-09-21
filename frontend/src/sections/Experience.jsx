import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";

// =====================================================
// TOP/BOTTOM CARD COMPONENT (Progressive Scroll-Linked)
// =====================================================

function DesktopExperienceCard({ exp, progress }) {
  const isTop = exp.position === "top";
  const opacity = useTransform(progress, exp.threshold, [0, 1]);
  const scale = useTransform(progress, exp.threshold, [0.85, 1]);
  const y = useTransform(
    progress,
    exp.threshold,
    isTop ? [-25, 0] : [25, 0]
  );

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y,
      }}
      className="w-full bg-zinc-950/95 border border-cyan-500/30 p-5 rounded-2xl shadow-[0_0_35px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] relative"
    >
      {/* Connecting Pin pointing to timeline dot */}
      <div
        className={`absolute ${
          isTop ? "-bottom-3" : "-top-3"
        } left-1/2 -translate-x-1/2 w-0.5 h-3 bg-cyan-400/70`}
      />

      <div className="text-[11px] font-body font-medium text-cyan-400 flex items-center justify-between mb-1.5">
        <span className="truncate max-w-[140px]">{exp.company}</span>
        <span className="text-gray-400 text-[11px] font-normal">{exp.period}</span>
      </div>

      <h3 className="text-sm sm:text-base font-heading font-bold text-white mb-1.5 leading-snug">
        {exp.role}
      </h3>

      <p className="text-gray-300 text-xs sm:text-sm font-body font-normal leading-relaxed mb-3 line-clamp-3">
        {exp.description}
      </p>

      {exp.skills && exp.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {exp.skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[10px] font-body font-normal rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/20"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// =====================================================
// MAIN EXPERIENCE SECTION
// =====================================================

export default function Experience({ timelines = [] }) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "center center"],
  });

  const scaleLine = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (!timelines || timelines.length === 0) {
    return null;
  }

  // Sort chronological
  const sortedTimelines = [...timelines].sort((a, b) => {
    const fromA = parseInt(a.timeline?.from) || 9998;
    const fromB = parseInt(b.timeline?.from) || 9998;
    return fromA - fromB;
  });

  // Map backend timelines to reference experience shape
  const experiences = sortedTimelines.map((item, index) => {
    const fromYear = item.timeline?.from || "";
    const toYear = item.timeline?.to || "Present";
    const period = fromYear ? `${fromYear} - ${toYear}` : toYear;
    const position = index % 2 === 0 ? "top" : "bottom";

    const desc = item.description || "";
    const skillList = [];
    if (desc.includes("Java")) skillList.push("Java");
    if (desc.includes("DSA") || desc.includes("Data Structures")) skillList.push("DSA");
    if (desc.includes("Python")) skillList.push("Python");
    if (desc.includes("PostgreSQL") || desc.includes("SQL")) skillList.push("PostgreSQL");
    if (desc.includes("Machine Learning") || desc.includes("AI")) skillList.push("AI/ML");
    if (desc.includes("Deep Learning") || desc.includes("PyTorch")) skillList.push("PyTorch");
    if (desc.includes("Full-Stack") || desc.includes("web")) skillList.push("Full Stack");
    if (skillList.length === 0) skillList.push("Computer Science");

    const total = sortedTimelines.length;
    const step = 1 / total;
    const start = index * step + 0.05;
    const end = Math.min(start + 0.2, 0.98);
    const dotStart = Math.max(0.02, start - 0.05);
    const dotEnd = Math.min(dotStart + 0.15, 0.95);

    return {
      id: item._id || item.id || index + 1,
      role: item.title,
      company: item.title.includes("B.Tech") ? "University Degree" : "Technical Milestone",
      period: period,
      position: position,
      description: item.description,
      skills: skillList,
      threshold: [start, end],
      dotThreshold: [dotStart, dotEnd],
    };
  });

  const colsClass =
    experiences.length === 1
      ? "grid-cols-1"
      : experiences.length === 2
      ? "grid-cols-2"
      : experiences.length === 3
      ? "grid-cols-3"
      : "grid-cols-4";

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full bg-black text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ================= BACKGROUND GLOWS ================= */}
      <div className="pointer-events-none absolute left-[-150px] top-[10%] h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[150px]" />
      <div className="pointer-events-none absolute right-[-150px] top-[50%] h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-6xl w-full">
        {/* SECTION HEADER */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 section-pill mb-3">
              <Sparkles size={13} />
              Career Journey
            </div>

            <h2 className="section-heading">
              My <span className="text-cyan-400">Experience</span>
            </h2>

            <p className="mt-3 section-subtext max-w-2xl mx-auto">
              Academic progression, competitive programming milestones, and technical development.
            </p>
          </motion.div>
        </div>

        {/* ================= DESKTOP HORIZONTAL TIMELINE ================= */}
        <div className="hidden lg:block relative py-6">
          {/* 1. TOP CARDS ROW */}
          <div className={`grid ${colsClass} gap-6 items-end min-h-[200px] pb-6`}>
            {experiences.map((exp, index) => {
              if (exp.position !== "top") {
                return <div key={`top-empty-${exp.id}`} />;
              }

              return (
                <motion.div
                  key={`top-card-${exp.id}`}
                  initial={{ opacity: 0, y: -25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="w-full bg-zinc-950/90 border border-cyan-500/30 p-5 rounded-2xl shadow-[0_0_35px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:-translate-y-1 relative"
                >
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-cyan-400/70" />

                  <div className="text-[11px] font-body font-medium text-cyan-400 flex items-center justify-between mb-1.5">
                    <span>{exp.company}</span>
                    <span className="text-gray-400 text-[11px] font-normal">{exp.period}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-heading font-bold text-white mb-1.5 leading-snug">
                    {exp.role}
                  </h3>

                  <p className="text-gray-300 text-xs sm:text-sm font-body font-normal leading-relaxed mb-3">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {exp.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[10px] font-body font-normal rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 2. MIDDLE TIMELINE LINE & DOTS ROW */}
          <div className="relative w-full py-4 flex items-center">
            <div className="w-full h-[3px] bg-zinc-800 rounded-full overflow-hidden absolute left-0 right-0">
              <motion.div
                style={{
                  scaleX: scaleLine,
                  transformOrigin: "left",
                }}
                className="w-full h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-[0_0_15px_rgba(34,211,238,0.9)]"
              />
            </div>

            <div className={`w-full grid ${colsClass} gap-6 relative z-10`}>
              {experiences.map((exp, index) => (
                <div key={`dot-${exp.id}`} className="flex justify-center items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                    className="relative flex items-center justify-center cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-cyan-400/20 animate-ping absolute" />
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-cyan-400 shadow-[0_0_18px_rgba(34,211,238,1)] transition-transform duration-300 group-hover:scale-125" />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. BOTTOM CARDS ROW */}
          <div className={`grid ${colsClass} gap-6 items-start min-h-[200px] pt-6`}>
            {experiences.map((exp, index) => {
              if (exp.position !== "bottom") {
                return <div key={`bottom-empty-${exp.id}`} />;
              }

              return (
                <motion.div
                  key={`bottom-card-${exp.id}`}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="w-full bg-zinc-950/90 border border-cyan-500/30 p-5 rounded-2xl shadow-[0_0_35px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:translate-y-1 relative"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-cyan-400/70" />

                  <div className="text-[11px] font-body font-medium text-cyan-400 flex items-center justify-between mb-1.5">
                    <span className="truncate max-w-[140px]">{exp.company}</span>
                    <span className="text-gray-400 text-[11px] font-normal">{exp.period}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-heading font-bold text-white mb-1.5 leading-snug">
                    {exp.role}
                  </h3>

                  <p className="text-gray-300 text-xs sm:text-sm font-body font-normal leading-relaxed mb-3 line-clamp-3">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {exp.skills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[10px] font-body font-normal rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================= MOBILE / TABLET VERTICAL TIMELINE ================= */}
        <div className="block lg:hidden relative py-4">
          <div className="absolute top-0 bottom-0 left-4 sm:left-6 w-[3px] bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              style={{
                scaleY: scaleLine,
                transformOrigin: "top",
              }}
              className="w-full h-full bg-gradient-to-b from-cyan-400 via-blue-400 to-purple-400 shadow-[0_0_15px_rgba(34,211,238,0.9)]"
            />
          </div>

          <div className="space-y-8 pl-12 sm:pl-16">
            {experiences.map((exp, index) => (
              <motion.div
                key={`mobile-${exp.id}`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-zinc-950/90 border border-cyan-500/30 p-5 rounded-2xl shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60"
              >
                <div className="absolute -left-[39px] sm:-left-[47px] top-6 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-cyan-400 shadow-[0_0_14px_rgba(34,211,238,1)]" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-body font-medium bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">
                    {exp.company}
                  </span>
                  <span className="text-xs text-gray-400 font-body flex items-center gap-1">
                    <Calendar size={12} />
                    {exp.period}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-heading font-bold text-white mb-1.5 leading-snug">{exp.role}</h3>

                <p className="text-gray-300 text-xs sm:text-sm font-body font-normal leading-relaxed mb-3">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {exp.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] sm:text-xs font-body font-normal rounded bg-zinc-900 text-cyan-300 border border-cyan-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
