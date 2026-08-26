import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, AlertCircle, Sparkles, MapPin, Phone, User, FileText, CheckCircle2 } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../restaurant.config.ts';

export interface CartItem {
  id: string; // Unique cart item ID (combines item ID + options)
  originalId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  options: string[];
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  serviceMode: 'delivery' | 'takeaway';
  onToggleServiceMode: (mode: 'delivery' | 'takeaway') => void;
  onOrderPlacedSuccess?: (orderDetails: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    serviceMode: 'delivery' | 'takeaway';
    paymentMethod: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    grandTotal: number;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  serviceMode,
  onToggleServiceMode,
  onOrderPlacedSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('cod');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const minOrder = RESTAURANT_CONFIG.deliveryRules.minOrderValue;
  const isBelowMinOrder = serviceMode === 'delivery' && subtotal < minOrder && subtotal > 0;
  const amountToMinOrder = minOrder - subtotal;

  const isFreeDelivery = subtotal >= RESTAURANT_CONFIG.deliveryRules.freeDeliveryAbove;
  const deliveryFee = serviceMode === 'delivery' ? (isFreeDelivery ? 0 : RESTAURANT_CONFIG.deliveryRules.fee) : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckoutViaWhatsApp = () => {
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Add items to proceed.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMessage('Please enter your contact phone number.');
      return;
    }

    if (serviceMode === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please enter your complete delivery address.');
      return;
    }

    if (isBelowMinOrder) {
      setErrorMessage(`Minimum delivery order value is PKR ${minOrder}. Please add items worth PKR ${amountToMinOrder} more.`);
      return;
    }

    // Build the formatted WhatsApp order text
    const itemsList = items
      .map((item) => {
        let text = `• ${item.quantity}x ${item.name} — PKR ${(item.price * item.quantity).toLocaleString()}`;
        if (item.options && item.options.length > 0) {
          text += `\n  ↳ ${item.options.join(', ')}`;
        }
        return text;
      })
      .join('\n');

    const message = `🍔 *NEW ORDER — ${RESTAURANT_CONFIG.name}*
━━━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${customerName.trim()}
📞 *Phone:* ${customerPhone.trim()}
🛵 *Service Option:* ${serviceMode === 'delivery' ? 'Express Delivery' : 'Self Takeaway / Pickup'}
${serviceMode === 'delivery' ? `📍 *Delivery Address:* ${deliveryAddress.trim()}` : `🏬 *Pickup At:* Restaurant Counter (${RESTAURANT_CONFIG.takeawayRules.pickupEstimateMinutes} mins)`}
💳 *Payment:* ${paymentMethod === 'cod' ? 'Cash on Delivery / Pickup' : 'Online Bank Transfer'}
${specialNotes.trim() ? `📝 *Special Note:* ${specialNotes.trim()}` : ''}

🛒 *ITEMIZED ORDER:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━
💵 *Subtotal:* PKR ${subtotal.toLocaleString()}
🛵 *Delivery Fee:* ${deliveryFee === 0 ? (serviceMode === 'delivery' ? 'FREE PROMO' : 'PKR 0') : `PKR ${deliveryFee}`}
💰 *TOTAL AMOUNT:* PKR ${grandTotal.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━
Please confirm this order and estimated preparation time. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${RESTAURANT_CONFIG.phone}?text=${encodedMessage}`;

    window.open(waUrl, '_blank');

    // Notify parent to start real-time order tracking
    if (onOrderPlacedSuccess) {
      onOrderPlacedSuccess({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim() || 'Restaurant Pickup Counter',
        serviceMode,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Bank Transfer',
        items: [...items],
        subtotal,
        deliveryFee,
        grandTotal
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#011207]/85 backdrop-blur-sm"
          />

          {/* Slide-Over Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 380, mass: 0.8 }}
              className="w-screen max-w-md bg-[#012F13] border-l border-[#8BC53D]/30 shadow-2xl flex flex-col justify-between overflow-hidden will-change-transform"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#8BC53D]/20 bg-[#011207] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#8BC53D]/15 border border-[#8BC53D]/30 flex items-center justify-center text-[#8BC53D]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">
                      Your Food Order
                    </h3>
                    <span className="text-[11px] font-mono text-[#E2F0CC]/60">
                      {items.reduce((acc, i) => acc + i.quantity, 0)} Items Selected
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={onClearCart}
                      className="p-2 text-[#E2F0CC]/40 hover:text-red-400 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title="Clear Cart"
                      aria-label="Clear cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl bg-[#012F13] hover:bg-[#073B1B] text-[#E2F0CC]/70 hover:text-white flex items-center justify-center border border-[#8BC53D]/20 transition-colors cursor-pointer"
                    aria-label="Close cart drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Service Mode Selector in Cart */}
              <div className="p-4 bg-[#012F13] border-b border-[#8BC53D]/15 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-[#E2F0CC]/70 uppercase tracking-wider">
                  Order Type:
                </span>
                <div className="flex bg-[#011207] rounded-full p-1 border border-[#8BC53D]/20">
                  <button
                    onClick={() => onToggleServiceMode('delivery')}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      serviceMode === 'delivery'
                        ? 'bg-[#8BC53D] text-[#011207] shadow-[0_0_8px_rgba(139,197,61,0.3)]'
                        : 'text-[#E2F0CC]/50 hover:text-white'
                    }`}
                  >
                    🛵 Delivery
                  </button>
                  <button
                    onClick={() => onToggleServiceMode('takeaway')}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      serviceMode === 'takeaway'
                        ? 'bg-[#E2F0CC] text-[#011207] shadow-[0_0_8px_rgba(226,240,204,0.3)]'
                        : 'text-[#E2F0CC]/50 hover:text-white'
                    }`}
                  >
                    🛍️ Takeaway
                  </button>
                </div>
              </div>

              {/* Scrollable Body: Items + Checkout Fields */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {items.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#011207] border border-[#8BC53D]/20 flex items-center justify-center mx-auto mb-4 text-[#8BC53D] text-2xl">
                      🛒
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                      Cart is Empty
                    </h4>
                    <p className="text-xs text-[#E2F0CC]/60 max-w-xs mx-auto mb-6">
                      Explore our artisan menu and add your favorite burgers, pizzas, or saver combos.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-[#8BC53D] text-[#011207] text-xs font-black uppercase tracking-wider shadow-lg shadow-[#8BC53D]/20 cursor-pointer"
                    >
                      Start Ordering
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Minimum Order Value (MOV) Progress Notice */}
                    {serviceMode === 'delivery' && (
                      <div className="bg-[#011207] rounded-2xl p-4 border border-[#8BC53D]/20 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#E2F0CC]/70 font-medium">
                            Minimum Order Value (MOV):
                          </span>
                          <span className="font-mono font-bold text-white">
                            PKR {minOrder}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-[#012F13] rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              subtotal >= minOrder ? 'bg-[#8BC53D]' : 'bg-[#E2F0CC]'
                            }`}
                            style={{ width: `${Math.min(100, (subtotal / minOrder) * 100)}%` }}
                          />
                        </div>

                        {isBelowMinOrder ? (
                          <p className="text-[11px] text-[#E2F0CC] font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-[#8BC53D]" />
                            Add PKR {amountToMinOrder.toLocaleString()} more to meet delivery minimum
                          </p>
                        ) : (
                          <p className="text-[11px] text-[#8BC53D] font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Minimum delivery threshold reached!
                          </p>
                        )}
                      </div>
                    )}

                    {/* Free Delivery Banner if qualified */}
                    {serviceMode === 'delivery' && isFreeDelivery && (
                      <div className="bg-[#8BC53D]/15 border border-[#8BC53D]/40 rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs text-[#8BC53D] font-bold">
                        <Sparkles className="w-4 h-4 flex-shrink-0" />
                        <span>Eligible for FREE Express Delivery!</span>
                      </div>
                    )}

                    {/* Itemized Cart List */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-[#E2F0CC]/50 uppercase tracking-widest block">
                        Itemized Cart
                      </span>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#011207] rounded-2xl p-3.5 border border-[#8BC53D]/15 flex gap-3 items-center"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">
                              {item.name}
                            </h5>
                            {item.options && item.options.length > 0 && (
                              <p className="text-[10px] text-[#E2F0CC]/50 truncate mt-0.5">
                                {item.options.join(', ')}
                              </p>
                            )}
                            <span className="text-xs font-mono font-bold text-[#8BC53D] mt-1 block">
                              PKR {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>

                          {/* Stepper & Remove */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center bg-[#012F13] rounded-lg p-0.5 border border-[#8BC53D]/20">
                              <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded flex items-center justify-center text-[#E2F0CC]/70 hover:text-white"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-mono font-bold text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded flex items-center justify-center text-[#E2F0CC]/70 hover:text-white"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="p-1.5 text-[#E2F0CC]/40 hover:text-red-400 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Customer Information Form */}
                    <div className="space-y-4 pt-2 border-t border-[#8BC53D]/15">
                      <span className="text-[10px] font-bold text-[#E2F0CC]/50 uppercase tracking-widest block">
                        Delivery & Contact Details
                      </span>

                      {/* Name Input */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#E2F0CC]/80 uppercase mb-1 flex items-center gap-1.5">
                          <User className="w-3 h-3 text-[#8BC53D]" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Abdullah Khan"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-[#011207] text-xs text-white rounded-xl px-3.5 py-2.5 border border-[#8BC53D]/25 focus:border-[#8BC53D] focus:outline-none"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#E2F0CC]/80 uppercase mb-1 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-[#8BC53D]" />
                          WhatsApp Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 0334 1234567"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-[#011207] text-xs text-white rounded-xl px-3.5 py-2.5 border border-[#8BC53D]/25 focus:border-[#8BC53D] focus:outline-none"
                        />
                      </div>

                      {/* Delivery Address (only if delivery) */}
                      {serviceMode === 'delivery' && (
                        <div>
                          <label className="block text-[11px] font-bold text-[#E2F0CC]/80 uppercase mb-1 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-[#8BC53D]" />
                            Complete Delivery Address *
                          </label>
                          <textarea
                            required
                            rows={2}
                            placeholder="House / Apartment #, Street, Sector / Area name"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="w-full bg-[#011207] text-xs text-white rounded-xl px-3.5 py-2.5 border border-[#8BC53D]/25 focus:border-[#8BC53D] focus:outline-none resize-none"
                          />
                        </div>
                      )}

                      {/* Special Instructions */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#E2F0CC]/80 uppercase mb-1 flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#E2F0CC]/50" />
                          Special Kitchen Instructions (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Extra napkins, less spicy, ring doorbell"
                          value={specialNotes}
                          onChange={(e) => setSpecialNotes(e.target.value)}
                          className="w-full bg-[#011207] text-xs text-white rounded-xl px-3.5 py-2 border border-[#8BC53D]/25 focus:border-[#8BC53D] focus:outline-none"
                        />
                      </div>

                      {/* Payment Preference */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#E2F0CC]/80 uppercase mb-1.5">
                          Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('cod')}
                            className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                              paymentMethod === 'cod'
                                ? 'bg-[#8BC53D]/15 border-[#8BC53D] text-white'
                                : 'bg-[#011207] border-[#8BC53D]/15 text-[#E2F0CC]/60'
                            }`}
                          >
                            💵 Cash on {serviceMode === 'delivery' ? 'Delivery' : 'Pickup'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('transfer')}
                            className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                              paymentMethod === 'transfer'
                                ? 'bg-[#8BC53D]/15 border-[#8BC53D] text-white'
                                : 'bg-[#011207] border-[#8BC53D]/15 text-[#E2F0CC]/60'
                            }`}
                          >
                            📱 Online Transfer
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Error Notice */}
                    {errorMessage && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Drawer Footer & Checkout Action */}
              {items.length > 0 && (
                <div className="p-5 bg-[#011207] border-t border-[#8BC53D]/20 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#E2F0CC]/70">
                      <span>Subtotal</span>
                      <span className="font-mono text-white font-bold">
                        PKR {subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#E2F0CC]/70">
                      <span>{serviceMode === 'delivery' ? 'Express Delivery' : 'Pickup Fee'}</span>
                      <span className="font-mono text-[#8BC53D] font-bold">
                        {serviceMode === 'delivery'
                          ? isFreeDelivery
                            ? 'FREE'
                            : `PKR ${deliveryFee}`
                          : 'FREE'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#8BC53D]/20 flex justify-between items-center text-base">
                      <span className="font-black text-white uppercase">Total Amount</span>
                      <span className="font-black text-xl text-[#8BC53D] font-mono">
                        PKR {grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Instant WhatsApp Send Button */}
                  <button
                    onClick={handleCheckoutViaWhatsApp}
                    disabled={isBelowMinOrder}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 shadow-xl ${
                      isBelowMinOrder
                        ? 'bg-[#011207] text-[#E2F0CC]/30 border border-[#8BC53D]/10 cursor-not-allowed'
                        : 'bg-[#8BC53D] hover:bg-[#8BC53D]/90 text-[#011207] shadow-[#8BC53D]/25 cursor-pointer active:scale-[0.99]'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Order to WhatsApp & Track</span>
                  </button>

                  <p className="text-[10px] text-center text-[#E2F0CC]/50">
                    Official WhatsApp Target: <span className="font-mono text-[#8BC53D] font-bold">+{RESTAURANT_CONFIG.phone}</span>
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

