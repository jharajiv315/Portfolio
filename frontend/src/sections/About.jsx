import React from "react";
import { motion } from "framer-motion";

export default function About({ user }) {
  const avatarSrc = user?.avatar?.url || "/me.jpg";

  return (
    <section
      id="about"
      className="relative min-h-screen overflow-hidden bg-black text-white"
    >
      {/* ================= BACKGROUND GLOWS ================= */}
      <div
        className="
          pointer-events-none
          absolute
          left-[-180px]
          top-[80px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-500/20
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-180px]
          bottom-[-100px]
          h-[550px]
          w-[550px]
          rounded-full
          bg-cyan-500/20
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[35%]
          top-[40%]
          h-[250px]
          w-[250px]
          rounded-full
          bg-purple-500/10
          blur-[120px]
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
          <div className="shrink-0">
            <img
              src={avatarSrc}
              alt={user?.fullName || "Rajiv Jha"}
              className="
                h-40
                w-40
                rounded-xl
                border
                border-cyan-400/30
                object-cover
                shadow-[0_0_35px_rgba(34,211,238,0.15)]
              "
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1534972195531-a756b11269d5?q=80&w=800&auto=format&fit=crop";
              }}
            />
          </div>

          {/* ================= PROFILE DETAILS ================= */}
          <div className="flex-1">
            {/* NAME */}
            <h2 className="mb-2 font-heading font-bold text-3xl sm:text-4xl md:text-4xl text-cyan-400 tracking-tight">
              {user?.fullName || "Rajiv Jha"}
            </h2>

            {/* ROLE */}
            <h3 className="mb-4 text-base sm:text-lg font-body font-medium text-gray-200">
              Computer Science Student · Aspiring AIML Engineer
            </h3>

            {/* DESCRIPTION */}
            <p className="max-w-3xl body-copy leading-relaxed text-gray-300">
              {user?.aboutMe ||
                "I'm a B.Tech Computer Science student focused on becoming an AIML Engineer. I enjoy building software across the full stack, working with data, learning machine learning, and solving algorithmic problems."}
            </p>

            <p className="mt-3 max-w-3xl body-copy leading-relaxed text-gray-300">
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
                  border-white/10
                  bg-white/[0.03]
                  px-5
                  py-4
                  text-center
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:border-cyan-400/40
                  hover:bg-white/[0.05]
                "
              >
                <p className="text-xs font-body font-normal text-gray-400 uppercase tracking-wider">Experience</p>
                <p className="mt-1 font-body font-semibold text-sm sm:text-base text-white">Building Real Projects</p>
              </div>

              {/* SPECIALITY CARD */}
              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-5
                  py-4
                  text-center
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:border-cyan-400/40
                  hover:bg-white/[0.05]
                "
              >
                <p className="text-xs font-body font-normal text-gray-400 uppercase tracking-wider">Speciality</p>
                <p className="mt-1 font-body font-semibold text-sm sm:text-base text-white">AIML + Full-Stack</p>
              </div>

              {/* FOCUS CARD */}
              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-5
                  py-4
                  text-center
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:border-cyan-400/40
                  hover:bg-white/[0.05]
                "
              >
                <p className="text-xs font-body font-normal text-gray-400 uppercase tracking-wider">Focus</p>
                <p className="mt-1 font-body font-semibold text-sm sm:text-base text-white">DSA & Production AI</p>
              </div>
            </div>

            {/* ================= BUTTONS ================= */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="
                  rounded-lg
                  bg-white
                  px-5
                  py-2.5
                  btn-label
                  text-black
                  transition-transform
                  duration-300
                  hover:scale-105
                "
              >
                View Projects
              </a>

              <a
                href="#contact"
                className="
                  rounded-lg
                  border
                  border-white/20
                  bg-white/[0.03]
                  px-5
                  py-2.5
                  btn-label
                  text-white
                  transition-all
                  duration-300
                  hover:border-cyan-400/40
                  hover:bg-white/10
                "
              >
                Get in Touch
              </a>
            </div>
          </div>
        </motion.div>

        {/* ================= ABOUT ME CONTENT ================= */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.15,
          }}
        >
          <h2 className="mb-4 section-heading text-2xl sm:text-3xl md:text-4xl">
            About <span className="text-cyan-400">Me</span>
          </h2>

          <p className="max-w-4xl body-copy leading-relaxed text-gray-300">
            I'm a B.Tech Computer Science Engineering student (2025–2029) focused on software engineering, data systems, and algorithmic problem-solving.
          </p>

          <p className="mt-4 max-w-4xl body-copy leading-relaxed text-gray-300">
            I learn by building real projects, understanding the mathematical and algorithmic fundamentals behind technology, and continuously iterating. My projects span intelligent full-stack systems, automated guidance tools, and scalable web backends.
          </p>

          <p className="mt-4 max-w-4xl body-copy leading-relaxed text-gray-300">
            Currently, I am diving deep into advanced Data Structures & Algorithms in Java (graphs, backtracking, dynamic programming), alongside exploring practical machine learning workflows with Python, NumPy, Pandas, and PostgreSQL.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
