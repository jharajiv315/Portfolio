import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function OverlayMenu({ isOpen, onClose }) {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 1024;

  const origin = isMobile ? "95% 5%" : "95% 5%";

  const menuItems = [
    "Home",
    "About",
    "Skills",
    "Projects",
    "Experience",
    "Testimonials",
    "Contact",
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            clipPath: `circle(0% at ${origin})`,
          }}
          animate={{
            clipPath: `circle(150% at ${origin})`,
          }}
          exit={{
            clipPath: `circle(0% at ${origin})`,
          }}
          transition={{
            duration: 0.7,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            backgroundColor: "rgba(0,0,0,0.95)",
          }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white text-3xl"
            aria-label="Close menu"
          >
            <FiX />
          </button>

          {/* Menu Items */}
          <ul className="space-y-6 text-center">
            {menuItems.map((item, index) => (
              <motion.li
                key={item}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
              >
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={onClose}
                  className="text-4xl text-white font-semibold hover:text-pink-400 transition-colors duration-300"
                >
                  {item}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
