import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Flame, Bike, PackageCheck, HeartHandshake } from 'lucide-react';
import { OrderStatus } from './OrderTrackerModal';

interface MilestoneStep {
  id: OrderStatus;
  title: string;
  shortLabel: string;
  desc: string;
  timeEstimate: string;
  percent: number;
  color: string;
  glowColor: string;
}

interface LottieProgressMilestoneBarProps {
  currentStatus: OrderStatus;
  onSelectMilestone: (status: OrderStatus) => void;
}

export const MILESTONES: MilestoneStep[] = [
  {
    id: 'Order Placed',
    title: 'Order Placed',
    shortLabel: 'Confirmed',
    desc: 'WhatsApp order verified & sent to line cook',
    timeEstimate: '00:00',
    percent: 15,
    color: '#8BC53D',
    glowColor: 'rgba(139, 197, 61, 0.4)'
  },
  {
    id: 'Preparing',
    title: 'Kitchen Cooking',
    shortLabel: 'Sizzling',
    desc: '450°C sear & woodfired oven baking',
    timeEstimate: '10-15m',
    percent: 42,
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)'
  },
  {
    id: 'Out for Delivery',
    title: 'Out for Delivery',
    shortLabel: 'En Route',
    desc: 'Thermal pack sealed • Rider speeding to destination',
    timeEstimate: '20-25m',
    percent: 75,
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)'
  },
  {
    id: 'Delivered',
    title: 'Delivered Fresh',
    shortLabel: 'Doorstep',
    desc: 'Safely arrived • Enjoy your piping hot feast',
    timeEstimate: 'Arrived',
    percent: 100,
    color: '#C2F84F',
    glowColor: 'rgba(194, 248, 79, 0.5)'
  }
];

export const LottieProgressMilestoneBar: React.FC<LottieProgressMilestoneBarProps> = ({
  currentStatus,
  onSelectMilestone
}) => {
  const currentIndex = MILESTONES.findIndex((m) => m.id === currentStatus);
  const activeMilestone = MILESTONES[currentIndex] || MILESTONES[0];

  return (
    <div className="w-full bg-[#011207]/90 rounded-3xl p-4 sm:p-6 border border-[#8BC53D]/30 shadow-xl overflow-hidden relative">
      {/* Subtle Background Circuit Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#8BC53D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Metric Row */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold transition-all duration-500 shadow-md"
              style={{
                backgroundColor: activeMilestone.color,
                color: '#011207',
                boxShadow: `0 0 15px ${activeMilestone.glowColor}`
              }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: activeMilestone.color }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-xl text-white uppercase tracking-tight font-anton">
                {activeMilestone.title}
              </span>
              <span
                className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider"
                style={{
                  backgroundColor: `${activeMilestone.color}20`,
                  color: activeMilestone.color,
                  border: `1px solid ${activeMilestone.color}40`
                }}
              >
                Stage {currentIndex + 1} of 4
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#E2F0CC]/70 font-medium">
              {activeMilestone.desc}
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-[10px] text-[#E2F0CC]/50 uppercase tracking-widest">
            Estimated Pace
          </div>
          <div
            className="text-xs sm:text-sm font-black"
            style={{ color: activeMilestone.color }}
          >
            {activeMilestone.timeEstimate}
          </div>
        </div>
      </div>

      {/* Main Lottie-Style Animated Progress Track */}
      <div className="relative my-6 sm:my-8 px-2 sm:px-6">
        
        {/* Track Base Rail */}
        <div className="relative w-full h-3 sm:h-3.5 bg-[#012F13] rounded-full overflow-visible border border-[#8BC53D]/30 shadow-inner">
          
          {/* Animated Flowing Fluid Track Fill with Keyframe Shimmer */}
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full overflow-hidden"
            initial={{ width: '15%' }}
            animate={{ width: `${activeMilestone.percent}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            style={{
              background: `linear-gradient(90deg, #8BC53D 0%, #F59E0B 45%, #38BDF8 80%, #C2F84F 100%)`,
              boxShadow: `0 0 16px ${activeMilestone.glowColor}`
            }}
          >
            {/* Lottie Stream Particle Waves inside the progress bar */}
            <motion.div
              className="absolute inset-0 w-[200%] h-full opacity-60"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 12px, transparent 12px, transparent 24px)'
              }}
            />
          </motion.div>

          {/* Floating Traveler Avatar (Lottie-Style animated mascot along the track) */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none"
            initial={{ left: '15%' }}
            animate={{ left: `${activeMilestone.percent}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <div className="relative -translate-x-1/2 flex flex-col items-center">
              {/* Pulsing Beacon Ring */}
              <div
                className="absolute -inset-2 rounded-full animate-ping opacity-40"
                style={{ backgroundColor: activeMilestone.color }}
              />

              {/* Lottie Mascot Disc */}
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#011207] border-2 flex items-center justify-center shadow-2xl shadow-black relative z-10"
                style={{ borderColor: activeMilestone.color }}
              >
                <AnimatePresence mode="wait">
                  {currentStatus === 'Order Placed' && (
                    <motion.div
                      key="placed"
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 30 }}
                      transition={{ duration: 0.25 }}
                    >
                      <PackageCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#8BC53D]" />
                    </motion.div>
                  )}

                  {currentStatus === 'Preparing' && (
                    <motion.div
                      key="prep"
                      initial={{ scale: 0, y: 5 }}
                      animate={{ scale: 1, y: [0, -2, 0] }}
                      exit={{ scale: 0 }}
                      transition={{ y: { repeat: Infinity, duration: 0.8 }, duration: 0.25 }}
                    >
                      <Flame className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#F59E0B] fill-[#F59E0B]/30" />
                    </motion.div>
                  )}

                  {currentStatus === 'Out for Delivery' && (
                    <motion.div
                      key="delivery"
                      initial={{ scale: 0, x: -6 }}
                      animate={{ scale: 1, x: [0, 2, 0] }}
                      exit={{ scale: 0 }}
                      transition={{ x: { repeat: Infinity, duration: 0.4 }, duration: 0.25 }}
                    >
                      <Bike className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#38BDF8]" />
                    </motion.div>
                  )}

                  {currentStatus === 'Delivered' && (
                    <motion.div
                      key="delivered"
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: [1, 1.2, 1], rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ scale: { repeat: Infinity, duration: 1.5 }, duration: 0.25 }}
                    >
                      <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#C2F84F] fill-[#C2F84F]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Tooltip Flag */}
              <div
                className="absolute top-10 whitespace-nowrap px-2 py-0.5 rounded-full text-[9px] font-bold text-[#011207] shadow-lg flex items-center gap-1"
                style={{ backgroundColor: activeMilestone.color }}
              >
                <span>{activeMilestone.shortLabel}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4 Interactive Milestone Node Indicators */}
        <div className="relative -mt-6 sm:-mt-6 flex justify-between z-20">
          {MILESTONES.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;

            return (
              <button
                key={step.id}
                onClick={() => onSelectMilestone(step.id)}
                className="flex flex-col items-center group cursor-pointer focus:outline-none transition-transform active:scale-95"
              >
                {/* Node Shape / Lottie Frame */}
                <div className="relative">
                  {/* Current Active Halo */}
                  {isCurrent && (
                    <motion.div
                      layoutId="active-milestone-halo"
                      className="absolute -inset-1.5 rounded-2xl border-2 border-dashed animate-spin-slow pointer-events-none"
                      style={{ borderColor: step.color }}
                    />
                  )}

                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-300 relative z-10 ${
                      isCurrent
                        ? 'bg-[#011207] border-2 scale-110 shadow-xl'
                        : isCompleted
                        ? 'bg-[#012F13] border border-[#8BC53D] text-[#8BC53D]'
                        : 'bg-[#011207] border border-white/10 text-white/30 hover:border-white/30'
                    }`}
                    style={{
                      borderColor: isCurrent ? step.color : isCompleted ? '#8BC53D' : undefined,
                      boxShadow: isCurrent ? `0 0 16px ${step.glowColor}` : undefined
                    }}
                  >
                    {/* Node Icon with Lottie Micro-States */}
                    {idx === 0 && (
                      <LottieNodeIcon1 isCompleted={isCompleted} isCurrent={isCurrent} />
                    )}
                    {idx === 1 && (
                      <LottieNodeIcon2 isCompleted={isCompleted} isCurrent={isCurrent} />
                    )}
                    {idx === 2 && (
                      <LottieNodeIcon3 isCompleted={isCompleted} isCurrent={isCurrent} />
                    )}
                    {idx === 3 && (
                      <LottieNodeIcon4 isCompleted={isCompleted} isCurrent={isCurrent} />
                    )}
                  </div>
                </div>

                {/* Step Subtitle */}
                <div className="mt-3 sm:mt-4 text-center">
                  <span
                    className={`block text-[10px] sm:text-xs font-bold uppercase tracking-tight transition-colors ${
                      isCurrent
                        ? 'text-white'
                        : isCompleted
                        ? 'text-[#8BC53D]'
                        : 'text-white/40'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[9px] text-[#E2F0CC]/40 block sm:hidden">
                    {step.timeEstimate}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Frame-by-Frame Milestone Details Bar */}
      <div className="mt-6 pt-3 border-t border-[#8BC53D]/15 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: activeMilestone.color }}
          />
          <span className="text-[11px] text-[#E2F0CC]/70">
            Click any milestone above to instantly test live synchronization
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8BC53D]">
          <span>Smooth 60FPS Lottie Progress</span>
        </div>
      </div>
    </div>
  );
};

/* Lottie-style Vector Micro-Animation for Node 1: Receipt / Order Confirmation */
const LottieNodeIcon1: React.FC<{ isCompleted: boolean; isCurrent: boolean }> = ({
  isCompleted,
  isCurrent
}) => {
  if (isCompleted) {
    return <Check className="w-4 h-4 text-[#8BC53D]" strokeWidth={3} />;
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="overflow-visible">
      {/* Animated Order Paper with Drawing Border */}
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
        stroke={isCurrent ? '#8BC53D' : 'currentColor'}
        strokeWidth="2"
      />
      <motion.line
        x1="8"
        y1="8"
        x2="16"
        y2="8"
        stroke={isCurrent ? '#8BC53D' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        animate={isCurrent ? { pathLength: [0.2, 1, 0.2] } : {}}
        transition={{ repeat: Infinity, duration: 1.8 }}
      />
      <motion.line
        x1="8"
        y1="12"
        x2="14"
        y2="12"
        stroke={isCurrent ? '#8BC53D' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        animate={isCurrent ? { pathLength: [0.2, 1, 0.2] } : {}}
        transition={{ repeat: Infinity, duration: 1.8, delay: 0.2 }}
      />
      <motion.circle
        cx="15"
        cy="16"
        r="2"
        fill={isCurrent ? '#8BC53D' : 'none'}
        stroke={isCurrent ? '#8BC53D' : 'currentColor'}
        strokeWidth="1.5"
        animate={isCurrent ? { scale: [0.8, 1.2, 0.8] } : {}}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
    </svg>
  );
};

/* Lottie-style Vector Micro-Animation for Node 2: Kitchen Cooking / Sizzling Flames */
const LottieNodeIcon2: React.FC<{ isCompleted: boolean; isCurrent: boolean }> = ({
  isCompleted,
  isCurrent
}) => {
  if (isCompleted) {
    return <Check className="w-4 h-4 text-[#8BC53D]" strokeWidth={3} />;
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="overflow-visible">
      {/* Pan Base */}
      <path
        d="M3 12h14a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-1a2 2 0 0 1 2-2z"
        stroke={isCurrent ? '#F59E0B' : 'currentColor'}
        strokeWidth="1.8"
      />
      <line
        x1="19"
        y1="14"
        x2="23"
        y2="11"
        stroke={isCurrent ? '#F59E0B' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Sizzling Flame Particles */}
      {isCurrent ? (
        <>
          <motion.path
            d="M7 9 Q8 6 9 9 Q10 4 11 9"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.8"
            strokeLinecap="round"
            animate={{ y: [0, -3, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.circle
            cx="13"
            cy="7"
            r="1.2"
            fill="#F59E0B"
            animate={{ y: [0, -4, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.9, delay: 0.3 }}
          />
        </>
      ) : (
        <path
          d="M7 9 Q8 7 9 9 Q10 5 11 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};

/* Lottie-style Vector Micro-Animation for Node 3: Express Delivery Bike with Spinning Wheels */
const LottieNodeIcon3: React.FC<{ isCompleted: boolean; isCurrent: boolean }> = ({
  isCompleted,
  isCurrent
}) => {
  if (isCompleted) {
    return <Check className="w-4 h-4 text-[#8BC53D]" strokeWidth={3} />;
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="overflow-visible">
      {/* Front Wheel */}
      <motion.g
        animate={isCurrent ? { rotate: 360 } : {}}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        style={{ transformOrigin: '18px 17px' }}
      >
        <circle cx="18" cy="17" r="4" stroke={isCurrent ? '#38BDF8' : 'currentColor'} strokeWidth="1.8" />
        <line x1="18" y1="13" x2="18" y2="21" stroke={isCurrent ? '#38BDF8' : 'currentColor'} strokeWidth="1" />
      </motion.g>

      {/* Rear Wheel */}
      <motion.g
        animate={isCurrent ? { rotate: 360 } : {}}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        style={{ transformOrigin: '6px 17px' }}
      >
        <circle cx="6" cy="17" r="4" stroke={isCurrent ? '#38BDF8' : 'currentColor'} strokeWidth="1.8" />
        <line x1="6" y1="13" x2="6" y2="21" stroke={isCurrent ? '#38BDF8' : 'currentColor'} strokeWidth="1" />
      </motion.g>

      {/* Bike Frame & Handlebars */}
      <path
        d="M6 17l4-7h5l3 7M10 10l2 7M15 10l-2-4h-2"
        stroke={isCurrent ? '#38BDF8' : 'currentColor'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Wind Streaks */}
      {isCurrent && (
        <motion.line
          x1="2"
          y1="8"
          x2="0"
          y2="8"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ x: [4, -2, 4], opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        />
      )}
    </svg>
  );
};

/* Lottie-style Vector Micro-Animation for Node 4: Doorstep Delivery / Celebration Sparkle */
const LottieNodeIcon4: React.FC<{ isCompleted: boolean; isCurrent: boolean }> = ({
  isCompleted,
  isCurrent
}) => {
  if (isCompleted || isCurrent) {
    return (
      <motion.div
        animate={isCurrent ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Sparkles className="w-5 h-5 text-[#C2F84F] fill-[#C2F84F]" />
      </motion.div>
    );
  }

  return <HeartHandshake className="w-5 h-5 text-white/40" />;
};
