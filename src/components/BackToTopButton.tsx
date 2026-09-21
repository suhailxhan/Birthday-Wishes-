import React, { useState, useEffect } from "react";
import { ArrowUp, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BackToTopButtonProps {
  threshold?: number;
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({ threshold = 380 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Past the hero section threshold
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="back-to-top-container"
          className="fixed bottom-20 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-40"
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <button
            id="back-to-top-button"
            onClick={scrollToTop}
            aria-label="Back to Top"
            className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#170c24]/90 hover:bg-rose-950/95 border border-rose-500/40 hover:border-rose-400 text-rose-200 hover:text-white shadow-xl shadow-black/60 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
          >
            <div className="w-6 h-6 rounded-full bg-rose-600/40 group-hover:bg-rose-600 flex items-center justify-center transition-colors">
              <ArrowUp className="w-3.5 h-3.5 text-rose-200 group-hover:text-white transition-transform group-hover:-translate-y-0.5" />
            </div>
            <span className="text-xs font-sans-romantic font-medium tracking-wide pr-1">
              Back to Top
            </span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400/40 group-hover:fill-rose-400 transition-all opacity-70 group-hover:opacity-100" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
