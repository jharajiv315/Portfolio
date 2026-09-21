import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer({ user }) {
  const currentYear = new Date().getFullYear();
  const fullName = user?.fullName || "Rajiv Jha";

  return (
    <footer className="relative w-full bg-black py-20 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
      {/* Ambient center glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/15 blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Large Prominent Name */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl font-heading font-semibold text-white tracking-tight mb-6"
        >
          {fullName}
        </motion.h2>

        {/* Social Icons Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center gap-6 text-lg sm:text-xl text-gray-400 mb-6"
        >
          {user?.twitterURL && (
            <a
              href={user.twitterURL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200 hover:scale-110 transform"
              aria-label="Twitter / X"
            >
              <FaXTwitter />
            </a>
          )}
          {user?.linkedInURL && (
            <a
              href={user.linkedInURL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors duration-200 hover:scale-110 transform"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          )}
          {user?.githubURL && (
            <a
              href={user.githubURL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200 hover:scale-110 transform"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          )}
        </motion.div>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-xs sm:text-sm font-body font-normal text-gray-400 italic mb-3 max-w-md"
        >
          "Success is when preparation meets opportunity."
        </motion.p>

        {/* Copyright */}
        <p className="text-xs font-body font-normal text-gray-500">
          © {currentYear} {fullName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
