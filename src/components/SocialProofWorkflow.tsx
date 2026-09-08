import React from 'react';
import { Utensils, MessageSquare, ChefHat, Bike } from 'lucide-react';

export const SocialProofWorkflow: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Select Your Favorites",
      description: "Browse our chef-crafted burgers, stone-baked pizzas, and crispy wings.",
      icon: Utensils,
      color: "#8BC53D"
    },
    {
      number: "02",
      title: "1-Tap WhatsApp Order",
      description: "Send your order directly to our live kitchen dispatch with zero signup hassle.",
      icon: MessageSquare,
      color: "#8BC53D"
    },
    {
      number: "03",
      title: "Fresh Searing & Bake",
      description: "Prepared hot on order with premium Halal ingredients and thermal sealing.",
      icon: ChefHat,
      color: "#E2F0CC"
    },
    {
      number: "04",
      title: "Fast 30-Min Delivery",
      description: "Dispatched straight to your doorstep hot, fresh, and ready to enjoy.",
      icon: Bike,
      color: "#8BC53D"
    }
  ];

  return (
    <section id="how-it-works" className="py-8 md:py-12">
      <div className="bg-[#012F13] rounded-3xl p-6 sm:p-10 border border-[#8BC53D]/30">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#8BC53D] block mb-1">
            Fresh From Our Kitchen
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            How Ordering Works
          </h3>
          <p className="text-xs sm:text-sm text-[#E2F0CC]/70 mt-1">
            Fast, transparent, and direct to our kitchen dispatch on WhatsApp with live status tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#011207] rounded-2xl p-5 border border-[#8BC53D]/15 relative flex flex-col justify-between group hover:border-[#8BC53D]/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      style={{ backgroundColor: `${step.color}15`, color: step.color }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#8BC53D]/20"
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black text-[#E2F0CC]/30 group-hover:text-[#8BC53D] transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#E2F0CC]/65 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#8BC53D]/15 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: step.color }} />
                  <span className="text-[10px] text-[#8BC53D] font-bold uppercase tracking-wider">
                    Step {step.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
