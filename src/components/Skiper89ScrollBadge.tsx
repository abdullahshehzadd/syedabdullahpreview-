import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { ArrowUp, Utensils, Sparkles, Star } from 'lucide-react';

export const Skiper89ScrollBadge: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.5,
    restDelta: 0.001
  });

  const [percent, setPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      const p = Math.round(latest * 100);
      setPercent(p);
      setIsVisible(p > 3);
    });
  }, [smoothProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-5 z-40 flex flex-col items-end gap-2 select-none">
      {/* Quick Navigation Drawer Popup */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-[#012F13]/95 backdrop-blur-xl border border-[#8BC53D]/40 rounded-2xl p-2 shadow-2xl space-y-1 mb-1 min-w-[170px]"
          >
            <button
              onClick={() => scrollToSection('signature-showcase')}
              className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#E2F0CC] hover:bg-[#8BC53D] hover:text-[#011207] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8BC53D]" />
              <span>Chef's Signatures</span>
            </button>
            <button
              onClick={() => scrollToSection('signature-deals')}
              className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#E2F0CC] hover:bg-[#8BC53D] hover:text-[#011207] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8BC53D]" />
              <span>Deals & Combos</span>
            </button>
            <button
              onClick={() => scrollToSection('menu-section')}
              className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#E2F0CC] hover:bg-[#8BC53D] hover:text-[#011207] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5 text-[#8BC53D]" />
              <span>Full Food Menu</span>
            </button>
            <button
              onClick={() => scrollToSection('google-reviews')}
              className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#E2F0CC] hover:bg-[#8BC53D] hover:text-[#011207] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 text-[#8BC53D]" />
              <span>Google Reviews</span>
            </button>
            <div className="border-t border-[#8BC53D]/20 pt-1 mt-1">
              <button
                onClick={scrollToTop}
                className="w-full px-3 py-2 rounded-xl text-left text-xs font-black text-[#8BC53D] hover:bg-[#8BC53D]/20 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Return to Top</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Back to Top / Quick Nav Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="group relative flex items-center gap-2 bg-[#012F13] hover:bg-[#073B1B] text-white px-3.5 py-2.5 rounded-full border border-[#8BC53D]/40 shadow-xl transition-all active:scale-95 cursor-pointer"
        title="Quick Navigation & Scroll to Top"
      >
        <span className="text-xs font-mono font-bold text-[#8BC53D]">{percent}%</span>
        <ArrowUp className="w-4 h-4 text-white group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
};
