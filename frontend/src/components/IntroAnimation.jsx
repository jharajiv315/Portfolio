import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function IntroAnimation({ onFinish, onComplete }) {
  const handleDone = onFinish || onComplete || (() => {});

  const greetings = [
    "Hello",
    "नमस्ते",
    "Bonjour",
    "Ciao",
    "Olá",
    "Здравствуйте",
    "مرحباً",
    "Hola",
    "Hallo",
    "Salam",
  ];

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (index < greetings.length - 1) {
      const interval = setInterval(() => {
        setIndex((prev) => prev + 1);
      }, 180);

      return () => clearInterval(interval);
    }

    const timer = setTimeout(() => {
      setVisible(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [index, greetings.length]);

  return (
    <AnimatePresence onExitComplete={handleDone}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: {
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.h1
              key={index}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.12,
                ease: "easeOut",
              }}
            >
              {greetings[index]}
            </motion.h1>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
