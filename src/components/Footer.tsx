import React from 'react';
import { Phone, MapPin, Instagram, Facebook, Clock, Sparkles } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../restaurant.config';

interface FooterProps {
  onOpenHoursModal: () => void;
  onScrollToMenu: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHoursModal, onScrollToMenu }) => {
  return (
    <footer id="main-footer" className="bg-[#012F13] border-t border-[#8BC53D]/20 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#8BC53D]/15">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8BC53D] flex items-center justify-center font-black text-[#011207] text-lg shadow-md shadow-[#8BC53D]/30">
                SW
              </div>
              <span className="text-xl font-black text-white tracking-tight uppercase">
                {RESTAURANT_CONFIG.name}
              </span>
            </div>

            <p className="text-xs text-[#E2F0CC]/60 max-w-sm leading-relaxed">
              Mobile-first culinary ordering engine designed for high-contrast speed, organic real food photography, live interactive tracking, and direct WhatsApp kitchen dispatch.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={RESTAURANT_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#011207] border border-[#8BC53D]/20 text-[#E2F0CC]/70 hover:text-[#8BC53D] hover:border-[#8BC53D]/40 flex items-center justify-center transition-colors"
                aria-label="Instagram page"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={RESTAURANT_CONFIG.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#011207] border border-[#8BC53D]/20 text-[#E2F0CC]/70 hover:text-[#8BC53D] hover:border-[#8BC53D]/40 flex items-center justify-center transition-colors"
                aria-label="Facebook page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${RESTAURANT_CONFIG.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#8BC53D]/15 border border-[#8BC53D]/30 text-[#8BC53D] text-xs font-bold font-mono flex items-center gap-1.5 hover:bg-[#8BC53D]/25 transition-colors"
              >
                <span>WA: +{RESTAURANT_CONFIG.phone}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#8BC53D] uppercase tracking-widest font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#E2F0CC]/80">
              <li>
                <button
                  onClick={onScrollToMenu}
                  className="hover:text-[#8BC53D] transition-colors cursor-pointer"
                >
                  🔥 Super Saver Combos
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToMenu}
                  className="hover:text-[#8BC53D] transition-colors cursor-pointer"
                >
                  Artisan Wagyu Burgers
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToMenu}
                  className="hover:text-[#8BC53D] transition-colors cursor-pointer"
                >
                  Woodfired Sourdough Pizzas
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToMenu}
                  className="hover:text-[#8BC53D] transition-colors cursor-pointer"
                >
                  Buffalo Glazed Wings
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Kitchen Timings */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#8BC53D] uppercase tracking-widest font-mono">
              Operating Hours
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#E2F0CC]">
                <Clock className="w-3.5 h-3.5 text-[#8BC53D]" />
                <span>{RESTAURANT_CONFIG.operatingHours.displayString}</span>
              </div>
              <p className="text-[11px] text-[#E2F0CC]/50">
                Late night dispatch active across city radius.
              </p>
              <button
                onClick={onOpenHoursModal}
                className="text-xs font-bold text-[#E2F0CC] hover:text-[#8BC53D] hover:underline flex items-center gap-1 cursor-pointer pt-1"
              >
                <MapPin className="w-3 h-3 text-[#8BC53D]" />
                <span>Location & Zone Details</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#E2F0CC]/50">
          <div>
            © {new Date().getFullYear()} Smash & Woodfire — Demo by{' '}
            <a
              href="https://basegridpk.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8BC53D] hover:underline font-bold"
            >
              BaseGrid
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase font-mono">
            <span className="text-[#8BC53D]">01 SELECT FOOD</span>
            <span className="text-white/20">•</span>
            <span className="text-[#E2F0CC]/80">02 WHATSAPP CONFIRM</span>
            <span className="text-white/20">•</span>
            <span className="text-[#E2F0CC]/80">03 REAL-TIME TRACKING</span>
            <span className="text-white/20">•</span>
            <span className="text-[#E2F0CC]/80">04 EXPRESS DISPATCH</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
