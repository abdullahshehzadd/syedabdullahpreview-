import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Sparkles, Utensils, ShoppingBag, ArrowDown, Eye } from 'lucide-react';
import { MenuItem } from '../restaurant.config';

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
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth extended viewport scroll tracking with high-precision GPU compositor sync
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Silky smooth relaxed spring for jitter-free 60FPS mobile scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 26,
    mass: 0.8,
    restDelta: 0.001
  });

  // Pure SVG Path progression mapped to GPU transform
  const pathLength = useTransform(smoothProgress, [0, 0.75], [0.08, 1]);

  // Memoized motion transforms to eliminate unnecessary allocations and jitter
  const card1Opacity = useTransform(smoothProgress, [0.03, 0.24], [0, 1]);
  const card1Y = useTransform(smoothProgress, [0.03, 0.24], [20, 0]);

  const card2Opacity = useTransform(smoothProgress, [0.20, 0.44], [0, 1]);
  const card2Y = useTransform(smoothProgress, [0.20, 0.44], [20, 0]);

  const card3Opacity = useTransform(smoothProgress, [0.40, 0.68], [0, 1]);
  const card3Y = useTransform(smoothProgress, [0.40, 0.68], [20, 0]);

  return (
    <section
      ref={containerRef}
      id="skiper19-showcase"
      className="relative w-full h-[105vh] sm:h-[110vh] lg:h-[115vh] bg-[#FAFDEE] text-[#1F3A4B] m-0 p-0 overflow-hidden contain-paint"
    >
      {/* Sticky Viewport Stage with 0 Vertical Gap, No Jitter, Hardware-Accelerated */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-3 sm:px-6 lg:px-8 pt-14 sm:pt-18 pb-3 sm:pb-5 transform-gpu will-change-transform">
        
        {/* Header Title Section */}
        <div className="relative z-10 mx-auto max-w-3xl text-center flex flex-col items-center flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F3A4B]/10 border border-[#1F3A4B]/20 text-[#1F3A4B] text-[10px] sm:text-xs font-black uppercase mb-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#8BC53D]" />
            <span>Handcrafted Kitchen Showcase</span>
          </div>

          <h2 className="text-xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#1F3A4B] uppercase">
            Pure Flavor <span className="text-[#8BC53D] italic">In Every Scroll</span>
          </h2>

          <p className="text-[11px] sm:text-sm font-semibold text-[#1F3A4B]/80 max-w-md mt-0.5">
            Smashed Wagyu, 48-hr fermented sourdough & crispy glazed wings.
          </p>

          {/* Action Navigation */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={onScrollToMenu}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#1F3A4B] hover:bg-[#152733] text-[#FAFDEE] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 min-h-[36px]"
            >
              <Utensils className="w-3.5 h-3.5 text-[#C2F84F]" />
              <span>Full Menu</span>
            </button>
            <button
              onClick={onScrollToHero}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#FAFDEE] hover:bg-white text-[#1F3A4B] text-xs font-bold border border-[#1F3A4B]/30 transition-all flex items-center gap-1 cursor-pointer active:scale-95 min-h-[36px]"
            >
              <span>Explore Deals</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#8BC53D]" />
            </button>
          </div>
        </div>

        {/* Clean, High-Performance Memoized Vector SVG Line */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-60 sm:opacity-80 transform-gpu">
          <OptimizedLinePath
            className="w-full h-full max-w-[880px] lg:max-w-[1200px] object-contain will-change-transform"
            pathLength={pathLength}
          />
        </div>

        {/* Clean Showcase Food Cards (Fully Optimized for Mobile & Desktop) */}
        <div className="relative z-20 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-5 my-auto flex-1 sm:flex-initial justify-center content-center max-h-[58vh] sm:max-h-none overflow-hidden">
          
          {/* Card 1: Wagyu Smash Burger */}
          <motion.div
            style={{ opacity: card1Opacity, y: card1Y }}
            className="bg-[#1F3A4B] text-[#FAFDEE] rounded-xl sm:rounded-2xl p-2 sm:p-4 border-2 border-[#C2F84F] shadow-xl flex flex-row sm:flex-col items-center sm:items-stretch justify-between cursor-pointer hover:border-white transition-colors transform-gpu will-change-transform gap-2 sm:gap-0"
            onClick={() => onSelectFoodItem(SHOWCASE_DISHES[0].dish)}
          >
            {/* Mobile Left Thumbnail / Desktop Full Image */}
            <div className="relative w-16 h-16 sm:w-full sm:h-36 rounded-lg sm:rounded-xl overflow-hidden bg-[#011207] flex-shrink-0 sm:mb-2.5">
              <img
                src={SHOWCASE_DISHES[0].dish.image}
                alt={SHOWCASE_DISHES[0].dish.name}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.5 rounded text-[9px] sm:text-[10px] font-bold text-white hidden sm:block">
                {SHOWCASE_DISHES[0].rating}
              </div>
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0 px-1 sm:px-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase bg-[#C2F84F] text-[#1F3A4B] px-1.5 py-0.5 rounded">
                  {SHOWCASE_DISHES[0].badge}
                </span>
                <span className="text-xs font-bold text-[#C2F84F]">
                  {SHOWCASE_DISHES[0].price}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-black uppercase text-white truncate">
                {SHOWCASE_DISHES[0].dish.name}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#FAFDEE]/70 truncate sm:line-clamp-1">
                {SHOWCASE_DISHES[0].tagline}
              </p>
            </div>

            {/* Actions */}
            <div className="sm:mt-2.5 sm:pt-2 sm:border-t sm:border-white/10 flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(SHOWCASE_DISHES[0].dish);
                }}
                className="py-1.5 px-2.5 rounded-lg bg-[#C2F84F] hover:bg-[#b2eb3d] text-[#1F3A4B] text-[11px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm min-h-[36px]"
              >
                <ShoppingBag className="w-3 h-3" />
                <span className="hidden xs:inline">+ Add</span>
              </button>
              <button
                onClick={() => onSelectFoodItem(SHOWCASE_DISHES[0].dish)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                title="View details"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Pepperoni Pizza */}
          <motion.div
            style={{ opacity: card2Opacity, y: card2Y }}
            className="bg-[#1F3A4B] text-[#FAFDEE] rounded-xl sm:rounded-2xl p-2 sm:p-4 border-2 border-[#C2F84F] shadow-xl flex flex-row sm:flex-col items-center sm:items-stretch justify-between cursor-pointer hover:border-white transition-colors transform-gpu will-change-transform gap-2 sm:gap-0"
            onClick={() => onSelectFoodItem(SHOWCASE_DISHES[1].dish)}
          >
            {/* Mobile Left Thumbnail / Desktop Full Image */}
            <div className="relative w-16 h-16 sm:w-full sm:h-36 rounded-lg sm:rounded-xl overflow-hidden bg-[#011207] flex-shrink-0 sm:mb-2.5">
              <img
                src={SHOWCASE_DISHES[1].dish.image}
                alt={SHOWCASE_DISHES[1].dish.name}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.5 rounded text-[9px] sm:text-[10px] font-bold text-white hidden sm:block">
                {SHOWCASE_DISHES[1].rating}
              </div>
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0 px-1 sm:px-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase bg-[#C2F84F] text-[#1F3A4B] px-1.5 py-0.5 rounded">
                  {SHOWCASE_DISHES[1].badge}
                </span>
                <span className="text-xs font-bold text-[#C2F84F]">
                  {SHOWCASE_DISHES[1].price}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-black uppercase text-white truncate">
                {SHOWCASE_DISHES[1].dish.name}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#FAFDEE]/70 truncate sm:line-clamp-1">
                {SHOWCASE_DISHES[1].tagline}
              </p>
            </div>

            {/* Actions */}
            <div className="sm:mt-2.5 sm:pt-2 sm:border-t sm:border-white/10 flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(SHOWCASE_DISHES[1].dish);
                }}
                className="py-1.5 px-2.5 rounded-lg bg-[#C2F84F] hover:bg-[#b2eb3d] text-[#1F3A4B] text-[11px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm min-h-[36px]"
              >
                <ShoppingBag className="w-3 h-3" />
                <span className="hidden xs:inline">+ Add</span>
              </button>
              <button
                onClick={() => onSelectFoodItem(SHOWCASE_DISHES[1].dish)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                title="View details"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Card 3: Buffalo Wings */}
          <motion.div
            style={{ opacity: card3Opacity, y: card3Y }}
            className="bg-[#1F3A4B] text-[#FAFDEE] rounded-xl sm:rounded-2xl p-2 sm:p-4 border-2 border-[#C2F84F] shadow-xl flex flex-row sm:flex-col items-center sm:items-stretch justify-between cursor-pointer hover:border-white transition-colors transform-gpu will-change-transform gap-2 sm:gap-0"
            onClick={() => onSelectFoodItem(SHOWCASE_DISHES[2].dish)}
          >
            {/* Mobile Left Thumbnail / Desktop Full Image */}
            <div className="relative w-16 h-16 sm:w-full sm:h-36 rounded-lg sm:rounded-xl overflow-hidden bg-[#011207] flex-shrink-0 sm:mb-2.5">
              <img
                src={SHOWCASE_DISHES[2].dish.image}
                alt={SHOWCASE_DISHES[2].dish.name}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.5 rounded text-[9px] sm:text-[10px] font-bold text-white hidden sm:block">
                {SHOWCASE_DISHES[2].rating}
              </div>
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0 px-1 sm:px-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase bg-[#C2F84F] text-[#1F3A4B] px-1.5 py-0.5 rounded">
                  {SHOWCASE_DISHES[2].badge}
                </span>
                <span className="text-xs font-bold text-[#C2F84F]">
                  {SHOWCASE_DISHES[2].price}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-black uppercase text-white truncate">
                {SHOWCASE_DISHES[2].dish.name}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#FAFDEE]/70 truncate sm:line-clamp-1">
                {SHOWCASE_DISHES[2].tagline}
              </p>
            </div>

            {/* Actions */}
            <div className="sm:mt-2.5 sm:pt-2 sm:border-t sm:border-white/10 flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(SHOWCASE_DISHES[2].dish);
                }}
                className="py-1.5 px-2.5 rounded-lg bg-[#C2F84F] hover:bg-[#b2eb3d] text-[#1F3A4B] text-[11px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm min-h-[36px]"
              >
                <ShoppingBag className="w-3 h-3" />
                <span className="hidden xs:inline">+ Add</span>
              </button>
              <button
                onClick={() => onSelectFoodItem(SHOWCASE_DISHES[2].dish)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                title="View details"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

interface OptimizedLinePathProps {
  className: string;
  pathLength: any;
}

const OptimizedLinePath: React.FC<OptimizedLinePathProps> = React.memo(({
  className,
  pathLength,
}) => {
  const strokeDashoffset = useTransform(pathLength, (value: number) => 1 - value);

  return (
    <svg
      width="1278"
      height="2319"
      viewBox="0 0 1278 2319"
      fill="none"
      overflow="visible"
      shapeRendering="geometricPrecision"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ 
        transform: 'translateZ(0)'
      }}
    >
      {/* High-Performance SVG Vector Stroke Path without heavy CPU paint filters */}
      <motion.path
        d="M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89"
        stroke="#C2F84F"
        strokeWidth="16"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{
          pathLength,
          strokeDashoffset,
        }}
      />
    </svg>
  );
});

