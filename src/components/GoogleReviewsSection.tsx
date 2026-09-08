import React from 'react';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { GOOGLE_REVIEWS } from '../restaurant.config.ts';

export const GoogleReviewsSection: React.FC = () => {
  return (
    <section id="google-reviews" data-reveal className="py-10 md:py-16">
      {/* Container Header */}
      <div className="bg-[#012F13] rounded-3xl p-6 sm:p-10 border border-[#8BC53D]/30 relative overflow-hidden">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#8BC53D]/15">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8BC53D]/15 border border-[#8BC53D]/30 text-[#8BC53D] text-xs font-black uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Customer Feedback</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              WHAT CUSTOMERS <span className="text-[#8BC53D]">SAY</span>
            </h3>
            <p className="text-[#E2F0CC]/70 text-xs sm:text-sm mt-1 leading-relaxed font-mono">
              Sample reviews — your real customer feedback appears here
            </p>
          </div>

          {/* Rating Indicator Box */}
          <div className="flex items-center gap-4 bg-[#011207] p-4 sm:p-5 rounded-2xl border border-[#8BC53D]/20 flex-shrink-0">
            <div>
              <div className="flex items-center gap-1 text-[#8BC53D] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider block">
                Your Rating Appears Here
              </span>
              <span className="text-[11px] text-[#E2F0CC]/50 block mt-0.5">
                Real customer feedback syncs after launch
              </span>
            </div>
          </div>
        </div>

        {/* Customer Reviews Grid */}
        <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8">
          {GOOGLE_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#011207] rounded-2xl p-5 border border-[#8BC53D]/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-10 h-10 rounded-full object-cover border border-[#8BC53D]/20"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {rev.author}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8BC53D]" />
                      </div>
                      <span className="text-[10px] text-[#E2F0CC]/50 font-mono">
                        {rev.relativeTime} • Demo Order
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-[#8BC53D]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#E2F0CC]/80 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#8BC53D]/10 flex items-center justify-between text-[10px] text-[#E2F0CC]/50">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-[#8BC53D]" />
                  Sample Review
                </span>
                <span className="text-[#8BC53D] font-bold">★ Recommended</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
