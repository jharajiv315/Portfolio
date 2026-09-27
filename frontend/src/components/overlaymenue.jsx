import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function OverlayMenu({ isOpen, onClose }) {
  const menuItems = [
    "Home",
    "About",
    "Skills",
    "Projects",
    "Experience",
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            backgroundColor: "rgba(250, 247, 242, 0.98)",
          }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center backdrop-blur-xl px-6 pt-24 pb-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Menu Items Container */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-col items-center w-full max-w-sm"
          >
            <ul className="space-y-2 sm:space-y-3 text-center mb-8 w-full">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.03 * index,
                    duration: 0.18,
                    ease: "easeOut",
                  }}
                >
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={onClose}
                    className="inline-block py-2.5 px-6 min-h-[44px] text-2xl sm:text-3xl text-[#1C1917] font-serif font-bold hover:text-[#B84A1C] transition-colors duration-150 tracking-tight active:scale-95"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * menuItems.length, duration: 0.2 }}
            >
              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-[#B84A1C] hover:bg-[#9C3E16] text-white px-7 py-3 min-h-[44px] rounded-full font-sans font-medium shadow-md shadow-[#B84A1C]/25 text-sm active:scale-95 transition-all"
              >
                Reach Out
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
