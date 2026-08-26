import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { BorderGlowButton } from './BorderGlowButton.tsx';
import { RESTAURANT_CONFIG } from '../restaurant.config.ts';

interface HeroSectionProps {
  onScrollToMenu: () => void;
  onOpenHoursModal: () => void;
  onSelectFeaturedItem: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToMenu,
  onOpenHoursModal,
  onSelectFeaturedItem
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section ref={heroRef} id="hero-section" className="relative pt-0 pb-6 md:pb-8 scroll-mt-20">
      {/* Bento Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main High-Impact Showcase Card (Span 8) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="lg:col-span-7 xl:col-span-8 relative min-h-[460px] sm:min-h-[520px] rounded-3xl overflow-hidden border border-[#8BC53D]/25 group flex flex-col justify-end p-6 sm:p-10 shadow-2xl bg-[#012F13]"
        >
          {/* Organic Real Unsplash Image Background with Parallax */}
          <motion.img
            style={{ scale: bgScale }}
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200"
            alt="Smokey Truffle Beef Burger"
            className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
          />

          {/* Luxury Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#011207] via-[#011207]/70 to-transparent" />
          <div className="absolute inset-0 bg-radial at-center from-transparent via-[#011207]/30 to-[#011207]/85 pointer-events-none" />

          {/* Top Pill Badges */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8BC53D] text-[#011207] text-xs font-black uppercase tracking-tight shadow-lg">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Chef's Masterpiece • Best Seller</span>
            </div>

            <span className="text-xs font-mono font-black text-[#8BC53D] bg-[#011207]/90 backdrop-blur-md px-3 py-1 rounded-xl border border-[#8BC53D]/30 shadow-md">
              PKR 1,850
            </span>
          </div>

          {/* Hero Foreground Content */}
          <motion.div style={{ y: textY }} className="relative z-10 max-w-xl">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#8BC53D] block mb-2 font-mono">
              Artisan Brioche & Prime Wagyu Blend
            </span>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] uppercase italic tracking-tighter mb-4">
              SMOKEY <br />
              <span className="text-[#8BC53D] drop-shadow-[0_0_20px_rgba(139,197,61,0.35)]">TRUFFLE BEEF</span>
            </h2>

            <p className="text-[#E2F0CC]/80 text-sm sm:text-base leading-relaxed mb-6 font-normal max-w-md">
              Double smash prime beef patties, velvety black truffle aioli, aged smoked provolone, and caramelized shallots on toasted butter brioche.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <BorderGlowButton
                onClick={onSelectFeaturedItem}
                variant="primary"
                className="w-full sm:w-auto bg-[#8BC53D] text-[#011207] font-black"
              >
                <div className="flex items-center gap-2">
                  <span>Order Featured Item</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </BorderGlowButton>

              <button
                onClick={onScrollToMenu}
                className="px-6 py-3.5 rounded-2xl bg-[#011207] hover:bg-[#073B1B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider border border-[#8BC53D]/30 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Explore Full Menu
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Side Bento Stats & Fast Info (Span 5) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 justify-between">
          {/* Card 1: Google Rating & Social Proof */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-[#012F13] rounded-3xl p-6 border border-[#8BC53D]/20 flex flex-col justify-between relative overflow-hidden group hover:border-[#8BC53D]/40 transition-colors shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#E2F0CC]/60 uppercase font-black tracking-widest">
                Verified Google Rating
              </span>
              <div className="w-2 h-2 rounded-full bg-[#8BC53D]" />
            </div>

            <div className="my-4">
              <div className="text-4xl font-black text-[#8BC53D] tracking-tight font-mono">
                4.9 ★★★★★
              </div>
              <p className="text-xs text-[#E2F0CC]/70 mt-1">
                Based on 450+ Verified Food Critic & Diner Reviews in 2026.
              </p>
            </div>

            <div className="pt-3 border-t border-[#8BC53D]/15 flex items-center justify-between text-[11px]">
              <span className="text-[#E2F0CC]/50">Food Quality Score</span>
              <span className="text-[#8BC53D] font-bold font-mono">99.4% Positive</span>
            </div>
          </motion.div>

          {/* Card 2: Live Kitchen & Delivery Time */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="bg-[#012F13] rounded-3xl p-6 border border-[#8BC53D]/20 flex flex-col justify-between hover:border-[#8BC53D]/40 transition-colors shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#E2F0CC]/60 uppercase font-black tracking-widest">
                Kitchen Status & Speed
              </span>
              <span className="text-[10px] font-mono font-bold text-[#8BC53D] bg-[#8BC53D]/10 px-2 py-0.5 rounded border border-[#8BC53D]/30">
                ACTIVE
              </span>
            </div>

            <div className="my-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#E2F0CC]/70 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#8BC53D]" />
                  Express Delivery
                </span>
                <span className="font-bold text-white font-mono">{RESTAURANT_CONFIG.deliveryRules.estimatedMinutes}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#E2F0CC]/70 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8BC53D]" />
                  Takeaway Ready
                </span>
                <span className="font-bold text-white font-mono">{RESTAURANT_CONFIG.takeawayRules.pickupEstimateMinutes} mins</span>
              </div>
            </div>

            <button
              onClick={onOpenHoursModal}
              className="mt-2 w-full py-2.5 rounded-xl bg-[#011207] hover:bg-[#011207]/80 text-[11px] font-bold text-[#E2F0CC] border border-[#8BC53D]/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#8BC53D]" />
              <span>View Operating Hours & Map</span>
            </button>
          </motion.div>

          {/* Card 3: Free Delivery Promo Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="bg-[#011207] rounded-2xl p-4 border border-[#8BC53D]/30 flex items-center gap-3 shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8BC53D]/10 border border-[#8BC53D]/30 flex items-center justify-center text-lg flex-shrink-0">
              🛵
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-[#8BC53D] uppercase tracking-wider">
                FREE Delivery Promo Active
              </div>
              <p className="text-[11px] text-[#E2F0CC]/60 truncate">
                On all WhatsApp orders above PKR {RESTAURANT_CONFIG.deliveryRules.freeDeliveryAbove.toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
