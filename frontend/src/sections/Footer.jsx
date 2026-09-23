import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer({ user }) {
  const currentYear = new Date().getFullYear();
  const fullName = user?.fullName || "Rajiv Jha";

  return (
    <footer className="relative w-full bg-[#F3EFE6] border-t border-[#E8E1D5] py-20 px-4 sm:px-6 lg:px-8 text-[#1C1917] overflow-hidden">
      {/* Ambient center warm glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#E8DFC8]/40 blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Large Prominent Name */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] tracking-tight mb-6"
        >
          {fullName}
        </motion.h2>

        {/* Social Icons Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center gap-6 text-lg sm:text-xl text-[#57534E] mb-6"
        >
          <a
            href={user?.twitterURL || "https://twitter.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#B84A1C] transition-colors duration-200 hover:scale-110 transform"
            aria-label="Twitter / X"
          >
            <FaXTwitter />
          </a>
          <a
            href={user?.linkedInURL || "https://linkedin.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0A66C2] transition-colors duration-200 hover:scale-110 transform"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href={user?.githubURL || "https://github.com/jharajiv315"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1C1917] transition-colors duration-200 hover:scale-110 transform"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </motion.div>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-xs sm:text-sm font-serif italic text-[#78716C] mb-3 max-w-md"
        >
          "Success is when preparation meets opportunity."
        </motion.p>

        {/* Copyright */}
        <p className="text-xs font-sans text-[#A8A29E]">
          © {currentYear} {fullName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
