import React, { useState, useEffect } from 'react';
import { RESTAURANT_CONFIG, MenuItem, SignatureDeal, MENU_ITEMS } from './restaurant.config.ts';
import { Header } from './components/Header.tsx';
import { Skiper19 } from './components/Skiper19.tsx';
import { Skiper19ScrollHero } from './components/Skiper19ScrollHero.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { StickyScrollCards } from './components/StickyScrollCards.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { GoogleReviewsSection } from './components/GoogleReviewsSection.tsx';
import { SocialProofWorkflow } from './components/SocialProofWorkflow.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer, CartItem } from './components/CartDrawer.tsx';
import { FloatingCartBar } from './components/FloatingCartBar.tsx';
import { ExpandableFoodModal } from './components/ExpandableFoodModal.tsx';
import { DirectionsHoursModal } from './components/DirectionsHoursModal.tsx';
import { OrderTrackerModal, TrackedOrder, OrderStatus } from './components/OrderTrackerModal.tsx';
import { Skiper89ScrollBadge } from './components/Skiper89ScrollBadge.tsx';
import { CheckCircle } from 'lucide-react';

export default function App() {
  const [serviceMode, setServiceMode] = useState<'delivery' | 'takeaway'>('delivery');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('demo_restaurant_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('combos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  const [activeTrackedOrder, setActiveTrackedOrder] = useState<TrackedOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('demo_restaurant_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Toast notification auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Quick add from card (optimistic UI <16ms)
  const handleQuickAdd = (item: MenuItem) => {
    const cartItemId = item.id;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) => (i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            originalId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image,
            options: []
          }
        ];
      }
    });
    showToast(`Added "${item.name}" to cart`);
  };

  // Add customized item from modal
  const handleAddFromModal = (
    item: MenuItem,
    quantity: number,
    selectedOptions: string[],
    totalPrice: number
  ) => {
    const singlePrice = totalPrice / quantity;
    const cartItemId = `${item.id}-${selectedOptions.join('_')}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            originalId: item.id,
            name: item.name,
            price: singlePrice,
            quantity,
            image: item.image,
            options: selectedOptions
          }
        ];
      }
    });
    showToast(`Added ${quantity}x "${item.name}" to cart`);
  };

  // Add signature deal
  const handleAddDeal = (deal: SignatureDeal) => {
    const cartItemId = deal.id;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) => (i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            originalId: deal.id,
            name: deal.title,
            price: deal.price,
            quantity: 1,
            image: deal.image,
            options: deal.itemsIncluded
          }
        ];
      }
    });
    showToast(`Added "${deal.title}" to cart`);
  };

  // Select deal to view as modal item
  const handleSelectDeal = (deal: SignatureDeal) => {
    const dealAsMenuItem: MenuItem = {
      id: deal.id,
      name: deal.title,
      category: 'combos',
      price: deal.price,
      originalPrice: deal.originalPrice,
      description: deal.description,
      image: deal.image,
      ingredients: deal.itemsIncluded,
      tags: [deal.tag, 'Signature Deal', 'Feast Box'],
      isPopular: true
    };
    setActiveModalItem(dealAsMenuItem);
  };

  // Update item quantity in cart
  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Cart cleared');
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHero = () => {
    const el = document.getElementById('hero-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Item counts mapped by originalId for quick card badges
  const cartItemCounts = cartItems.reduce<{ [id: string]: number }>((acc, item) => {
    acc[item.originalId] = (acc[item.originalId] || 0) + item.quantity;
    return acc;
  }, {});

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // Handle successful order creation via WhatsApp
  const handleOrderPlacedSuccess = (orderDetails: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    serviceMode: 'delivery' | 'takeaway';
    paymentMethod: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    grandTotal: number;
  }) => {
    const newTrackedOrder: TrackedOrder = {
      id: `order-${Date.now()}`,
      orderNumber: `#DR-${Math.floor(1000 + Math.random() * 9000)}`,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: orderDetails.customerName,
      customerPhone: orderDetails.customerPhone,
      deliveryAddress: orderDetails.deliveryAddress,
      serviceMode: orderDetails.serviceMode,
      paymentMethod: orderDetails.paymentMethod,
      items: orderDetails.items,
      subtotal: orderDetails.subtotal,
      deliveryFee: orderDetails.deliveryFee,
      grandTotal: orderDetails.grandTotal,
      status: 'Order Placed',
      estimatedArrivalMinutes: 32,
      riderName: 'Farhan Ali (Express Fleet)',
      riderPhone: RESTAURANT_CONFIG.phone,
      riderVehicle: 'Honda 125 • Thermal Insulated Box #12',
      riderRating: 4.9
    };

    setActiveTrackedOrder(newTrackedOrder);
    setIsCartOpen(false);
    setIsTrackerOpen(true);
    showToast(`Order ${newTrackedOrder.orderNumber} placed! Live GPS Tracking activated.`);
  };

  return (
    <div className="min-h-screen bg-[#011207] text-[#E2F0CC] font-sans selection:bg-[#8BC53D] selection:text-[#011207] relative overflow-x-hidden">
      {/* Main Sticky Header */}
      <Header
        serviceMode={serviceMode}
        onToggleServiceMode={setServiceMode}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenHoursModal={() => setIsHoursModalOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        activeOrderStatus={activeTrackedOrder?.status || null}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 0. Live Scroll Progress Stroke & Showcase Animation (Skiper19) */}
      <Skiper19
        onScrollToMenu={scrollToMenu}
        onScrollToHero={scrollToHero}
        onSelectFoodItem={(item) => setActiveModalItem(item)}
        onAddToCart={(item) => handleQuickAdd(item)}
      />

      {/* Main Page Content - Seamless flush transition from Skiper19 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 mt-0 space-y-6 sm:space-y-10">
        {/* 1. Prime Hero Section */}
        <HeroSection
          onScrollToMenu={scrollToMenu}
          onOpenHoursModal={() => setIsHoursModalOpen(true)}
          onSelectFeaturedItem={() => {
            const featured = MENU_ITEMS.find((i) => i.id === 'burger-truffle') || MENU_ITEMS[0];
            setActiveModalItem(featured);
          }}
        />

        {/* 2. Interactive Signature Creations Showcase */}
        <Skiper19ScrollHero
          onScrollToHero={scrollToHero}
          onScrollToMenu={scrollToMenu}
          onSelectFoodItem={(item) => setActiveModalItem(item)}
          onAddToCart={(item) => handleQuickAdd(item)}
        />

        {/* 3. Stacked Signature Deals & Combos Deck */}
        <StickyScrollCards
          onAddDeal={handleAddDeal}
          onSelectDeal={handleSelectDeal}
        />

        {/* 4. Complete Food Menu with Search & Category Filters */}
        <MenuSection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSelectFoodItem={(item) => setActiveModalItem(item)}
          onQuickAdd={handleQuickAdd}
          cartItemCounts={cartItemCounts}
        />

        {/* 5. Authentic Direct Ordering Workflow */}
        <SocialProofWorkflow />

        {/* 6. Verified Google Reviews Section */}
        <GoogleReviewsSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenHoursModal={() => setIsHoursModalOpen(true)}
        onScrollToMenu={scrollToMenu}
      />

      {/* Component 1: Skiper89 Floating Scroll Progress Badge */}
      <Skiper89ScrollBadge />

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar
        items={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        serviceMode={serviceMode}
      />

      {/* Component 5: ExpandableFoodCard Menu Modal */}
      <ExpandableFoodModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
        onAddToCart={handleAddFromModal}
      />

      {/* Directions & Operating Hours Modal */}
      <DirectionsHoursModal
        isOpen={isHoursModalOpen}
        onClose={() => setIsHoursModalOpen(false)}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        order={activeTrackedOrder}
        onUpdateOrderStatus={(newStatus: OrderStatus) => {
          if (activeTrackedOrder) {
            setActiveTrackedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
          }
        }}
      />

      {/* Slide-over Checkout Drawer & WhatsApp Order Text Engine */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        serviceMode={serviceMode}
        onToggleServiceMode={setServiceMode}
        onOrderPlacedSuccess={handleOrderPlacedSuccess}
      />

      {/* Optimistic Quick Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#012F13] border border-[#8BC53D] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fade-in pointer-events-none">
          <CheckCircle className="w-4 h-4 text-[#8BC53D]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
