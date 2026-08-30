import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Utensils, 
  ShoppingBag, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  CheckCircle2, 
  Sparkles,
  Award,
  Timer,
  Heart
} from 'lucide-react';
import { MenuItem } from '../restaurant.config.ts';

interface Skiper19ScrollHeroProps {
  onScrollToHero: () => void;
  onScrollToMenu: () => void;
  onSelectFoodItem: (item: MenuItem) => void;
  onAddToCart?: (item: MenuItem) => void;
  favorites?: string[];
  onToggleFavorite?: (itemId: string, itemName?: string) => void;
}

interface SignatureItem {
  id: string;
  categoryLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  priceFormatted: string;
  description: string;
  tags: string[];
  dish: MenuItem;
  image: string;
  accentColor: string;
  craftFact: string;
  prepTime: string;
}

const SIGNATURE_ITEMS: SignatureItem[] = [
  {
    id: 'smash-burger',
    categoryLabel: 'Prime Smashed Wagyu',
    badge: 'Chef Choice',
    title: 'Smokey Truffle Beef Burger',
    subtitle: '450°C Searing • Crispy Caramelized Edges',
    priceFormatted: 'PKR 1,850',
    description: 'Double 100% halal chuck beef patties smashed ultra-thin on smoking steel to caramelize crust, laced with black truffle emulsion and aged provolone on toasted butter brioche.',
    tags: ['Double Wagyu', 'Black Truffle', 'Aged Provolone', 'Brioche'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    accentColor: '#8BC53D',
    craftFact: 'Smashed within 10 seconds of hitting 450°C griddle for maillard crust',
    prepTime: '12-15 Mins',
    dish: {
      id: 'burger-truffle',
      name: 'Smokey Truffle Beef Burger',
      category: 'burgers',
      price: 1850,
      originalPrice: 2050,
      description: 'Double smash prime beef patties, black truffle aioli, aged smoked provolone on brioche.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
      isPopular: true,
      ingredients: ['Prime Chuck Beef', 'Black Truffle Emulsion', 'Smoked Provolone', 'Toasted Brioche'],
      tags: ['100% Wagyu', 'Chef Pick']
    }
  },
  {
    id: 'woodfire-pizza',
    categoryLabel: '48-Hr Fermented Sourdough',
    badge: 'Stone Baked',
    title: 'Artisan Pepperoni Sourdough',
    subtitle: '500°C Stone Oven • Charred Leopard Crust',
    priceFormatted: 'PKR 1,200',
    description: 'Slow-fermented artisan sourdough stretched by hand, layered with San Marzano DOP reduction, whole milk mozzarella, and spicy beef pepperoni crisped into natural oil cups.',
    tags: ['48hr Sourdough', 'San Marzano DOP', 'Beef Pepperoni', 'Woodfired'],
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800',
    accentColor: '#F59E0B',
    craftFact: 'Baked directly on volcanic stone deck in 90 seconds flat',
    prepTime: '15-18 Mins',
    dish: {
      id: 'pizza-pepperoni',
      name: 'Artisan Pepperoni Pizza',
      category: 'pizza',
      price: 1200,
      originalPrice: 1400,
      description: 'Slow-fermented thin sourdough crust, San Marzano tomato reduction, whole milk mozzarella, crispy beef pepperoni.',
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800',
      isPopular: true,
      ingredients: ['48-hr Sourdough', 'San Marzano DOP', 'Mozzarella', 'Beef Pepperoni'],
      tags: ['Woodfired', 'Crisp Crust']
    }
  },
  {
    id: 'buffalo-wings',
    categoryLabel: 'Aged Cayenne Glaze',
    badge: 'Express Hot',
    title: 'Buffalo Chicken Wings (8 Pcs)',
    subtitle: 'Buttermilk Brined • Thermal Foil Packed',
    priceFormatted: 'PKR 850',
    description: 'Jumbo buttermilk-brined crispy wings tossed in bubbling aged cayenne buffalo butter glaze, packed in heat-lock foil to arrive scorching hot at your doorstep.',
    tags: ['Cayenne Glaze', 'House Ranch', 'Thermal Lock', '30-Min Fast'],
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800',
    accentColor: '#EF4444',
    craftFact: 'Double-fried for glass-like crunch that holds sauce without getting soggy',
    prepTime: '10-12 Mins',
    dish: {
      id: 'wings-buffalo',
      name: 'Buffalo Chicken Wings (8 Pcs)',
      category: 'wings',
      price: 850,
      originalPrice: 990,
      description: 'Jumbo crispy chicken wings tossed in signature buttery aged cayenne buffalo glaze with house ranch.',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800',
      isSpicy: true,
      isPopular: true,
      ingredients: ['Crispy Wings', 'Cayenne Glaze', 'House Ranch'],
      tags: ['8 Pcs', 'Crispy']
    }
  }
];

export const Skiper19ScrollHero: React.FC<Skiper19ScrollHeroProps> = ({
  onScrollToMenu,
  onSelectFoodItem,
  onAddToCart,
  favorites = [],
  onToggleFavorite
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const activeItem = SIGNATURE_ITEMS[activeIndex];
  const isFavorited = favorites.includes(activeItem.dish.id);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? SIGNATURE_ITEMS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === SIGNATURE_ITEMS.length - 1 ? 0 : prev + 1));
  };

  const handleQuickAdd = (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(dish);
      setAddedItemName(dish.name);
      setTimeout(() => setAddedItemName(null), 2000);
    } else {
      onSelectFoodItem(dish);
    }
  };

  return (
    <section 
      id="signature-showcase" 
      className="relative w-full py-8 sm:py-12 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header & Dish Selector */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8BC53D]/15 border border-[#8BC53D]/30 text-[#8BC53D] text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chef's Signature Recipes</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase italic">
              Master Craft <span className="text-[#8BC53D]">Creations</span>
            </h2>
            <p className="text-[#E2F0CC]/70 text-xs sm:text-sm mt-1 max-w-xl">
              Authentic artisanal recipes prepared with 450°C sear, 48-hr slow-fermented doughs, and house-made reductions.
            </p>
          </div>

          {/* Dish Tab Switcher & Navigation Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <div className="flex items-center bg-[#012F13] p-1 rounded-2xl border border-[#8BC53D]/25">
              {SIGNATURE_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    activeIndex === idx
                      ? 'bg-[#8BC53D] text-[#011207] shadow-sm font-black'
                      : 'text-[#E2F0CC]/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.categoryLabel.split(' ')[0]}</span>
                  {activeIndex === idx && <span className="w-1.5 h-1.5 rounded-full bg-[#011207]" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-[#012F13] hover:bg-[#073B1B] text-white border border-[#8BC53D]/30 transition-colors cursor-pointer active:scale-95"
                title="Previous recipe"
                aria-label="Previous recipe"
              >
                <ChevronLeft className="w-4 h-4 text-[#8BC53D]" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-[#012F13] hover:bg-[#073B1B] text-white border border-[#8BC53D]/30 transition-colors cursor-pointer active:scale-95"
                title="Next recipe"
                aria-label="Next recipe"
              >
                <ChevronRight className="w-4 h-4 text-[#8BC53D]" />
              </button>
            </div>

            <button
              onClick={onScrollToMenu}
              className="px-3.5 py-2 rounded-xl bg-[#012F13] hover:bg-[#073B1B] text-white text-xs font-bold border border-[#8BC53D]/30 transition-colors flex items-center gap-1 cursor-pointer hidden md:flex"
            >
              <span>Full Menu</span>
              <Utensils className="w-3.5 h-3.5 text-[#8BC53D]" />
            </button>
          </div>
        </div>

        {/* Dynamic Showcase Card */}
        <div className="relative bg-[#012F13] rounded-2xl sm:rounded-3xl border border-[#8BC53D]/30 p-4 sm:p-7 overflow-hidden shadow-2xl">
          
          {/* Ambient Background Glow */}
          <div 
            style={{ backgroundColor: activeItem.accentColor }}
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[100px] opacity-15 pointer-events-none transition-colors duration-500"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center"
            >
              {/* Left Column: Food Visual Box */}
              <div className="lg:col-span-6 relative">
                <div 
                  className="relative h-56 sm:h-72 md:h-84 rounded-xl sm:rounded-2xl overflow-hidden bg-[#011207] border border-[#8BC53D]/30 group cursor-pointer"
                  onClick={() => onSelectFoodItem(activeItem.dish)}
                >
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011207]/90 via-[#011207]/20 to-transparent" />

                  {/* Badge */}
                  <div 
                    style={{ backgroundColor: activeItem.accentColor }}
                    className="absolute top-3.5 left-3.5 text-[#011207] px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-tight shadow-md flex items-center gap-1"
                  >
                    <Award className="w-3 h-3" />
                    <span>{activeItem.badge}</span>
                  </div>

                  {/* Price Tag & Favourite Button */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
                    {onToggleFavorite && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(activeItem.dish.id, activeItem.dish.name);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md active:scale-90 ${
                          isFavorited
                            ? 'bg-red-500/30 text-red-500 border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] scale-105'
                            : 'bg-[#011207]/90 text-[#E2F0CC]/70 hover:text-red-400 border border-[#8BC53D]/40 hover:scale-110 hover:border-red-400/50'
                        }`}
                        aria-label={
                          isFavorited
                            ? `Remove ${activeItem.dish.name} from favourites`
                            : `Add ${activeItem.dish.name} to favourites`
                        }
                        title={isFavorited ? 'Remove from favourites' : 'Add to favourites'}
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isFavorited
                              ? 'fill-red-500 stroke-red-500 scale-110'
                              : 'stroke-current hover:stroke-red-400'
                          }`}
                        />
                      </button>
                    )}

                    <div className="bg-[#011207]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-[#8BC53D]/40 text-xs sm:text-sm font-black text-[#8BC53D] font-mono shadow-md">
                      {activeItem.priceFormatted}
                    </div>
                  </div>

                  {/* Bottom Fact Box */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-white/90 bg-[#011207]/90 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
                    <span className="truncate">{activeItem.craftFact}</span>
                    <span className="text-[#8BC53D] font-bold flex items-center gap-1 flex-shrink-0 ml-2">
                      <Eye className="w-3 h-3" /> View Recipe
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Dish Narrative & Action Engine */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-3 sm:space-y-4">
                
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#8BC53D] uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{activeItem.categoryLabel}</span>
                  </div>
                  
                  <div className="inline-flex items-center gap-1 text-[11px] font-mono text-[#E2F0CC]/70 bg-[#011207] px-2 py-0.5 rounded-md border border-[#8BC53D]/20">
                    <Timer className="w-3 h-3 text-[#8BC53D]" />
                    <span>Prep: {activeItem.prepTime}</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-snug">
                  {activeItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#E2F0CC]/80 leading-relaxed">
                  {activeItem.description}
                </p>

                {/* Ingredient & Craft Tags */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#8BC53D] mb-1.5 font-bold">
                    Key Ingredients & Notes:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeItem.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#011207] border border-[#8BC53D]/25 text-[#E2F0CC] text-[11px] font-mono font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buttons Action Bar */}
                <div className="pt-2 sm:pt-3 border-t border-[#8BC53D]/20 flex flex-row items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => onSelectFoodItem(activeItem.dish)}
                    className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#011207] hover:bg-[#073B1B] text-[#E2F0CC] font-bold text-xs sm:text-sm border border-[#8BC53D]/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#8BC53D]" />
                    <span>Customize</span>
                  </button>

                  <button
                    onClick={(e) => handleQuickAdd(activeItem.dish, e)}
                    className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-[#8BC53D] hover:bg-[#8BC53D]/90 text-[#011207] font-black text-xs sm:text-sm uppercase tracking-wider transition-transform flex items-center justify-center gap-1.5 shadow-md shadow-[#8BC53D]/20 active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>+ Add to Cart</span>
                  </button>
                </div>

                {/* Dish Selector Indicator Dots */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-[#E2F0CC]/60 font-mono">
                  <div className="flex items-center gap-1.5">
                    {SIGNATURE_ITEMS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                          activeIndex === idx
                            ? 'w-6 bg-[#8BC53D]'
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Recipe ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <span className="text-[#8BC53D] font-bold text-[11px]">
                    Recipe {activeIndex + 1} of {SIGNATURE_ITEMS.length}
                  </span>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Quick Add Popover Alert */}
      <AnimatePresence>
        {addedItemName && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#012F13] border-2 border-[#8BC53D] text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold pointer-events-none"
          >
            <CheckCircle2 className="w-4 h-4 text-[#8BC53D]" />
            <span>Added "{addedItemName}" directly to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
