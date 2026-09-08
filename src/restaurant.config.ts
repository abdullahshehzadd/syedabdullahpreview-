export interface RestaurantConfig {
  name: string;
  phone: string;
  displayPhone: string;
  googleMapsUrl: string;
  operatingHours: {
    start: string;
    end: string;
    displayString: string;
  };
  serviceOptions: ('delivery' | 'takeaway')[];
  deliveryRules: {
    type: 'flat' | 'distance';
    fee: number;
    minOrderValue: number;
    freeDeliveryAbove: number;
    estimatedMinutes: string;
  };
  takeawayRules: {
    pickupEstimateMinutes: number;
  };
  socials: {
    instagram: string;
    facebook: string;
  };
  branding: {
    bgNeutral: string;
    cardSurface: string;
    brandAccent: string;
    secondaryAccent: string;
    glowAccent: string;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  isPopular?: boolean;
  isCombo?: boolean;
  isSpicy?: boolean;
  isNew?: boolean;
  ingredients: string[];
  tags: string[];
  customizations?: {
    title: string;
    options: { name: string; price: number }[];
  }[];
}

export interface SignatureDeal {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  itemsIncluded: string[];
  badgeColor: string;
}

export const RESTAURANT_CONFIG: RestaurantConfig = {
  name: "Smash & Woodfire",
  phone: "923347383967", // Target: +92 334 7383967 (wa.me target: 923347383967)
  displayPhone: "+92 334 7383967",
  googleMapsUrl: "https://maps.google.com",
  operatingHours: {
    start: "18:00",
    end: "01:00",
    displayString: "6:00 PM to 1:00 AM"
  },
  serviceOptions: ["delivery", "takeaway"],
  deliveryRules: {
    type: "flat",
    fee: 150, // PKR
    minOrderValue: 500, // PKR MOV Threshold
    freeDeliveryAbove: 1500, // Free delivery promo
    estimatedMinutes: "30-40 mins"
  },
  takeawayRules: {
    pickupEstimateMinutes: 20
  },
  socials: {
    instagram: "https://instagram.com/basegrid.pk",
    facebook: "https://facebook.com"
  },
  branding: {
    bgNeutral: "#011207",       // Near-Black Green (Canvas Background)
    cardSurface: "#012F13",     // Dark Forest Green (Card Surfaces & Drawers)
    brandAccent: "#8BC53D",     // Apple Green (Primary CTA, Active Toggles & Strokes)
    secondaryAccent: "#E2F0CC", // Soft Sage Mint (Highlights, Pills & Text Accents)
    glowAccent: "#8BC53D"       // Apple Green Glow
  }
};

export const MENU_CATEGORIES = [
  { id: "combos", label: "🔥 Super Saver Combos", icon: "Flame" },
  { id: "burgers", label: "Artisan Burgers", icon: "Sandwich" },
  { id: "pizza", label: "Woodfired Pizza", icon: "Pizza" },
  { id: "wings", label: "Crispy Wings & Bites", icon: "Utensils" },
  { id: "sides", label: "Gourmet Sides", icon: "Sparkles" },
  { id: "drinks", label: "Craft Drinks", icon: "Coffee" },
  { id: "desserts", label: "Sweet Treats", icon: "Cake" }
];

export const SIGNATURE_DEALS: SignatureDeal[] = [
  {
    id: "deal-duo-truffle",
    title: "Double Truffle Feast",
    subtitle: "2x Smokey Truffle Burgers + Truffle Fries + 2 Cold Drinks",
    tag: "MOST POPULAR",
    price: 3450,
    originalPrice: 4200,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    description: "Our signature Wagyu beef blend infused with aromatic black truffle aioli, aged smoked provolone, crispy shallots, paired with loaded fries and drinks.",
    itemsIncluded: ["2x Smokey Truffle Beef Burgers", "1x Loaded Truffle Parmesan Fries", "2x Fresh Mint Lemonades"],
    badgeColor: "#FFB703"
  },
  {
    id: "deal-pizza-wings",
    title: "Artisan Pizza & Wings Box",
    subtitle: "1x Large Artisan Pepperoni + 8x Buffalo Wings + 1.5L Beverage",
    tag: "WEEKEND SPECIAL",
    price: 2450,
    originalPrice: 2950,
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800",
    description: "48-hour slow-fermented hand-stretched crust topped with San Marzano tomatoes, cured pepperoni, and freshly glazed honey-buffalo wings.",
    itemsIncluded: ["1x Large Artisan Pepperoni Pizza", "8x Crispy Buffalo Chicken Wings", "1x Ranch Dip", "2x Refreshing Drinks"],
    badgeColor: "#00E676"
  },
  {
    id: "deal-crispy-squad",
    title: "Crispy Zinger Squad Box",
    subtitle: "3x Crispy Zinger Deluxe Burgers + Family Loaded Fries",
    tag: "SAVE PKR 600",
    price: 2650,
    originalPrice: 3250,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800",
    description: "Triple crispy golden chicken fillet burgers layered with signature spice dust, crunchy iceberg slaw, and house secret smoked mayo.",
    itemsIncluded: ["3x Crispy Zinger Deluxe Burgers", "1x Jumbo Seasoned Crinkle Fries", "3x Soft Drinks"],
    badgeColor: "#38BDF8"
  },
  {
    id: "deal-midnight-cravings",
    title: "Midnight Hunger Busters",
    subtitle: "1x Truffle Burger + 6x Buffalo Wings + Mint Lemonade",
    tag: "LATE NIGHT EXCLUSIVE",
    price: 2150,
    originalPrice: 2600,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800",
    description: "The ultimate midnight companion: one artisan beef burger paired with saucy buffalo wings and an ice-cold citrus cooler.",
    itemsIncluded: ["1x Smokey Truffle Beef Burger", "6x Buffalo Chicken Wings", "1x Fresh Mint Lemonade"],
    badgeColor: "#FFB703"
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // COMBOS
  {
    id: "combo-1",
    name: "Truffle Burger & Wings Duo",
    category: "combos",
    price: 2350,
    originalPrice: 2700,
    description: "1x Smokey Truffle Beef Burger, 4x Buffalo Wings, seasoned fries, and 1x Mint Lemonade.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    isPopular: true,
    isCombo: true,
    ingredients: ["Artisan Brioche", "Smash Wagyu Patty", "Black Truffle Sauce", "Crispy Chicken Wings", "Crisp Crinkle Fries"],
    tags: ["Best Seller", "Combo Savings", "Chef Pick"],
    customizations: [
      {
        title: "Beverage Choice",
        options: [
          { name: "Fresh Mint Lemonade", price: 0 },
          { name: "Craft Iced Tea", price: 50 },
          { name: "Chilled Soda Can", price: 0 }
        ]
      },
      {
        title: "Wing Glaze",
        options: [
          { name: "Classic Hot Buffalo", price: 0 },
          { name: "Honey Garlic Glaze", price: 0 },
          { name: "Smoky BBQ", price: 0 }
        ]
      }
    ]
  },
  {
    id: "combo-2",
    name: "Pizza & Zinger Crunch Box",
    category: "combos",
    price: 2150,
    originalPrice: 2500,
    description: "1x Medium Artisan Pepperoni Pizza + 1x Crispy Zinger Deluxe Burger + 1 Drink.",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800",
    isCombo: true,
    ingredients: ["San Marzano Sauce", "Smoked Pepperoni", "Crispy Fried Chicken Breast", "Artisan Brioche", "House Aioli"],
    tags: ["Super Value", "Duo Meal"],
    customizations: [
      {
        title: "Spice Preference",
        options: [
          { name: "Mild Herb", price: 0 },
          { name: "Spicy Volcano", price: 0 },
          { name: "Extra Jalapeño Punch", price: 60 }
        ]
      }
    ]
  },

  // BURGERS
  {
    id: "burger-truffle",
    name: "Smokey Truffle Beef Burger",
    category: "burgers",
    price: 1850,
    originalPrice: 2050,
    description: "Double smash prime beef patties, black truffle aioli, aged smoked provolone, and caramelized shallots on toasted brioche.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    isPopular: true,
    ingredients: ["100% Prime Beef Chuck", "Black Truffle Emulsion", "Caramelized Shallots", "Smoked Provolone", "Buttery Potato Brioche"],
    tags: ["Signature", "Truffle Infused", "100% Beef"],
    customizations: [
      {
        title: "Patty Upgrade",
        options: [
          { name: "Standard (Double Patty)", price: 0 },
          { name: "Triple Beef Patty (+120g)", price: 450 },
          { name: "Extra Smoked Cheese Slice", price: 150 }
        ]
      },
      {
        title: "Add-ons",
        options: [
          { name: "Caramelized Bacon Strips (Halal)", price: 200 },
          { name: "Truffle Mayo Dip Cup", price: 120 }
        ]
      }
    ]
  },
  {
    id: "burger-zinger",
    name: "Crispy Zinger Deluxe",
    category: "burgers",
    price: 950,
    originalPrice: 1100,
    description: "Hand-breaded jumbo buttermilk chicken breast fillet, spicy cayenne dust, cool cabbage slaw, and signature garlic spread.",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800",
    isSpicy: true,
    isPopular: true,
    ingredients: ["Fresh Whole Chicken Breast", "24-hr Buttermilk Marinade", "Cayenne Slaw", "Garlic Herb Sauce", "Brioche Bun"],
    tags: ["Ultra Crunchy", "Spicy", "Fan Favorite"],
    customizations: [
      {
        title: "Heat Level",
        options: [
          { name: "Medium Crispy", price: 0 },
          { name: "Nashville Ghost Pepper Fire", price: 50 },
          { name: "Honey Butter Mild", price: 0 }
        ]
      },
      {
        title: "Cheese & Toppings",
        options: [
          { name: "Melted Cheddar Slice", price: 120 },
          { name: "Pickled Jalapeños", price: 70 }
        ]
      }
    ]
  },
  {
    id: "burger-classic-smash",
    name: "Double Cheddar Smash Burger",
    category: "burgers",
    price: 1350,
    description: "Seared crispy-edge double beef patties, melted sharp yellow cheddar, house dill pickles, diced onions, and smash sauce.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
    ingredients: ["Fresh Angus Beef", "Aged Sharp Cheddar", "Dill Pickles", "Secret Smash Sauce", "Sesame Seed Bun"],
    tags: ["Crispy Edges", "Classic American"],
    customizations: [
      {
        title: "Add-ons",
        options: [
          { name: "Extra Cheese", price: 120 },
          { name: "Fried Farm Egg", price: 100 }
        ]
      }
    ]
  },

  // PIZZA
  {
    id: "pizza-pepperoni",
    name: "Artisan Pepperoni Pizza",
    category: "pizza",
    price: 1200,
    originalPrice: 1400,
    description: "Slow-fermented thin sourdough crust, San Marzano tomato reduction, whole milk mozzarella, and crispy beef pepperoni cupped edges.",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800",
    isPopular: true,
    ingredients: ["48-hr Sourdough Crust", "San Marzano D.O.P Tomatoes", "Fior di Latte Mozzarella", "Artisan Beef Pepperoni", "Fresh Oregano"],
    tags: ["Woodfired Style", "Crisp Crust", "Handmade"],
    customizations: [
      {
        title: "Size Selection",
        options: [
          { name: "Medium (10 inch / 6 slices)", price: 0 },
          { name: "Large (13 inch / 8 slices)", price: 550 }
        ]
      },
      {
        title: "Crust & Cheese",
        options: [
          { name: "Standard Neapolitan Crust", price: 0 },
          { name: "Garlic Butter Stuffed Crust", price: 250 },
          { name: "Hot Honey Drizzle", price: 120 }
        ]
      }
    ]
  },
  {
    id: "pizza-truffle-funghi",
    name: "Wild Mushroom & Truffle Pizza",
    category: "pizza",
    price: 1450,
    description: "White sauce base, sautéed portobello and button mushrooms, fresh rosemary, mozzarella, and aromatic white truffle oil.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    ingredients: ["White Garlic Cream", "Portobello Mushrooms", "Fresh Rosemary", "Mozzarella", "White Truffle Oil"],
    tags: ["Vegetarian", "Gourmet White Pizza"],
    customizations: [
      {
        title: "Size Selection",
        options: [
          { name: "Medium (10 inch)", price: 0 },
          { name: "Large (13 inch)", price: 550 }
        ]
      }
    ]
  },

  // WINGS
  {
    id: "wings-buffalo",
    name: "Buffalo Chicken Wings (8 Pcs)",
    category: "wings",
    price: 850,
    originalPrice: 990,
    description: "Jumbo crispy chicken wings tossed in our signature buttery aged cayenne buffalo glaze. Served with creamy house ranch dip.",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800",
    isSpicy: true,
    isPopular: true,
    ingredients: ["Fresh Chicken Wings", "Aged Cayenne Pepper Glaze", "Creamy Ranch Dip", "Crisp Celery Sticks"],
    tags: ["8 Pieces", "Glazed", "Crispy Skin"],
    customizations: [
      {
        title: "Sauce Glaze",
        options: [
          { name: "Signature Hot Buffalo", price: 0 },
          { name: "Sweet Honey Sriracha", price: 0 },
          { name: "Smoky Mesquite BBQ", price: 0 },
          { name: "Garlic Parmesan Dry Rub", price: 50 }
        ]
      },
      {
        title: "Extra Dipping Sauce",
        options: [
          { name: "Extra Ranch Dip (+50g)", price: 90 },
          { name: "Blue Cheese Dip", price: 120 }
        ]
      }
    ]
  },
  {
    id: "wings-honey-garlic",
    name: "Sticky Honey Garlic Bites (10 Pcs)",
    category: "wings",
    price: 900,
    description: "Boneless crispy fried chicken bites tossed in slow-simmered caramelized wildflower honey and toasted sesame seeds.",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800",
    ingredients: ["Boneless Chicken Chunks", "Pure Wildflower Honey", "Roasted Garlic", "Toasted White Sesame"],
    tags: ["Boneless Bites", "Sweet & Savory"],
    customizations: [
      {
        title: "Portion Size",
        options: [
          { name: "Regular (10 pcs)", price: 0 },
          { name: "Party Box (20 pcs)", price: 750 }
        ]
      }
    ]
  },

  // SIDES
  {
    id: "side-truffle-fries",
    name: "Parmesan Truffle Fries",
    category: "sides",
    price: 650,
    description: "Crispy skin-on potato fries tossed with black truffle essence, aged Grana Padano parmesan cheese, and fresh parsley.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800",
    isPopular: true,
    ingredients: ["Hand Cut Idaho Potatoes", "Black Truffle Oil", "Shaved Parmesan", "Himalayan Pink Salt", "Parsley"],
    tags: ["Vegetarian", "Crispy", "Signature Side"]
  },
  {
    id: "side-loaded-nachos",
    name: "Loaded Queso Nachos",
    category: "sides",
    price: 850,
    description: "Warm corn tortilla chips smothered in molten house cheddar queso, sliced jalapeños, pico de gallo, and sour cream.",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800",
    ingredients: ["Crisp Corn Tortillas", "Sharp Cheddar Queso", "Pickled Jalapeños", "Fresh Pico de Gallo", "Sour Cream"],
    tags: ["Shareable", "Cheesy"]
  },

  // DRINKS
  {
    id: "drink-mint-lemonade",
    name: "Fresh Mint Lemonade",
    category: "drinks",
    price: 350,
    originalPrice: 420,
    description: "Crushed organic spearmint leaves, freshly squeezed Persian lime juice, raw cane sugar syrup, and sparkling chilled soda.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800",
    isPopular: true,
    ingredients: ["Fresh Garden Mint", "Fresh Lime Juice", "Pure Cane Sugar", "Chilled Sparkling Soda", "Crushed Ice"],
    tags: ["Ice Cold", "Refreshing", "100% Natural"]
  },
  {
    id: "drink-iced-tea",
    name: "Artisan Peach Iced Tea",
    category: "drinks",
    price: 380,
    description: "Cold-steeped premium black tea infused with sweet white peach nectar and garden mint sprigs.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800",
    ingredients: ["Cold-brewed Ceylon Tea", "Natural Peach Extract", "Lemon Slice", "Mint"],
    tags: ["Cold Brewed", "Low Calorie"]
  },

  // DESSERTS
  {
    id: "dessert-lava-cake",
    name: "Molten Belgian Lava Cake",
    category: "desserts",
    price: 650,
    description: "Warm 70% dark Belgian chocolate sponge cake with a rich flowing ganache core, dusted with powdered sugar.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
    isPopular: true,
    ingredients: ["70% Belgian Dark Chocolate", "Fresh Dairy Butter", "Farm Eggs", "Vanilla Bean"],
    tags: ["Warm Dessert", "Decadent"]
  }
];

export const GOOGLE_REVIEWS = [
  {
    id: "rev-1",
    author: "Hamza Tariq",
    rating: 5,
    relativeTime: "2 days ago",
    text: "The Smokey Truffle Beef burger is genuinely unmatched anywhere in town. Unbelievably juicy patties, aroma of truffle was spot on, and the WhatsApp order arrived piping hot in 25 minutes!",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"
  },
  {
    id: "rev-2",
    author: "Ayesha Malik",
    rating: 5,
    relativeTime: "1 week ago",
    text: "Ordered the Super Saver Pizza & Wings combo for family night. Sourdough crust had that perfect blistered crunch, and the buffalo wings sauce had real heat. 10/10 service.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120"
  },
  {
    id: "rev-3",
    author: "Bilal Sheikh",
    rating: 5,
    relativeTime: "2 weeks ago",
    text: "Seamless WhatsApp checkout! Clicked order, got WhatsApp confirmation immediately with exact invoice. Crispy Zinger deluxe has the loudest crunch ever.",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120"
  },
  {
    id: "rev-4",
    author: "Zainab Rehman",
    rating: 5,
    relativeTime: "3 weeks ago",
    text: "Parmesan Truffle fries and Mint Lemonade are my weekly late-night comfort food. Love that they're open till 1:00 AM!",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120"
  }
];
