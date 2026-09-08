import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Check, Flame, Star, Sparkles, ShoppingBag, Heart } from 'lucide-react';
import { MenuItem } from '../restaurant.config';

interface ExpandableFoodModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, selectedOptions: string[], totalPrice: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (itemId: string, itemName?: string) => void;
}

export const ExpandableFoodModal: React.FC<ExpandableFoodModalProps> = ({
  item,
  onClose,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<{ [title: string]: { name: string; price: number } }>({});

  // Reset or initialize state when item opens
  React.useEffect(() => {
    if (item) {
      setQuantity(1);
      const defaults: { [title: string]: { name: string; price: number } } = {};
      if (item.customizations) {
        item.customizations.forEach((c) => {
          if (c.options.length > 0) {
            defaults[c.title] = c.options[0];
          }
        });
      }
      setSelectedCustomizations(defaults);
    }
  }, [item]);

  if (!item) return null;

  const optionsList = Object.values(selectedCustomizations) as { name: string; price: number }[];
  const extraTotal = optionsList.reduce((acc, opt) => acc + opt.price, 0);
  const singleUnitPrice = item.price + extraTotal;
  const totalPrice = singleUnitPrice * quantity;

  const handleSelectOption = (groupTitle: string, option: { name: string; price: number }) => {
    setSelectedCustomizations((prev) => ({
      ...prev,
      [groupTitle]: option
    }));
  };

  const handleConfirmAdd = () => {
    const entries = Object.entries(selectedCustomizations) as [string, { name: string; price: number }][];
    const formattedOptions = entries.map(
      ([title, opt]) => `${title}: ${opt.name}${opt.price > 0 ? ` (+PKR ${opt.price})` : ''}`
    );
    onAddToCart(item, quantity, formattedOptions, totalPrice);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#011207]/85 backdrop-blur-md"
        />

        {/* Modal Sheet / Dialog with Ultra-Fast Smooth Spring */}
        <motion.div
          layoutId={`food-card-${item.id}`}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", stiffness: 450, damping: 32, mass: 0.6 }}
          className="relative w-full max-w-xl bg-[#012F13] rounded-t-3xl sm:rounded-3xl border border-[#8BC53D]/30 shadow-2xl shadow-[#011207] overflow-hidden z-10 max-h-[92vh] flex flex-col will-change-transform"
        >
          {/* Mobile Sheet Drag Indicator Pill */}
          <div className="w-12 h-1.5 bg-[#E2F0CC]/20 rounded-full mx-auto mt-2 sm:hidden flex-shrink-0" />

          {/* Top Actions: Close & Favourite Buttons */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(item.id, item.name)}
                className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all cursor-pointer shadow-lg active:scale-90 ${
                  isFavorite
                    ? 'bg-red-500/30 text-red-500 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)] scale-105'
                    : 'bg-[#011207]/80 text-[#E2F0CC]/70 hover:text-red-400 hover:border-red-400/50 border-[#8BC53D]/20'
                }`}
                aria-label={isFavorite ? `Remove ${item.name} from favourites` : `Add ${item.name} to favourites`}
                title={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
              >
                <Heart
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isFavorite ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-current'
                  }`}
                />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#011207]/80 backdrop-blur-md text-[#E2F0CC]/70 hover:text-white flex items-center justify-center border border-[#8BC53D]/20 hover:border-[#8BC53D] transition-colors cursor-pointer shadow-lg"
              aria-label="Close food details modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Hero Image */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden flex-shrink-0 bg-[#011207]">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#012F13] via-transparent to-black/30" />

            {/* Tags on Image */}
            <div className="absolute bottom-4 left-5 flex flex-wrap items-center gap-2">
              {item.isPopular && (
                <span className="inline-flex items-center gap-1 bg-[#8BC53D] text-[#011207] px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-tight shadow">
                  <Star className="w-3 h-3 fill-current" />
                  Popular
                </span>
              )}
              {item.isSpicy && (
                <span className="inline-flex items-center gap-1 bg-red-500/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-tight shadow">
                  <Flame className="w-3 h-3 fill-current" />
                  Spicy
                </span>
              )}
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#011207]/90 backdrop-blur-sm text-[#E2F0CC] border border-[#8BC53D]/20 px-2.5 py-0.5 rounded-lg text-[10px] font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* Title & Price Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl text-white tracking-tight uppercase font-anton">
                  {item.name}
                </h3>
                <p className="text-[#E2F0CC]/70 text-sm mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-2xl font-black text-[#8BC53D] block">
                  PKR {singleUnitPrice.toLocaleString()}
                </span>
                {item.originalPrice && (
                  <span className="text-xs text-[#E2F0CC]/40 line-through">
                    PKR {item.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Fresh Ingredients Breakdown */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="bg-[#011207]/80 rounded-2xl p-4 border border-[#8BC53D]/20">
                <h4 className="text-xs font-bold text-[#8BC53D] uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8BC53D]" />
                  Fresh Ingredients & Composition
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#012F13] border border-[#8BC53D]/20 text-xs text-[#E2F0CC] font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Groups (if present) */}
            {item.customizations && item.customizations.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {group.title}
                  </h4>
                  <span className="text-[10px] text-[#8BC53D] uppercase">Required Choice</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {group.options.map((opt, optIndex) => {
                    const isSelected = selectedCustomizations[group.title]?.name === opt.name;
                    return (
                      <button
                        key={optIndex}
                        type="button"
                        onClick={() => handleSelectOption(group.title, opt)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#8BC53D]/15 border-[#8BC53D] text-white shadow-[0_0_15px_rgba(139,197,61,0.2)]'
                            : 'bg-[#011207] border-[#8BC53D]/15 text-[#E2F0CC]/70 hover:border-[#8BC53D]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#8BC53D] bg-[#8BC53D]' : 'border-[#8BC53D]/30'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-[#011207] stroke-[3]" />}
                          </div>
                          <span className="text-xs font-semibold">{opt.name}</span>
                        </div>

                        {opt.price > 0 && (
                          <span className="text-xs text-[#8BC53D] font-bold">
                            +PKR {opt.price}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:p-6 bg-[#011207] border-t border-[#8BC53D]/20 flex items-center gap-4 flex-shrink-0">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-[#012F13] border border-[#8BC53D]/30 rounded-2xl p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#E2F0CC]/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#E2F0CC]/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Instant Add to Cart CTA */}
            <button
              onClick={handleConfirmAdd}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-[#8BC53D] hover:bg-[#8BC53D]/90 text-[#011207] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-between shadow-lg shadow-[#8BC53D]/20 transition-all active:scale-[0.99] cursor-pointer"
              aria-label={`Add ${quantity} item to cart`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </div>
              <span className="text-sm sm:text-base font-black">
                PKR {totalPrice.toLocaleString()}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
