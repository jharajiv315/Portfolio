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
  "Full-Stack Developer",
  "Aspiring AIML Engineer",
  "Software Developer",
  "Problem Solver",
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
        bg-black
        overflow-hidden
        flex
        items-center
      "
    >
      {/* ================= BACKGROUND ================= */}
      <ParticlesBackground />

      {/* LEFT GLOW */}
      <div
        className="
          absolute
          top-0
          left-0
          w-[70vw]
          sm:w-[50vw]
          md:w-[40vw]
          h-[70vh]
          sm:h-[50vh]
          md:h-[40vh]
          max-w-[500px]
          max-h-[500px]
          rounded-full
          bg-gradient-to-r
          from-[#302b63]
          via-[#00b8f8]
          to-[#1cd8d2]
          opacity-30
          sm:opacity-20
          md:opacity-10
          blur-[100px]
          sm:blur-[130px]
          md:blur-[150px]
          animate-pulse
          pointer-events-none
        "
      />

      {/* RIGHT GLOW */}
      <div
        className="
          absolute
          bottom-0
          right-0
          w-[70vw]
          sm:w-[50vw]
          md:w-[40vw]
          h-[70vh]
          sm:h-[50vh]
          md:h-[40vh]
          max-w-[500px]
          max-h-[500px]
          rounded-full
          bg-gradient-to-r
          from-[#302b63]
          via-[#00b8f8]
          to-[#1cd8d2]
          opacity-30
          sm:opacity-20
          md:opacity-10
          blur-[100px]
          sm:blur-[130px]
          md:blur-[150px]
          animate-pulse
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
            items-center
            justify-between
            gap-8
            lg:gap-12
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
            {/* ================= ROLE TYPEWRITER ================= */}
            <motion.div
              className="hero-role text-white min-h-[1.2em]"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
              }}
            >
              {roles[index].substring(0, subIndex)}
              <span
                className="
                  inline-block
                  w-[2px]
                  h-[1em]
                  ml-1
                  bg-white
                  animate-pulse
                  align-middle
                "
              />
            </motion.div>

            {/* ================= MAIN HEADING ================= */}
            <motion.h1
              className="mt-3 leading-[1.02] tracking-tight"
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
                className="block hero-greeting"
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
                className="block hero-title mt-1"
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

            {/* ================= PARAGRAPH ================= */}
            <motion.p
              className="mt-5 body-copy-large text-gray-300 max-w-xl leading-relaxed"
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
                "I turn complex ideas into seamless, high-impact web experiences — building modern, scalable, and intelligent applications that make a difference."}
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
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="
                  px-6
                  py-2.5
                  rounded-full
                  btn-label
                  text-white
                  bg-gradient-to-r
                  from-[#1cd8d2]
                  via-[#00b8f8]
                  to-[#302b63]
                  shadow-lg
                  hover:shadow-[0_0_30px_rgba(0,184,248,0.45)]
                  transition-all
                  duration-300
                "
              >
                View My Work
              </motion.a>

              {/* RESUME */}
              {hasValidResume ? (
                <motion.a
                  href={user.resume.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="
                    px-6
                    py-2.5
                    rounded-full
                    btn-label
                    text-black
                    bg-white
                    hover:bg-gray-200
                    shadow-lg
                    hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]
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
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="
                    px-6
                    py-2.5
                    rounded-full
                    btn-label
                    text-black
                    bg-white
                    hover:bg-gray-200
                    shadow-lg
                    hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]
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
                  scale: 1.18,
                  y: -3,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                className="
                  w-11
                  h-11
                  flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-white
                  text-lg
                  hover:text-white
                  hover:border-white/40
                  hover:bg-white/10
                  hover:shadow-[0_0_25px_rgba(255,255,255,0.45)]
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
                  scale: 1.18,
                  y: -3,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                className="
                  w-11
                  h-11
                  flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-white
                  text-xl
                  hover:text-[#0A66C2]
                  hover:border-[#0A66C2]/50
                  hover:bg-[#0A66C2]/10
                  hover:shadow-[0_0_25px_rgba(10,102,194,0.6)]
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
                  scale: 1.18,
                  y: -3,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                className="
                  w-11
                  h-11
                  flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-white
                  text-xl
                  hover:border-white/40
                  hover:bg-white/10
                  hover:shadow-[0_0_25px_rgba(255,255,255,0.45)]
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
                    scale: 1.18,
                    y: -3,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  className="
                    w-11
                    h-11
                    flex
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    text-white
                    text-lg
                    hover:text-[#20E6E9]
                    hover:border-[#20E6E9]/40
                    hover:bg-[#20E6E9]/10
                    hover:shadow-[0_0_25px_rgba(32,230,233,0.45)]
                    transition-all
                    duration-300
                  "
                >
                  <FaEnvelope />
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* ================= RIGHT AVATAR (3D ROBOT AVATAR FROM REFERENCE) ================= */}
          <motion.div
            className="
              hidden
              lg:flex
              lg:w-[42%]
              xl:w-[40%]
              items-center
              justify-center
              relative
            "
            initial={{
              opacity: 0,
              x: 80,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.5,
              duration: 1,
              ease: "easeOut",
            }}
          >
            {/* AVATAR GLOW */}
            <motion.div
              className="
                absolute
                w-[300px]
                h-[300px]
                xl:w-[430px]
                xl:h-[430px]
                rounded-full
                bg-[#00b8f8]
                opacity-15
                blur-[100px]
                pointer-events-none
              "
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.12, 0.22, 0.12],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* AVATAR IMAGE */}
            <motion.img
              src={developerMascot}
              alt="Rajiv Jha developer mascot"
              className="
                relative
                z-10
                w-full
                max-w-[360px]
                lg:max-w-[420px]
                xl:max-w-[480px]
                h-auto
                object-contain
                select-none
                drop-shadow-[0_10px_25px_rgba(0,184,248,0.15)]
              "
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
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
