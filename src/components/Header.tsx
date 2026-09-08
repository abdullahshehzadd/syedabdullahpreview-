import React, { useEffect, useRef } from 'react';
import { ShoppingBag, MapPin, Clock, Search, PhoneCall, Bike, Heart } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../restaurant.config.ts';

interface HeaderProps {
  serviceMode: 'delivery' | 'takeaway';
  onToggleServiceMode: (mode: 'delivery' | 'takeaway') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenHoursModal: () => void;
  onOpenTracker: () => void;
  activeOrderStatus?: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  serviceMode,
  onToggleServiceMode,
  cartCount,
  onOpenCart,
  onOpenHoursModal,
  onOpenTracker,
  activeOrderStatus,
  searchQuery,
  onSearchChange,
  favoritesCount = 0,
  onOpenFavorites
}) => {
  const badgeRef = useRef<HTMLSpanElement>(null);
  const favBadgeRef = useRef<HTMLSpanElement>(null);


  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 bg-[#011207]/95 backdrop-blur-md border-b border-[#012F13] transition-colors"
    >
      {/* Top Banner Notice / Live Status */}
      <div className="bg-[#012F13] px-4 py-1.5 border-b border-[#8BC53D]/20 flex items-center justify-between text-[11px] font-bold">
        <div 
          onClick={onOpenHoursModal}
          className="flex items-center gap-2 text-[#E2F0CC]/80 hover:text-white cursor-pointer transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-[#8BC53D] animate-pulse shadow-[0_0_8px_#8BC53D]" />
          <span className="text-[#8BC53D] uppercase tracking-wider font-mono">LIVE STATUS: OPEN</span>
          <span className="text-[#E2F0CC]/40 hidden sm:inline">•</span>
          <span className="text-[#E2F0CC]/70 hidden sm:inline flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#8BC53D]" />
            {RESTAURANT_CONFIG.operatingHours.displayString}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-[#E2F0CC]/70">
          {/* Order Tracker Trigger */}
          <button
            onClick={onOpenTracker}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#011207] border border-[#8BC53D]/40 text-[#8BC53D] hover:bg-[#8BC53D] hover:text-[#011207] transition-all cursor-pointer text-[10px] font-bold uppercase tracking-wider shadow-sm"
          >
            <Bike className="w-3 h-3" />
            <span>{activeOrderStatus ? `Track: ${activeOrderStatus}` : 'Track Order'}</span>
          </button>

          <a
            href={`tel:+${RESTAURANT_CONFIG.phone}`}
            className="hover:text-[#8BC53D] flex items-center gap-1 text-[10px] font-mono transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-[#8BC53D]" />
            <span className="hidden xs:inline">{RESTAURANT_CONFIG.displayPhone}</span>
          </a>
          <button
            onClick={onOpenHoursModal}
            className="hover:text-[#8BC53D] flex items-center gap-1 text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-[#8BC53D]" />
            <span className="hidden md:inline">Hours & Location</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#8BC53D] flex items-center justify-center font-black text-[#011207] text-lg shadow-[0_0_15px_rgba(139,197,61,0.25)] flex-shrink-0 tracking-tighter">
            SW
          </div>
          <div>
            <a href="#" className="block">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight uppercase">
                {RESTAURANT_CONFIG.name}
              </h1>
            </a>
            <span className="text-[10px] font-bold text-[#E2F0CC]/50 uppercase tracking-widest block">
              Gourmet Smash & Woodfire
            </span>
          </div>
        </div>

        {/* Center Search Input (Medium+ screens) */}
        <div className="hidden md:flex flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#E2F0CC]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search burgers, pizzas, wings..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#012F13] text-xs text-white placeholder:text-[#E2F0CC]/40 rounded-full pl-9 pr-4 py-2 border border-[#8BC53D]/20 focus:border-[#8BC53D] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Service Mode Toggle */}
          <div className="flex bg-[#012F13] rounded-full p-1 border border-[#8BC53D]/20 select-none">
            <button
              onClick={() => onToggleServiceMode('delivery')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                serviceMode === 'delivery'
                  ? 'bg-[#8BC53D] text-[#011207] shadow-[0_0_10px_rgba(139,197,61,0.3)]'
                  : 'text-[#E2F0CC]/60 hover:text-white'
              }`}
            >
              Delivery
            </button>
            <button
              onClick={() => onToggleServiceMode('takeaway')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                serviceMode === 'takeaway'
                  ? 'bg-[#E2F0CC] text-[#011207] shadow-[0_0_10px_rgba(226,240,204,0.3)]'
                  : 'text-[#E2F0CC]/60 hover:text-white'
              }`}
            >
              Takeaway
            </button>
          </div>

          {/* Favourites Shortcut Button */}
          {onOpenFavorites && (
            <button
              onClick={onOpenFavorites}
              className="relative w-11 h-11 rounded-2xl bg-[#012F13] border border-[#8BC53D]/30 hover:border-red-400/60 text-white flex items-center justify-center transition-all cursor-pointer group active:scale-95"
              aria-label={`View favourite dishes (${favoritesCount})`}
              title="View favourites"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  favoritesCount > 0
                    ? 'text-red-500 fill-red-500'
                    : 'text-[#E2F0CC]/80 group-hover:text-red-400'
                }`}
              />
              {favoritesCount > 0 && (
                <span
                  ref={favBadgeRef}
                  className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black font-mono flex items-center justify-center shadow-lg shadow-red-500/30"
                >
                  {favoritesCount}
                </span>
              )}
            </button>
          )}

          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            className="relative w-11 h-11 rounded-2xl bg-[#012F13] border border-[#8BC53D]/30 hover:border-[#8BC53D] text-white flex items-center justify-center transition-all cursor-pointer group active:scale-95"
            aria-label={`Open shopping cart (${cartCount} items)`}
          >
            <ShoppingBag className="w-5 h-5 text-[#E2F0CC]/80 group-hover:text-[#8BC53D] transition-colors" />
            {cartCount > 0 && (
              <span
                ref={badgeRef}
                className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#8BC53D] text-[#011207] text-[10px] font-black font-mono flex items-center justify-center shadow-lg shadow-[#8BC53D]/30"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (small screens) */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#E2F0CC]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search burgers, pizzas, wings, drinks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#012F13] text-xs text-white placeholder:text-[#E2F0CC]/40 rounded-xl pl-9 pr-4 py-2.5 border border-[#8BC53D]/20 focus:border-[#8BC53D] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Accent Header Line */}
      <div className="h-[2px] bg-gradient-to-r from-[#8BC53D]/40 via-[#8BC53D] to-[#8BC53D]/40 w-full" />
    </header>
  );
};

