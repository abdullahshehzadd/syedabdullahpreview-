import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from './CartDrawer';

interface FloatingCartBarProps {
  items: CartItem[];
  onOpenCart: () => void;
  serviceMode: 'delivery' | 'takeaway';
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  items,
  onOpenCart,
  serviceMode
}) => {
  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  if (totalCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-24 z-30 sm:max-w-md w-auto"
      >
        <div
          onClick={onOpenCart}
          className="bg-[#012F13]/95 backdrop-blur-md border border-[#8BC53D]/60 rounded-2xl p-3.5 sm:px-5 sm:py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4 cursor-pointer hover:border-[#8BC53D] group transition-all"
        >
          {/* Count Badge + Subtotal */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-[#8BC53D] text-[#011207] flex items-center justify-center font-black text-xs font-mono shadow-md">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#011207] text-[#8BC53D] border border-[#8BC53D] text-[10px] flex items-center justify-center font-bold">
                {totalCount}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#E2F0CC]/60 uppercase tracking-widest block">
                {serviceMode === 'delivery' ? 'Delivery Cart' : 'Takeaway Cart'}
              </span>
              <span className="text-sm sm:text-base font-black text-white font-mono">
                PKR {subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-2 bg-[#8BC53D] text-[#011207] px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider group-hover:brightness-110 shadow-md shadow-[#8BC53D]/25 transition-all">
            <span>Review Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
