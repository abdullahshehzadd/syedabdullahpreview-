import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, MapPin, Phone, ExternalLink, ShieldCheck } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../restaurant.config';

interface DirectionsHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectionsHoursModal: React.FC<DirectionsHoursModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#011207]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#012F13] rounded-3xl border border-[#8BC53D]/30 shadow-2xl p-6 sm:p-8 z-10 space-y-6 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#011207] hover:bg-[#073B1B] text-[#E2F0CC]/70 hover:text-white flex items-center justify-center border border-[#8BC53D]/20 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8BC53D]/15 border border-[#8BC53D]/30 text-[#8BC53D] text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Operational Schedule & Location</span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              {RESTAURANT_CONFIG.name}
            </h3>
            <p className="text-xs text-[#E2F0CC]/60 mt-1">
              Gourmet Smash Burgers, Artisan Pizzas & Night-time Street Kitchen
            </p>
          </div>

          {/* Schedule Box */}
          <div className="bg-[#011207] rounded-2xl p-5 border border-[#8BC53D]/20 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#8BC53D]/15">
              <span className="text-xs font-bold text-[#E2F0CC]/80 uppercase">Daily Hours</span>
              <span className="text-xs font-bold text-[#8BC53D]">
                {RESTAURANT_CONFIG.operatingHours.displayString}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#E2F0CC]/70">
              <span>Monday – Sunday</span>
              <span>6:00 PM – 1:00 AM (Late Night)</span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#E2F0CC]/70">
              <span>Delivery Radius</span>
              <span>Within 10 km (Express Dispatch)</span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#E2F0CC]/70">
              <span>Takeaway Prep Time</span>
              <span>{RESTAURANT_CONFIG.takeawayRules.pickupEstimateMinutes} mins standard</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`tel:+${RESTAURANT_CONFIG.phone}`}
              className="p-4 rounded-2xl bg-[#011207] border border-[#8BC53D]/20 hover:border-[#8BC53D]/60 transition-colors flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#8BC53D]/15 text-[#8BC53D] flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#E2F0CC]/50 uppercase font-bold block">Direct Call</span>
                <span className="text-xs font-bold text-white">{RESTAURANT_CONFIG.displayPhone}</span>
              </div>
            </a>

            <a
              href={`https://wa.me/${RESTAURANT_CONFIG.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#011207] border border-[#8BC53D]/20 hover:border-[#8BC53D]/60 transition-colors flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#8BC53D] text-[#011207] flex items-center justify-center flex-shrink-0 font-black">
                WA
              </div>
              <div>
                <span className="text-[10px] text-[#E2F0CC]/50 uppercase font-bold block">WhatsApp Channel</span>
                <span className="text-xs font-bold text-[#8BC53D]">Direct Chat</span>
              </div>
            </a>
          </div>

          {/* Google Maps Button */}
          <a
            href={RESTAURANT_CONFIG.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-[#011207] hover:bg-[#073B1B] border border-[#8BC53D]/30 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#8BC53D]" />
            <span>Open in Google Maps for Directions</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#E2F0CC]/50" />
          </a>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
