import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { SIGNATURE_DEALS, SignatureDeal } from '../restaurant.config';

const TILT_PATTERN = [-1.25, 0.85, -0.65, 1.35];

interface StickyScrollCardsProps {
  onAddDeal: (deal: SignatureDeal) => void;
  onSelectDeal: (deal: SignatureDeal) => void;
  favorites?: string[];
  onToggleFavorite?: (itemId: string, itemName?: string) => void;
}

export const StickyScrollCards: React.FC<StickyScrollCardsProps> = ({
  onAddDeal,
  onSelectDeal,
  favorites = [],
  onToggleFavorite
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="signature-deals" className="relative py-8 md:py-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8BC53D]/15 border border-[#8BC53D]/30 text-[#8BC53D] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Chef Boxes</span>
          </div>
          <h2 className="text-3xl md:text-4xl tracking-tight text-white uppercase italic font-anton">
            Signature Deals <span className="text-[#8BC53D]">& Combos</span>
          </h2>
          <p className="text-[#E2F0CC]/70 text-sm md:text-base mt-1 max-w-xl">
            Multi-item feast boxes assembled fresh with handcrafted gourmet pairings and special combo pricing.
          </p>
        </div>

        <span className="text-xs font-bold text-[#E2F0CC]/50 uppercase tracking-widest self-start sm:self-auto">
          {SIGNATURE_DEALS.length} Exclusive Deals Active
        </span>
      </div>

      {/* Cards Deck */}
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {SIGNATURE_DEALS.map((deal, idx) => {
          const tiltDeg = TILT_PATTERN[idx % TILT_PATTERN.length];

          return (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.25, delay: idx * 0.05, ease: "easeOut" }}
              whileHover={{ 
                y: -4, 
                rotate: tiltDeg * 0.5, 
                transition: { duration: 0.18, ease: "easeOut" } 
              }}
              className="group relative bg-[#012F13] rounded-2xl sm:rounded-3xl border border-[#8BC53D]/25 hover:border-[#8BC53D] transition-colors duration-200 overflow-hidden flex flex-col justify-between shadow-lg will-change-transform"
            >
              {/* Top Image Box */}
              <div 
                className="relative h-56 sm:h-64 overflow-hidden cursor-pointer bg-[#011207]"
                onClick={() => onSelectDeal(deal)}
              >
                <img
                  src={deal.image}
                  alt={deal.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#012F13] via-[#012F13]/40 to-transparent" />

                {/* Badge Tag */}
                <div className="absolute top-4 left-4">
                  <span 
                    style={{ backgroundColor: deal.badgeColor }}
                    className="text-[#011207] px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-tight shadow-md inline-block"
                  >
                    {deal.tag}
                  </span>
                </div>

                {/* Price Pill & Favourite Button */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {onToggleFavorite && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(deal.id, deal.title);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md active:scale-90 ${
                        favorites.includes(deal.id)
                          ? 'bg-red-500/30 text-red-500 border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] scale-105'
                          : 'bg-[#011207]/90 text-[#E2F0CC]/70 hover:text-red-400 border border-[#8BC53D]/30 hover:scale-110 hover:border-red-400/50'
                      }`}
                      aria-label={
                        favorites.includes(deal.id)
                          ? `Remove ${deal.title} from favourites`
                          : `Add ${deal.title} to favourites`
                      }
                      title={favorites.includes(deal.id) ? 'Remove from favourites' : 'Add to favourites'}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform duration-200 ${
                          favorites.includes(deal.id)
                            ? 'fill-red-500 stroke-red-500 scale-110'
                            : 'stroke-current hover:stroke-red-400'
                        }`}
                      />
                    </button>
                  )}

                  <div className="bg-[#011207]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#8BC53D]/30 flex items-center gap-2">
                    <span className="text-xs text-[#E2F0CC]/40 line-through">
                      PKR {deal.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm md:text-base font-black text-[#8BC53D]">
                      PKR {deal.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Discount % banner */}
                <div className="absolute bottom-3 left-4">
                  <span className="text-xs font-bold text-[#E2F0CC] bg-[#011207]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#8BC53D]/20">
                    Save PKR {(deal.originalPrice - deal.price).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bottom Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    onClick={() => onSelectDeal(deal)}
                    className="text-xl md:text-2xl font-black text-white group-hover:text-[#8BC53D] transition-colors cursor-pointer"
                  >
                    {deal.title}
                  </h3>
                  <p className="text-sm text-[#8BC53D] font-medium mt-1">
                    {deal.subtitle}
                  </p>
                  <p className="text-[#E2F0CC]/70 text-xs mt-3 line-clamp-2 leading-relaxed">
                    {deal.description}
                  </p>

                  {/* Included Items Checklist */}
                  <div className="mt-4 pt-4 border-t border-[#8BC53D]/15 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#E2F0CC]/50 uppercase tracking-widest block mb-1">
                      Box Includes:
                    </span>
                    {deal.itemsIncluded.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-2 text-xs text-[#E2F0CC]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8BC53D]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-[#8BC53D]/15 flex items-center gap-3">
                  <button
                    onClick={() => onSelectDeal(deal)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#011207] hover:bg-[#073B1B] text-xs font-bold text-[#E2F0CC] border border-[#8BC53D]/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    aria-label={`View details of ${deal.title}`}
                  >
                    <span>View Box Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onAddDeal(deal)}
                    className="px-5 py-3 rounded-xl bg-[#8BC53D] hover:bg-[#8BC53D]/90 text-[#011207] text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8BC53D]/20 active:scale-95 cursor-pointer"
                    aria-label={`Add ${deal.title} to cart`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>+ Add Deal</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
