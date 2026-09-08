import React from 'react';
import { Sparkles, Utensils, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { MenuItem } from '../restaurant.config.ts';

interface Skiper19Props {
  onScrollToMenu: () => void;
  onScrollToHero: () => void;
  onSelectFoodItem: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
}

interface ShowcaseDish {
  dish: MenuItem;
  tagline: string;
  badge: string;
  price: string;
  rating: string;
}

const SHOWCASE_DISHES: ShowcaseDish[] = [
  {
    dish: {
      id: 'burger-truffle',
      name: 'Smokey Truffle Wagyu Burger',
      category: 'burgers',
      price: 1850,
      originalPrice: 2050,
      description: 'Double smash prime beef patties, black truffle aioli, aged smoked provolone on toasted brioche.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
      isPopular: true,
      ingredients: ['Prime Chuck Beef', 'Black Truffle Emulsion', 'Smoked Provolone', 'Brioche'],
      tags: ['100% Wagyu', 'Chef Pick']
    },
    tagline: '450°C Smashed Halal Wagyu',
    badge: 'Best Seller',
    price: 'PKR 1,850',
    rating: '4.9 ★'
  },
  {
    dish: {
      id: 'pizza-pepperoni',
      name: 'Artisan Pepperoni Sourdough',
      category: 'pizza',
      price: 1200,
      originalPrice: 1400,
      description: 'Slow-fermented thin sourdough crust, San Marzano tomato reduction, whole milk mozzarella, crispy beef pepperoni.',
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800',
      isPopular: true,
      ingredients: ['48-hr Sourdough', 'San Marzano DOP', 'Mozzarella', 'Beef Pepperoni'],
      tags: ['Woodfired', 'Crisp Crust']
    },
    tagline: '48-Hr Slow Fermented Crust',
    badge: 'Woodfired',
    price: 'PKR 1,200',
    rating: '4.8 ★'
  },
  {
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
    },
    tagline: 'Aged Cayenne & House Ranch',
    badge: 'Express Hot',
    price: 'PKR 850',
    rating: '4.9 ★'
  }
];

export const Skiper19: React.FC<Skiper19Props> = ({
  onScrollToMenu,
  onScrollToHero,
  onSelectFoodItem,
  onAddToCart
}) => {
  return (
    <section
      id="skiper19-showcase"
      data-reveal
      className="relative w-full bg-[#FAFDEE] text-[#1F3A4B] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-[#1F3A4B]/10 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F3A4B]/10 border border-[#1F3A4B]/20 text-[#1F3A4B] text-xs font-black uppercase mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#8BC53D]" />
            <span>Handcrafted Kitchen Showcase</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#1F3A4B] uppercase tracking-tight">
            Pure Flavor <span className="text-[#8BC53D] italic">In Every Dish</span>
          </h2>

          <p className="text-xs sm:text-sm font-medium text-[#1F3A4B]/80 max-w-md mx-auto mt-2 leading-relaxed">
            Smashed Wagyu, 48-hr fermented sourdough & crispy glazed wings.
          </p>

          {/* Action Navigation */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={onScrollToMenu}
              className="px-4 py-2 rounded-xl bg-[#1F3A4B] hover:bg-[#152733] text-[#FAFDEE] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Utensils className="w-3.5 h-3.5 text-[#8BC53D]" />
              <span>Full Menu</span>
            </button>
            <button
              onClick={onScrollToHero}
              className="px-4 py-2 rounded-xl bg-[#FAFDEE] hover:bg-white text-[#1F3A4B] text-xs font-bold border border-[#1F3A4B]/30 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span>Explore Deals</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8BC53D]" />
            </button>
          </div>
        </div>

        {/* Showcase Food Cards Grid */}
        <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOWCASE_DISHES.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#1F3A4B] text-[#FAFDEE] rounded-2xl p-4 border-2 border-[#8BC53D] shadow-xl flex flex-col justify-between cursor-pointer hover:border-white transition-colors gap-3"
              onClick={() => onSelectFoodItem(item.dish)}
            >
              <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-[#011207]">
                <img
                  src={item.dish.image}
                  alt={item.dish.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-xs font-bold text-white">
                  {item.rating}
                </div>
                <span className="absolute top-2 right-2 text-xs font-black uppercase bg-[#8BC53D] text-[#011207] px-2 py-0.5 rounded shadow">
                  {item.badge}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 className="text-base font-black uppercase text-white truncate">
                    {item.dish.name}
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#8BC53D] flex-shrink-0">
                    {item.price}
                  </span>
                </div>
                <p className="text-xs text-[#FAFDEE]/75 line-clamp-2 leading-relaxed">
                  {item.tagline}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(item.dish);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#8BC53D] hover:bg-[#9de045] text-[#011207] text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>+ Add to Order</span>
                </button>
                <button
                  onClick={() => onSelectFoodItem(item.dish)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
