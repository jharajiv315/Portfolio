import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";

import ParticlesBackground from "../components/ParticleBackground";
import developerMascot from "../assets/developer-mascot.png";

const defaultRoles = [
  "Computer Science Student · Aspiring AI/ML Engineer",
  "Full-Stack Developer · Problem Solver",
  "Software Developer · Creative Technologist",
];

export default function Home({ user }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const roles = defaultRoles;

  useEffect(() => {
    const currentRole = roles[index];

    const timeout = setTimeout(
      () => {
        if (!deleting && subIndex < currentRole.length) {
          setSubIndex((prev) => prev + 1);
        } else if (!deleting && subIndex === currentRole.length) {
          setDeleting(true);
        } else if (deleting && subIndex > 0) {
          setSubIndex((prev) => prev - 1);
        } else if (deleting && subIndex === 0) {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % roles.length);
        }
      },
      deleting
        ? 60
        : subIndex === currentRole.length
        ? 1200
        : 100
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, roles]);

  const hasValidResume =
    user?.resume &&
    user.resume.url &&
    user.resume.url.trim() !== "" &&
    !user.resume.url.includes("[ADD RESUME");

  return (
    <section
      id="home"
      className="
        relative
        w-full
        min-h-screen
        bg-[#FAF7F2]
        overflow-hidden
        flex
        items-center
      "
    >
      {/* ================= BACKGROUND ================= */}
      <ParticlesBackground />

      {/* SUBTLE WARM AMBIENT GLOW TOP-LEFT */}
      <div
        className="
          absolute
          top-0
          left-0
          w-[60vw]
          max-w-[500px]
          h-[50vh]
          max-h-[500px]
          rounded-full
          bg-gradient-to-br
          from-[#EFE7D8]/60
          via-[#F5EFEB]/30
          to-transparent
          blur-[100px]
          pointer-events-none
        "
      />

      {/* SUBTLE WARM AMBIENT GLOW BOTTOM-RIGHT */}
      <div
        className="
          absolute
          bottom-0
          right-0
          w-[60vw]
          max-w-[500px]
          h-[50vh]
          max-h-[500px]
          rounded-full
          bg-gradient-to-tl
          from-[#E8DFC8]/50
          via-[#F3ECE2]/20
          to-transparent
          blur-[120px]
          pointer-events-none
        "
      />

      {/* ================= HERO CONTAINER WITH PADDING-TOP FOR FIXED NAVBAR ================= */}
      <div
        className="
          relative
          z-10
          w-full
          min-h-screen
          max-w-7xl
          mx-auto
          px-6
          sm:px-10
          md:px-16
          lg:px-20
          pt-28
          sm:pt-32
          pb-16
          flex
          items-center
        "
      >
        {/* ================= MAIN ROW ================= */}
        <div
          className="
            w-full
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-12
            lg:gap-14
          "
        >
          {/* ================= LEFT CONTENT ================= */}
          <div
            className="
              w-full
              lg:w-[58%]
              xl:w-[60%]
            "
          >
            {/* STATUS PILL */}
            <motion.div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E8E1D5] shadow-xs text-xs font-medium text-[#1C1917] mb-5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-2 h-2 rounded-full bg-[#B84A1C] animate-pulse"></span>
              <span>Available for opportunities</span>
            </motion.div>

            {/* ================= MAIN HEADING ================= */}
            <motion.h1
              className="mt-2 leading-[1.05] tracking-tight font-serif"
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.8,
              }}
            >
              {/* HELLO I'M */}
              <motion.span
                className="block text-[#1C1917] text-3xl sm:text-4xl md:text-5xl font-light italic font-serif"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                }}
              >
                Hello I'm
              </motion.span>

              {/* NAME */}
              <motion.span
                className="block text-[#B84A1C] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mt-1 tracking-tight"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                  duration: 0.8,
                }}
              >
                {user?.fullName || "Rajiv Jha"}
              </motion.span>
            </motion.h1>

            {/* ================= SUBTITLE / ROLE TYPEWRITER (MATCHING MOCKUP) ================= */}
            <motion.div
              className="mt-3 text-[#1C1917]/90 font-medium text-base sm:text-lg md:text-xl flex items-center min-h-[1.5em]"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.6,
                duration: 0.8,
              }}
            >
              <span>{roles[index].substring(0, subIndex)}</span>
              <span
                className="
                  inline-block
                  w-[2px]
                  h-[1.1em]
                  ml-1
                  bg-[#B84A1C]
                  animate-pulse
                  align-middle
                "
              />
            </motion.div>

            {/* ================= PARAGRAPH ================= */}
            <motion.p
              className="mt-5 text-[#57534E] text-base sm:text-lg max-w-xl leading-relaxed font-sans"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7,
                duration: 0.8,
              }}
            >
              {user?.aboutMe ||
                "I'm a B.Tech Computer Science student focused on becoming an AI/ML Engineer. I enjoy building software across the full stack, working with data, learning machine learning, and solving algorithmic problems. My approach is simple: understand the fundamentals, build real projects, learn from what breaks, and continuously improve."}
            </motion.p>

            {/* ================= BUTTONS ================= */}
            <motion.div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                justify-start
                gap-4
              "
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.9,
                duration: 0.8,
              }}
            >
              {/* VIEW MY WORK */}
              <motion.a
                href="#projects"
                whileHover={{
                  scale: 1.03,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="
                  px-7
                  py-3
                  rounded-full
                  font-medium
                  text-sm
                  text-white
                  bg-[#B84A1C]
                  hover:bg-[#A03D14]
                  shadow-md
                  hover:shadow-[0_8px_20px_rgba(184,74,28,0.25)]
                  transition-all
                  duration-300
                  flex
                  items-center
                  gap-2
                "
              >
                <span>View My Work</span>
                <span>→</span>
              </motion.a>

              {/* RESUME */}
              {hasValidResume ? (
                <motion.a
                  href={user.resume.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="
                    px-7
                    py-3
                    rounded-full
                    font-medium
                    text-sm
                    text-[#1C1917]
                    bg-white/80
                    hover:bg-white
                    border
                    border-[#E8E1D5]
                    shadow-xs
                    hover:shadow-md
                    transition-all
                    duration-300
                  "
                >
                  My Resume
                </motion.a>
              ) : (
                <motion.a
                  href="#contact"
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="
                    px-7
                    py-3
                    rounded-full
                    font-medium
                    text-sm
                    text-[#1C1917]
                    bg-white/80
                    hover:bg-white
                    border
                    border-[#E8E1D5]
                    shadow-xs
                    hover:shadow-md
                    transition-all
                    duration-300
                  "
                >
                  My Resume
                </motion.a>
              )}
            </motion.div>

            {/* ================= SOCIAL ICONS ================= */}
            <motion.div
              className="
                mt-7
                flex
                items-center
                gap-3.5
              "
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.1,
                duration: 0.8,
              }}
            >
              {/* X / TWITTER */}
              <motion.a
                href={user?.twitterURL || "https://x.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                whileHover={{
                  scale: 1.1,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E8E1D5]
                  bg-white/80
                  text-[#1C1917]
                  text-base
                  hover:text-[#B84A1C]
                  hover:border-[#B84A1C]/50
                  hover:bg-white
                  hover:shadow-sm
                  transition-all
                  duration-300
                "
              >
                <FaXTwitter />
              </motion.a>

              {/* LINKEDIN */}
              <motion.a
                href={user?.linkedInURL || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                whileHover={{
                  scale: 1.1,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E8E1D5]
                  bg-white/80
                  text-[#1C1917]
                  text-base
                  hover:text-[#0A66C2]
                  hover:border-[#0A66C2]/40
                  hover:bg-white
                  hover:shadow-sm
                  transition-all
                  duration-300
                "
              >
                <FaLinkedinIn />
              </motion.a>

              {/* GITHUB */}
              <motion.a
                href={user?.githubURL || "https://github.com/jharajiv315"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                whileHover={{
                  scale: 1.1,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E8E1D5]
                  bg-white/80
                  text-[#1C1917]
                  text-base
                  hover:text-[#1C1917]
                  hover:border-[#1C1917]/50
                  hover:bg-white
                  hover:shadow-sm
                  transition-all
                  duration-300
                "
              >
                <FaGithub />
              </motion.a>

              {/* EMAIL */}
              {user?.email && (
                <motion.a
                  href={`mailto:${user.email}`}
                  aria-label="Email"
                  whileHover={{
                    scale: 1.1,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#E8E1D5]
                    bg-white/80
                    text-[#1C1917]
                    text-base
                    hover:text-[#B84A1C]
                    hover:border-[#B84A1C]/50
                    hover:bg-white
                    hover:shadow-sm
                    transition-all
                    duration-300
                  "
                >
                  <FaEnvelope />
                </motion.a>
              )}
            </motion.div>

            {/* ================= EDITORIAL STATS ROW (MATCHING REFERENCE MOCKUP) ================= */}
            <motion.div
              className="
                mt-12
                pt-6
                border-t
                border-[#E8E1D5]
                flex
                flex-wrap
                items-center
                gap-4
                sm:gap-8
                text-xs
                sm:text-sm
                text-[#57534E]
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-[#1C1917] text-base font-serif">3+</span>
                <span>Projects</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-[#D8C7B0]"></span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-[#1C1917] text-base font-serif">2x</span>
                <span>Hackathon Finalist</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-[#D8C7B0]"></span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-[#1C1917] text-base font-serif">5+</span>
                <span>Technologies</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-[#D8C7B0]"></span>
              <span className="font-serif italic text-[#B84A1C] font-medium">∞ Learning</span>

              {/* MOUSE SCROLL INDICATOR (FROM REFERENCE MOCKUP) */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#78716C] ml-auto">
                <div className="w-4 h-6 rounded-full border border-[#78716C]/60 flex items-start justify-center p-1">
                  <div className="w-1 h-1.5 rounded-full bg-[#B84A1C] animate-bounce" />
                </div>
                <span>Scroll to explore</span>
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT AVATAR WITH ARCHITECTURAL ARCH ================= */}
          <motion.div
            className="
              flex
              w-full
              lg:w-[42%]
              xl:w-[40%]
              items-end
              justify-center
              relative
              pt-8
            "
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
              duration: 1,
              ease: "easeOut",
            }}
          >
            {/* ARCHITECTURAL ARCH BACKDROP (AS SEEN IN REFERENCE MOCKUP) */}
            <div
              className="
                absolute
                w-[300px]
                sm:w-[380px]
                lg:w-[390px]
                xl:w-[430px]
                h-[380px]
                sm:h-[480px]
                lg:h-[500px]
                xl:h-[530px]
                rounded-t-full
                bg-gradient-to-b
                from-[#ECE4D4]
                via-[#F6F0E6]
                to-[#FAF7F2]
                border
                border-[#E2D6C3]
                shadow-sm
                bottom-0
                pointer-events-none
              "
            />

            {/* AVATAR IMAGE */}
            <motion.img
              src={developerMascot}
              alt="Rajiv Jha developer avatar"
              className="
                relative
                z-10
                w-full
                max-w-[320px]
                sm:max-w-[380px]
                lg:max-w-[420px]
                xl:max-w-[460px]
                h-auto
                object-contain
                select-none
                drop-shadow-[0_20px_35px_rgba(28,25,23,0.14)]
              "
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
