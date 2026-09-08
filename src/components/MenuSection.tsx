import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Flame, Star, ShoppingBag, Check, Search, Sparkles, Heart } from 'lucide-react';
import { MENU_CATEGORIES, MenuItem, MENU_ITEMS } from '../restaurant.config.ts';

interface MenuSectionProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  searchQuery: string;
  onSelectFoodItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  cartItemCounts: { [itemId: string]: number };
  favorites?: string[];
  onToggleFavorite?: (itemId: string, itemName?: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSelectFoodItem,
  onQuickAdd,
  cartItemCounts,
  favorites = [],
  onToggleFavorite
}) => {
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});

  // Filter items by category, search query, or favourites
  const filteredItems = MENU_ITEMS.filter((item) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const inName = item.name.toLowerCase().includes(q);
      const inDesc = item.description.toLowerCase().includes(q);
      const inIngredients = item.ingredients?.some((ing) => ing.toLowerCase().includes(q));
      const inTags = item.tags?.some((t) => t.toLowerCase().includes(q));
      return inName || inDesc || inIngredients || inTags;
    }
    if (selectedCategory === 'favourites') {
      return favorites.includes(item.id);
    }
    return item.category === selectedCategory;
  });

  const handleImageLoaded = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Build categories list including Favourites filter pill
  const allCategories = [
    ...MENU_CATEGORIES,
    {
      id: 'favourites',
      label: `❤️ Favourites (${favorites.length})`,
      icon: 'Heart'
    }
  ];

  return (
    <section id="menu-section" data-reveal className="py-6 md:py-10 scroll-mt-20 sm:scroll-mt-24">
      {/* Category Navigation Pills Bar */}
      <div className="sticky top-[105px] sm:top-[115px] z-30 bg-[#011207]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-[#012F13]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {allCategories.map((cat) => {
            const isActive = selectedCategory === cat.id && searchQuery.trim() === '';
            const isFavCat = cat.id === 'favourites';
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? isFavCat
                      ? 'bg-red-500 text-white shadow-[0_0_14px_rgba(239,68,68,0.45)] scale-102 font-black'
                      : 'bg-[#8BC53D] text-[#011207] shadow-[0_0_12px_rgba(139,197,61,0.35)] scale-102 font-black'
                    : isFavCat && favorites.length > 0
                    ? 'bg-[#012F13] text-red-400 hover:text-red-300 hover:bg-[#073B1B] border border-red-500/30'
                    : 'bg-[#012F13] text-[#E2F0CC]/70 hover:text-white hover:bg-[#073B1B] border border-[#8BC53D]/20'
                }`}
                aria-pressed={isActive}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Header */}
      <div className="flex items-center justify-between mt-6 mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <span>
              {searchQuery.trim() !== ''
                ? `Search Results for "${searchQuery}"`
                : selectedCategory === 'favourites'
                ? `Your Saved Favourites (${favorites.length})`
                : MENU_CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'All Items'}
            </span>
          </h3>
          <span className="text-xs text-[#E2F0CC]/60 font-medium">
            {selectedCategory === 'favourites'
              ? `${filteredItems.length} items saved to your personal favourites`
              : `Showing ${filteredItems.length} artisan crafted items`}
          </span>
        </div>

        {searchQuery ? (
          <button
            onClick={() => onSelectCategory('combos')}
            className="text-xs text-[#8BC53D] hover:underline font-bold cursor-pointer"
          >
            Clear Search
          </button>
        ) : selectedCategory === 'favourites' && favorites.length > 0 ? (
          <button
            onClick={() => onSelectCategory('combos')}
            className="text-xs text-[#8BC53D] hover:underline font-bold cursor-pointer"
          >
            Browse All Menu
          </button>
        ) : null}
      </div>

      {/* Items Grid (1-col mobile, 2-col desktop) */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#012F13] rounded-3xl p-12 text-center border border-[#8BC53D]/20 my-8">
          <div className="w-16 h-16 rounded-full bg-[#011207] flex items-center justify-center mx-auto mb-4 text-2xl">
            {selectedCategory === 'favourites' ? (
              <Heart className="w-8 h-8 text-red-500 fill-red-500/20" />
            ) : (
              '🔍'
            )}
          </div>
          <h4 className="text-lg font-bold text-white mb-1">
            {selectedCategory === 'favourites'
              ? 'No favourites saved yet'
              : 'No food items found'}
          </h4>
          <p className="text-xs text-[#E2F0CC]/60 max-w-sm mx-auto mb-6">
            {selectedCategory === 'favourites'
              ? 'Tap the small heart button on any menu item or recipe card to quickly save your most loved dishes here.'
              : 'Try searching for something else like "Truffle", "Zinger", "Pepperoni", or explore our super saver combos.'}
          </p>
          <button
            onClick={() => onSelectCategory('combos')}
            className="px-6 py-2.5 rounded-full bg-[#8BC53D] text-[#011207] font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer hover:brightness-110 transition-all"
          >
            Show All Combos
          </button>
        </div>
      ) : (
        <div
          ref={cardsGridRef}
          data-reveal-stagger
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {filteredItems.map((item) => {
            const inCartQty = cartItemCounts[item.id] || 0;
            const isImgReady = loadedImages[item.id];
            const isFavorited = favorites.includes(item.id);

            return (
              <div
                key={item.id}
                className="group bg-[#012F13] rounded-2xl sm:rounded-3xl border border-[#8BC53D]/20 hover:border-[#8BC53D]/60 p-4 sm:p-5 flex gap-4 transition-all duration-300 shadow-md relative overflow-hidden"
              >
                {/* Left Food Image with Skeleton placeholder & Heart Button */}
                <div
                  onClick={() => onSelectFoodItem(item)}
                  className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 bg-[#011207] cursor-pointer"
                >
                  {/* Skeleton shimmer */}
                  {!isImgReady && (
                    <div className="absolute inset-0 bg-[#073B1B] animate-pulse" />
                  )}

                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onLoad={() => handleImageLoaded(item.id)}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 ${
                      isImgReady ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Mini Badges */}
                  {item.isPopular && (
                    <span className="absolute top-2 left-2 bg-[#8BC53D] text-[#011207] px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tight shadow">
                      Popular
                    </span>
                  )}
                  {item.isSpicy && !item.isPopular && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tight shadow">
                      Spicy
                    </span>
                  )}

                  {/* Small Heart Favourite Button on Menu Item */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleFavorite) {
                        onToggleFavorite(item.id, item.name);
                      }
                    }}
                    className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md active:scale-90 ${
                      isFavorited
                        ? 'bg-red-500/30 text-red-500 border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] scale-105'
                        : 'bg-[#011207]/80 text-[#E2F0CC]/70 hover:text-red-400 hover:bg-[#011207] border border-[#8BC53D]/30 hover:scale-110 hover:border-red-400/50'
                    }`}
                    aria-label={
                      isFavorited
                        ? `Remove ${item.name} from favourites`
                        : `Add ${item.name} to favourites`
                    }
                    title={isFavorited ? 'Remove from favourites' : 'Add to favourites'}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 ${
                        isFavorited
                          ? 'fill-red-500 stroke-red-500 scale-110 animate-bounce'
                          : 'stroke-current hover:stroke-red-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Right Body Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {/* Title and Price */}
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => onSelectFoodItem(item)}
                        className="text-base sm:text-lg font-bold text-white group-hover:text-[#8BC53D] transition-colors line-clamp-1 cursor-pointer"
                      >
                        {item.name}
                      </h4>
                    </div>

                    <p
                      onClick={() => onSelectFoodItem(item)}
                      className="text-xs text-[#E2F0CC]/60 line-clamp-2 mt-1 leading-relaxed cursor-pointer"
                    >
                      {item.description}
                    </p>

                    {/* Ingredient tags snippet */}
                    {item.tags && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {item.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono text-[#E2F0CC]/60 bg-[#011207] px-2 py-0.5 rounded border border-[#8BC53D]/10"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-3 mt-2 border-t border-[#8BC53D]/15 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sm sm:text-base font-black text-[#8BC53D] font-mono block">
                        PKR {item.price.toLocaleString()}
                      </span>
                      {item.originalPrice && (
                        <span className="text-[10px] text-[#E2F0CC]/40 line-through font-mono">
                          PKR {item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Customize / details button */}
                      <button
                        onClick={() => onSelectFoodItem(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#011207] hover:bg-[#073B1B] text-[10px] font-bold text-[#E2F0CC]/80 transition-colors cursor-pointer border border-[#8BC53D]/20"
                        aria-label={`Customize ${item.name}`}
                      >
                        Details
                      </button>

                      {/* Quick Add Button */}
                      <button
                        onClick={() => onQuickAdd(item)}
                        className={`h-9 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                          inCartQty > 0
                            ? 'bg-[#8BC53D] text-[#011207] hover:brightness-110 shadow-[#8BC53D]/30'
                            : 'bg-[#011207] hover:bg-[#8BC53D] hover:text-[#011207] text-[#E2F0CC] border border-[#8BC53D]/30'
                        }`}
                        aria-label={`Add ${item.name} to cart`}
                      >
                        {inCartQty > 0 ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>{inCartQty} in Cart</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>+ Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
