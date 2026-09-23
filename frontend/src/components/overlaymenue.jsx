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
            backgroundColor: "rgba(250, 247, 242, 0.98)",
          }}
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[#1C1917] hover:text-[#B84A1C] text-3xl transition-colors p-2"
            aria-label="Close menu"
          >
            <FiX />
          </button>

          {/* Menu Items & Action */}
          <div className="flex flex-col items-center">
            <ul className="space-y-4 sm:space-y-5 text-center mb-8">
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
                    delay: index * 0.07,
                  }}
                >
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={onClose}
                    className="text-2xl sm:text-3xl text-[#1C1917] font-serif font-bold hover:text-[#B84A1C] transition-colors duration-200 tracking-tight"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: menuItems.length * 0.07 }}
            >
              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-[#B84A1C] hover:bg-[#9C3E16] text-white px-7 py-2.5 rounded-full font-sans font-medium shadow-md shadow-[#B84A1C]/25 text-sm active:scale-95 transition-all"
              >
                Reach Out
              </a>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
