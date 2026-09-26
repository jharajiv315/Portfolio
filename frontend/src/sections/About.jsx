import React from "react";
import { motion } from "framer-motion";
import developerMascot from "../assets/developer-mascot.png";

export default function About({ user }) {
  const avatarSrc = user?.avatar?.url || developerMascot;

  return (
    <section
      id="about"
      className="relative min-h-screen overflow-hidden bg-[#FAF7F2] text-[#1C1917]"
    >
      {/* ================= BACKGROUND GLOWS ================= */}
      <div
        className="
          pointer-events-none
          absolute
          left-[-150px]
          top-[60px]
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#EFE7D8]/70
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-150px]
          bottom-[-80px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#E8DFC8]/60
          blur-[140px]
        "
      />

      {/* ================= MAIN CONTAINER ================= */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24">
        {/* ================= PROFILE ================= */}
        <motion.div
          className="
            flex
            flex-col
            items-center
            gap-8
            md:flex-row
            md:items-start
          "
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* ================= PROFILE IMAGE ================= */}
          <div className="shrink-0 w-full sm:w-64 md:w-72 max-w-[280px]">
            <div className="relative aspect-[3/4] w-full rounded-3xl border border-[#E8E1D5] bg-white shadow-lg overflow-hidden group">
              <img
                src={avatarSrc}
                alt={user?.fullName || "Rajiv Jha"}
                className={`w-full h-full ${
                  avatarSrc === developerMascot ? "object-contain p-6" : "object-cover object-top"
                } transition-transform duration-500 group-hover:scale-103`}
                onError={(e) => {
                  e.currentTarget.src = developerMascot;
                }}
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5 pointer-events-none" />
            </div>
          </div>

          {/* ================= PROFILE DETAILS ================= */}
          <div className="flex-1">
            {/* NAME */}
            <h2 className="mb-1 font-serif font-bold text-3xl sm:text-4xl text-[#1C1917] tracking-tight">
              {user?.fullName || "Rajiv Jha"}
            </h2>

            {/* ROLE */}
            <h3 className="mb-4 text-sm sm:text-base font-sans font-medium text-[#B84A1C]">
              Computer Science Student · Aspiring AIML Engineer
            </h3>

            {/* DESCRIPTION */}
            <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-[#57534E]">
              {user?.aboutMe ||
                "I'm a B.Tech Computer Science student focused on becoming an AIML Engineer. I enjoy building software across the full stack, working with data, learning machine learning, and solving algorithmic problems."}
            </p>

            <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-[#57534E]">
              My technical path is grounded in strong problem-solving fundamentals with Java & DSA, Python for data and machine learning, and modern full-stack development with React, Node.js, and PostgreSQL.
            </p>

            {/* ================= INFO CARDS ================= */}
            <div
              className="
                mt-7
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-3
              "
            >
              {/* EXPERIENCE CARD */}
              <div
                className="
                  rounded-xl
                  border
                  border-[#E8E1D5]
                  bg-white/90
                  px-5
                  py-4
                  text-center
                  shadow-xs
                  transition-all
                  duration-300
                  hover:border-[#B84A1C]/40
                  hover:shadow-md
                "
              >
                <p className="text-xs font-sans font-medium text-[#78716C] uppercase tracking-wider">Experience</p>
                <p className="mt-1 font-sans font-semibold text-sm sm:text-base text-[#1C1917]">Building Real Projects</p>
              </div>

              {/* SPECIALITY CARD */}
              <div
                className="
                  rounded-xl
                  border
                  border-[#E8E1D5]
                  bg-white/90
                  px-5
                  py-4
                  text-center
                  shadow-xs
                  transition-all
                  duration-300
                  hover:border-[#B84A1C]/40
                  hover:shadow-md
                "
              >
                <p className="text-xs font-sans font-medium text-[#78716C] uppercase tracking-wider">Speciality</p>
                <p className="mt-1 font-sans font-semibold text-sm sm:text-base text-[#1C1917]">AIML + Full-Stack</p>
              </div>

              {/* FOCUS CARD */}
              <div
                className="
                  rounded-xl
                  border
                  border-[#E8E1D5]
                  bg-white/90
                  px-5
                  py-4
                  text-center
                  shadow-xs
                  transition-all
                  duration-300
                  hover:border-[#B84A1C]/40
                  hover:shadow-md
                "
              >
                <p className="text-xs font-sans font-medium text-[#78716C] uppercase tracking-wider">Focus</p>
                <p className="mt-1 font-sans font-semibold text-sm sm:text-base text-[#1C1917]">DSA & Production AI</p>
              </div>
            </div>

            {/* ================= BUTTONS ================= */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="
                  rounded-full
                  bg-[#B84A1C]
                  px-6
                  py-2.5
                  font-medium
                  text-sm
                  text-white
                  hover:bg-[#A03D14]
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  duration-300
                  hover:scale-102
                "
              >
                View Projects
              </a>

              {user?.resume?.url &&
                user.resume.url.trim() !== "" &&
                !user.resume.url.includes("[ADD RESUME") && (
                  <a
                    href={user.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      rounded-full
                      border
                      border-[#B84A1C]/30
                      bg-[#B84A1C]/5
                      px-6
                      py-2.5
                      font-medium
                      text-sm
                      text-[#B84A1C]
                      hover:bg-[#B84A1C]
                      hover:text-white
                      shadow-xs
                      hover:shadow-sm
                      transition-all
                      duration-300
                      inline-flex
                      items-center
                      gap-1.5
                    "
                  >
                    <span>My Resume</span>
                    <span className="text-xs">↗</span>
                  </a>
                )}

              <a
                href="#contact"
                className="
                  rounded-full
                  border
                  border-[#E8E1D5]
                  bg-white/80
                  px-6
                  py-2.5
                  font-medium
                  text-sm
                  text-[#1C1917]
                  hover:bg-white
                  hover:border-[#1C1917]/30
                  shadow-xs
                  hover:shadow-sm
                  transition-all
                  duration-300
                "
              >
                Get in Touch
              </a>
            </div>
          </div>
        </motion.div>

        {/* ================= ABOUT ME CONTENT ================= */}
        <motion.div
          className="mt-16 pt-10 border-t border-[#E8E1D5]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.15,
          }}
        >
          <h2 className="mb-5 font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#1C1917]">
            About <span className="text-[#B84A1C] italic font-serif">Me</span>
          </h2>

          <p className="max-w-4xl text-sm sm:text-base leading-relaxed text-[#57534E]">
            I'm a B.Tech Computer Science Engineering student (2025–2029) focused on software engineering, data systems, and algorithmic problem-solving.
          </p>

          <p className="mt-4 max-w-4xl text-sm sm:text-base leading-relaxed text-[#57534E]">
            I learn by building real projects, understanding the mathematical and algorithmic fundamentals behind technology, and continuously iterating. My projects span intelligent full-stack systems, automated guidance tools, and scalable web backends.
          </p>

          <p className="mt-4 max-w-4xl text-sm sm:text-base leading-relaxed text-[#57534E]">
            Currently, I am diving deep into advanced Data Structures & Algorithms in Java (graphs, backtracking, dynamic programming), alongside exploring practical machine learning workflows with Python, NumPy, Pandas, and PostgreSQL.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
