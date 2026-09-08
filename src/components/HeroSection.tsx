import React from 'react';
import { ChevronDown, Sparkles, Utensils, ArrowRight, Clock, Star } from 'lucide-react';
import animatedWebpFeathered from '../assets/images/pizza_cheese_pull_feathered.webp';

interface HeroSectionProps {
  onScrollToMenu?: () => void;
  onOpenHoursModal?: () => void;
  onSelectFeaturedItem?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToMenu,
  onOpenHoursModal,
  onSelectFeaturedItem,
}) => {
  const handleScrollToNext = () => {
    if (onScrollToMenu) {
      onScrollToMenu();
    } else {
      const menuEl = document.getElementById('menu-section');
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="hero-section"
      className="relative w-full min-h-[85vh] lg:min-h-[90vh] bg-[#011207] text-[#E2F0CC] overflow-hidden select-none flex flex-col justify-center items-center py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Sage Green Screen Backdrop & Ambient Glow Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[580px] md:w-[680px] h-[320px] sm:h-[580px] md:h-[680px] bg-[#8BC53D]/16 rounded-full blur-[100px] sm:blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[440px] h-[240px] sm:h-[440px] bg-[#4E8752]/20 rounded-full blur-[80px] sm:blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(1,18,7,0.85)_85%)]" />
      </div>

      {/* Main Content Layout Container */}
      <div data-reveal className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* 1. Top Badges & Live Status */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#011207]/80 backdrop-blur-md border border-[#8BC53D]/40 text-[#8BC53D] text-xs font-black uppercase tracking-widest shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <Sparkles className="w-3.5 h-3.5 fill-current text-[#8BC53D]" />
            <span>Artisan Woodfired Experience</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#012F13]/80 border border-[#8BC53D]/25 text-[#E2F0CC] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#8BC53D] animate-ping" />
            <span>450°C Stone Oven Live</span>
          </div>
        </div>

        {/* 2. Main High-Contrast Headline */}
        <div className="mb-3 sm:mb-5">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white lowercase italic tracking-tight drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)] leading-none select-text">
            smash & <span className="text-[#8BC53D] drop-shadow-[0_0_40px_rgba(139,197,61,0.65)]">woodfire</span>
          </h1>
        </div>

        {/* 3. Static Prominent Pizza Image Container with Radial Drop-Shadow & Breathing Float Animation */}
        <div className="relative my-2 sm:my-4 flex flex-col items-center">
          <div className="relative w-[280px] min-[400px]:w-[320px] sm:w-[380px] md:w-[460px] lg:w-[500px] aspect-square mx-auto animate-float-pizza [filter:drop-shadow(0_20px_25px_rgba(0,0,0,0.5))]">
            <img
              src={animatedWebpFeathered}
              alt="Artisan woodfired pizza with molten mozzarella cheese pull"
              className="w-full h-full object-contain select-none"
              loading="eager"
            />
          </div>

          {/* Radial ground contact shadow */}
          <div className="w-44 min-[400px]:w-56 sm:w-72 md:w-84 h-5 sm:h-7 bg-black/65 rounded-full blur-md sm:blur-lg animate-float-shadow -mt-4 sm:-mt-6 pointer-events-none z-0" />
        </div>

        {/* 4. High-Contrast Subtext */}
        <div className="max-w-xl sm:max-w-2xl mx-auto px-2 mt-2 sm:mt-4">
          <p className="text-base sm:text-lg md:text-xl text-[#E2F0CC] font-medium tracking-wide lowercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed">
            slow-fermented 48h sourdough crust, San Marzano reduction & molten buffalo mozzarella pulled to perfection.
          </p>
        </div>

        {/* 5. Call-To-Action (CTA) Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          {/* Primary CTA: Explore Menu */}
          <button
            onClick={onScrollToMenu}
            className="group px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#8BC53D] hover:bg-[#9de045] text-[#011207] font-black text-sm sm:text-base tracking-wide flex items-center gap-2.5 transition-all duration-300 shadow-[0_10px_25px_rgba(139,197,61,0.4)] active:scale-95 cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-[#011207]" />
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA: Chef's Specials */}
          {onSelectFeaturedItem && (
            <button
              onClick={onSelectFeaturedItem}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#012F13]/90 hover:bg-[#012F13] text-white hover:text-[#8BC53D] border border-[#8BC53D]/40 hover:border-[#8BC53D] font-bold text-sm sm:text-base tracking-wide flex items-center gap-2 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.5)] backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#8BC53D]" />
              <span>Chef's Specials</span>
            </button>
          )}

          {/* Info Modal CTA */}
          {onOpenHoursModal && (
            <button
              onClick={onOpenHoursModal}
              className="px-4 py-2 rounded-full bg-[#011207]/80 hover:bg-[#012F13] text-[#8BC53D] text-xs font-mono font-medium border border-[#8BC53D]/25 transition-all cursor-pointer flex items-center gap-1.5 hover:border-[#8BC53D]/50"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Hours & Location</span>
            </button>
          )}
        </div>

        {/* 6. Quick Delivery & Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-[#E2F0CC]/80 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8BC53D]" />
            <span>25–35 Min Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-[#8BC53D] text-[#8BC53D]" />
            <span>Your Rating Appears Here</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8BC53D]" />
            <span>100% Halal Certified</span>
          </div>
        </div>

        {/* 7. Scroll Prompt */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-2">
          <button
            onClick={handleScrollToNext}
            className="group px-6 py-3 rounded-full bg-[#012F13]/90 hover:bg-[#8BC53D] text-white hover:text-[#011207] border border-[#8BC53D]/50 hover:border-[#8BC53D] text-xs sm:text-sm font-black lowercase tracking-wider transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center gap-2.5 cursor-pointer active:scale-95 backdrop-blur-md"
            title="scroll to see more."
          >
            <span>scroll to see more.</span>
            <ChevronDown className="w-4 h-4 text-[#8BC53D] group-hover:text-[#011207] transition-transform duration-300 group-hover:translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
