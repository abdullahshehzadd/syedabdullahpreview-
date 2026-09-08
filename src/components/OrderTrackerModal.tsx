import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Bike,
  ChefHat,
  PackageCheck,
  Sparkles,
  RefreshCw,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { RESTAURANT_CONFIG } from '../restaurant.config';
import { CartItem } from './CartDrawer';
import { PostOrderFeedbackForm, CustomerFeedback } from './PostOrderFeedbackForm';
import { LottieProgressMilestoneBar } from './LottieProgressMilestoneBar';

export type OrderStatus = 'Order Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered';

export interface TrackedOrder {
  id: string;
  orderNumber: string;
  placedAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  serviceMode: 'delivery' | 'takeaway';
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  status: OrderStatus;
  estimatedArrivalMinutes: number;
  riderName: string;
  riderPhone: string;
  riderVehicle: string;
  riderRating: number;
}

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: TrackedOrder | null;
  onUpdateOrderStatus?: (newStatus: OrderStatus) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateOrderStatus
}) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('Order Placed');
  const [autoProgressEnabled, setAutoProgressEnabled] = useState<boolean>(true);
  const [activeViewTab, setActiveViewTab] = useState<'tracking' | 'feedback'>('tracking');
  const [feedbackData, setFeedbackData] = useState<CustomerFeedback | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(25);

  // Sync internal status with prop
  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status || 'Order Placed');
      if (order.status === 'Delivered') {
        // Automatically switch or highlight feedback view
        setActiveViewTab('feedback');
      }
    }
  }, [order]);

  // Steps definition
  const steps: { id: OrderStatus; title: string; desc: string; icon: any; percent: number }[] = [
    {
      id: 'Order Placed',
      title: 'Order Placed',
      desc: 'WhatsApp receipt verified & dispatched to kitchen',
      icon: PackageCheck,
      percent: 25
    },
    {
      id: 'Preparing',
      title: 'Kitchen Preparing',
      desc: 'Smash sear & artisan woodfire baking in progress',
      icon: ChefHat,
      percent: 50
    },
    {
      id: 'Out for Delivery',
      title: 'Out for Delivery',
      desc: 'Thermal pack sealed • Rider en route to your address',
      icon: Bike,
      percent: 75
    },
    {
      id: 'Delivered',
      title: 'Delivered Fresh',
      desc: 'Order safely handed over at your doorstep',
      icon: CheckCircle2,
      percent: 100
    }
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStatus);

  // Automatic status progression timer simulation
  useEffect(() => {
    if (!isOpen || !autoProgressEnabled || currentStatus === 'Delivered') return;

    const timer = setTimeout(() => {
      if (currentStatus === 'Order Placed') {
        handleSetStatus('Preparing');
      } else if (currentStatus === 'Preparing') {
        handleSetStatus('Out for Delivery');
      } else if (currentStatus === 'Out for Delivery') {
        handleSetStatus('Delivered');
      }
    }, 12000); // 12-second progression per step in live simulation

    return () => clearTimeout(timer);
  }, [isOpen, currentStatus, autoProgressEnabled]);

  const handleSetStatus = (status: OrderStatus) => {
    setCurrentStatus(status);
    const targetStep = steps.find((s) => s.id === status);
    if (targetStep) {
      setProgressPercent(targetStep.percent);
    }
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(status);
    }
  };

  if (!isOpen) return null;

  // Default fallback order if opened directly
  const activeOrder: TrackedOrder = order || {
    id: 'demo-order-1',
    orderNumber: '#DR-8492',
    placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    customerName: 'Demo Diner',
    customerPhone: '+92 334 7383967',
    deliveryAddress: 'Sector F-7/2, Street 18, Islamabad',
    serviceMode: 'delivery',
    paymentMethod: 'Cash on Delivery',
    items: [
      {
        id: '1',
        originalId: 'burger-truffle',
        name: 'Smokey Truffle Beef Burger',
        price: 1850,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        options: ['Double Wagyu Patty', 'Extra Smoked Provolone']
      },
      {
        id: '2',
        originalId: 'wings-buffalo',
        name: 'Buffalo Chicken Wings (8 Pcs)',
        price: 850,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
        options: ['Signature Hot Buffalo']
      }
    ],
    subtotal: 4550,
    deliveryFee: 0,
    grandTotal: 4550,
    status: currentStatus,
    estimatedArrivalMinutes: currentStatus === 'Delivered' ? 0 : currentStatus === 'Out for Delivery' ? 12 : 28,
    riderName: 'Farhan Ali',
    riderPhone: '+923347383967',
    riderVehicle: 'Honda 125 • Thermal Insulated Box #12',
    riderRating: 4.9
  };

  // Coordinates for animated rider along simulated vector map path
  const riderPathOffset =
    currentStatus === 'Order Placed'
      ? { x: 20, y: 30 }
      : currentStatus === 'Preparing'
      ? { x: 35, y: 40 }
      : currentStatus === 'Out for Delivery'
      ? { x: 62, y: 55 }
      : { x: 82, y: 70 };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#011207]/90 backdrop-blur-md"
        />

        {/* Tracker Container Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative w-full max-w-2xl bg-[#012F13] rounded-3xl border border-[#8BC53D]/30 shadow-2xl shadow-[#011207] p-5 sm:p-8 z-10 space-y-6 overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#8BC53D]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8BC53D] text-[#011207] flex items-center justify-center font-black">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                    Live Order Tracker
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8BC53D]/20 border border-[#8BC53D]/40 text-[#8BC53D] text-[10px] font-mono font-bold">
                    {activeOrder.orderNumber}
                  </span>
                </div>
                <p className="text-xs text-[#E2F0CC]/60 font-medium">
                  Real-time GPS dispatch & kitchen status synchronization
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#011207]/80 text-[#E2F0CC]/70 hover:text-white flex items-center justify-center border border-[#8BC53D]/20 transition-colors cursor-pointer"
              aria-label="Close order tracker"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* View Mode Switcher Tab */}
          <div className="flex items-center gap-2 bg-[#011207] p-1.5 rounded-2xl border border-[#8BC53D]/25">
            <button
              onClick={() => setActiveViewTab('tracking')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeViewTab === 'tracking'
                  ? 'bg-[#8BC53D] text-[#011207] shadow-md shadow-[#8BC53D]/20'
                  : 'text-[#E2F0CC]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Live Tracking & Route</span>
            </button>

            <button
              onClick={() => setActiveViewTab('feedback')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeViewTab === 'feedback'
                  ? 'bg-[#8BC53D] text-[#011207] shadow-md shadow-[#8BC53D]/20'
                  : 'text-[#E2F0CC]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Customer Feedback</span>
              <span className="hidden sm:inline px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-mono font-bold">
                10% Off
              </span>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto space-y-6 pr-1">
            {activeViewTab === 'feedback' ? (
              <PostOrderFeedbackForm
                orderId={activeOrder.id}
                orderNumber={activeOrder.orderNumber}
                items={activeOrder.items.map((i) => ({ name: i.name, quantity: i.quantity }))}
                onFeedbackSubmitted={(data) => setFeedbackData(data)}
              />
            ) : (
              <>
                {/* Real-time ETA Highlight Card */}
                <div className="bg-[#011207] rounded-2xl p-4 sm:p-5 border border-[#8BC53D]/30 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#8BC53D]/20 border border-[#8BC53D] flex items-center justify-center text-[#8BC53D]">
                        <Clock className="w-6 h-6 animate-spin-slow" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#8BC53D] animate-ping" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#8BC53D] block">
                        Estimated Delivery
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                        {currentStatus === 'Delivered'
                          ? 'Arrived & Delivered'
                          : `${activeOrder.estimatedArrivalMinutes} Minutes`}
                      </div>
                      <span className="text-xs text-[#E2F0CC]/60">
                        Target: {activeOrder.deliveryAddress}
                      </span>
                    </div>
                  </div>

                  {/* Status Simulation Bar */}
                  <div className="flex items-center gap-2 bg-[#012F13] p-1.5 rounded-xl border border-[#8BC53D]/20 self-stretch sm:self-auto justify-between">
                    <div className="text-[10px] text-[#E2F0CC]/60 px-2 font-mono">Simulate:</div>
                    <div className="flex gap-1 overflow-x-auto">
                      {steps.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleSetStatus(s.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            currentStatus === s.id
                              ? 'bg-[#8BC53D] text-[#011207] shadow'
                              : 'bg-[#011207] text-[#E2F0CC]/60 hover:text-white'
                          }`}
                        >
                          {s.id.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Lottie-Style Animated Milestone Progress Bar */}
                <LottieProgressMilestoneBar
                  currentStatus={currentStatus}
                  onSelectMilestone={(status) => handleSetStatus(status)}
                />

                {/* Advanced Interactive Live Vector Map */}
                <div className="relative h-56 sm:h-64 rounded-3xl overflow-hidden bg-[#011207] border border-[#8BC53D]/30 p-4 flex flex-col justify-between shadow-inner">
                  {/* Vector Grid & Stylized Road Background */}
                  <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(139, 197, 61, 0.15)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#cityGrid)" />

                    {/* Simulated Road Paths */}
                    <path
                      d="M 50 80 Q 180 60 260 120 T 450 140 T 600 200"
                      fill="none"
                      stroke="rgba(139, 197, 61, 0.25)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 120 20 L 120 240 M 320 20 L 320 240 M 520 20 L 520 240"
                      fill="none"
                      stroke="rgba(226, 240, 204, 0.08)"
                      strokeWidth="4"
                      strokeDasharray="4 6"
                    />

                    {/* Active Glowing Delivery Path */}
                    <motion.path
                      d="M 50 80 Q 180 60 260 120 T 450 140 T 600 200"
                      fill="none"
                      stroke="#8BC53D"
                      strokeWidth="5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0.2 }}
                      animate={{
                        pathLength:
                          currentStatus === 'Order Placed'
                            ? 0.15
                            : currentStatus === 'Preparing'
                            ? 0.35
                            : currentStatus === 'Out for Delivery'
                            ? 0.75
                            : 1
                      }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                    />
                  </svg>

                  {/* Kitchen Hub Marker */}
                  <div className="absolute top-10 left-8 z-10 flex items-center gap-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-[#8BC53D] text-[#011207] flex items-center justify-center font-bold text-xs shadow-lg shadow-[#8BC53D]/40">
                        🍳
                      </div>
                      <div className="absolute inset-0 rounded-full bg-[#8BC53D] animate-ping opacity-30" />
                    </div>
                    <div className="bg-[#012F13]/90 backdrop-blur-sm border border-[#8BC53D]/40 px-2.5 py-1 rounded-xl text-[10px]">
                      <span className="font-bold text-white block">{RESTAURANT_CONFIG.name} Hub</span>
                      <span className="text-[#8BC53D] text-[9px]">Kitchen Dispatch</span>
                    </div>
                  </div>

                  {/* Customer Destination Marker */}
                  <div className="absolute bottom-6 right-8 z-10 flex items-center gap-2">
                    <div className="bg-[#012F13]/90 backdrop-blur-sm border border-[#8BC53D]/40 px-2.5 py-1 rounded-xl text-[10px] text-right">
                      <span className="font-bold text-white block">Your Doorstep</span>
                      <span className="text-[#E2F0CC]/60 text-[9px]">Delivery Destination</span>
                    </div>
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-[#E2F0CC] text-[#011207] flex items-center justify-center font-bold text-xs shadow-lg">
                        📍
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Animated Rider Pin along Route */}
                  <motion.div
                    className="absolute z-20"
                    animate={{
                      left: `${riderPathOffset.x}%`,
                      top: `${riderPathOffset.y}%`
                    }}
                    transition={{ duration: 0.8, type: 'spring', damping: 20 }}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-2xl bg-[#8BC53D] text-[#011207] flex items-center justify-center shadow-2xl shadow-[#8BC53D]/50 border-2 border-white animate-bounce">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div className="mt-1 bg-[#011207]/95 border border-[#8BC53D] px-2 py-0.5 rounded-md text-[9px] font-mono text-[#8BC53D] whitespace-nowrap shadow-md">
                        {currentStatus === 'Out for Delivery' ? '⚡ Express En Route' : currentStatus}
                      </div>
                    </div>
                  </motion.div>

                  {/* Map Controls / Live GPS Badge */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <div className="inline-flex items-center gap-1.5 bg-[#011207]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#8BC53D]/30 text-[10px] text-[#8BC53D] font-mono font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#8BC53D] animate-ping" />
                      <span>LIVE DISPATCH ACTIVE</span>
                    </div>

                    <div className="text-[10px] text-white/70 bg-[#011207]/80 px-2.5 py-1 rounded-full font-mono">
                      Estimated ~12 mins away
                    </div>
                  </div>
                </div>

                {/* Rider Information Card */}
                <div className="bg-[#011207] rounded-2xl p-4 border border-[#8BC53D]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#012F13] border border-[#8BC53D]/40 flex items-center justify-center text-lg font-black text-[#8BC53D] flex-shrink-0">
                      FA
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-white">{activeOrder.riderName}</h5>
                        <span className="px-2 py-0.5 rounded bg-[#8BC53D]/20 text-[#8BC53D] text-[10px] font-mono font-bold">
                          ⭐ {activeOrder.riderRating}
                        </span>
                      </div>
                      <p className="text-xs text-[#E2F0CC]/60 mt-0.5">{activeOrder.riderVehicle}</p>
                    </div>
                  </div>

                  {/* Call / WhatsApp Rider Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`tel:${activeOrder.riderPhone}`}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#012F13] hover:bg-[#073B1B] text-white text-xs font-bold border border-[#8BC53D]/30 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#8BC53D]" />
                      <span>Call Rider</span>
                    </a>
                    <a
                      href={`https://wa.me/${RESTAURANT_CONFIG.phone}?text=${encodeURIComponent(
                        `Hi, checking on active order ${activeOrder.orderNumber}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#8BC53D] hover:bg-[#8BC53D]/90 text-[#011207] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Order Items & Receipt Summary Accordion */}
                <div className="bg-[#011207] rounded-2xl p-4 border border-[#8BC53D]/20 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#8BC53D]/10">
                    <span className="font-bold text-[#E2F0CC]/70 uppercase tracking-wider">
                      Order Summary ({activeOrder.items.length} items)
                    </span>
                    <span className="font-mono text-[#8BC53D] font-bold">
                      PKR {activeOrder.grandTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#8BC53D]">{item.quantity}x</span>
                          <span className="text-white">{item.name}</span>
                        </div>
                        <span className="font-mono text-[#E2F0CC]/80">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivered Section: Embedded Feedback Form when status is Delivered */}
                {currentStatus === 'Delivered' && (
                  <PostOrderFeedbackForm
                    orderId={activeOrder.id}
                    orderNumber={activeOrder.orderNumber}
                    items={activeOrder.items.map((i) => ({ name: i.name, quantity: i.quantity }))}
                    onFeedbackSubmitted={(data) => setFeedbackData(data)}
                  />
                )}
              </>
            )}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#8BC53D]/20 flex items-center justify-between gap-3">
            <div className="text-xs text-[#E2F0CC]/60 font-mono">
              Status updates automatically every few seconds.
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
