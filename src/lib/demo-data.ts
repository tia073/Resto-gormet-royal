import { Category, Product, RestaurantSettings, Review, Order, Reservation } from '../types/restaurant';

export const INITIAL_RESTAURANT_SETTINGS: RestaurantSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Le Gourmet Royal',
  logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
  tagline: "L'Art Culinaire d'Excellence & Saveurs Royales",
  description: "Une cuisine gastronomique d'exception mariant fraîcheur locale et savoir-faire culinaire moderne.",
  phone: '+261 34 00 123 45',
  email: 'contact@legourmetroyal.mg',
  address: "14 Avenue de l'Indépendance, Analakely",
  city: 'Antananarivo 101',
  opening_hours: {
    monday_friday: '11h30 - 15h00 | 18h30 - 23h00',
    saturday_sunday: '11h30 - 23h30 non-stop'
  },
  delivery_fee: 5000,
  currency: 'MGA',
  currency_symbol: 'Ar',
  social_facebook: 'https://facebook.com/legourmetroyal',
  social_instagram: 'https://instagram.com/legourmetroyal',
  social_tripadvisor: 'https://tripadvisor.com'
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Entrées',
    slug: 'entrees',
    description: 'Mises en bouche raffinées et salades gourmandes',
    icon_name: 'Salad',
    image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    display_order: 1,
    is_active: true
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Plats',
    slug: 'plats',
    description: 'Nos créations signatures et spécialités du Chef',
    icon_name: 'ChefHat',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    display_order: 2,
    is_active: true
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Burgers',
    slug: 'burgers',
    description: 'Burgers gourmets avec pains artisanaux et viandes sélectionnées',
    icon_name: 'Beef',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    display_order: 3,
    is_active: true
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Pizzas',
    slug: 'pizzas',
    description: 'Pizzas au feu de bois pâte fine et mozzarella di bufala',
    icon_name: 'Pizza',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    display_order: 4,
    is_active: true
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Pâtes',
    slug: 'pates',
    description: 'Pâtes fraîches maison aux sauces onctueuses',
    icon_name: 'Soup',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    display_order: 5,
    is_active: true
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Poulet',
    slug: 'poulet',
    description: 'Volailles fermières rôties, marinées et braisées',
    icon_name: 'Egg',
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
    display_order: 6,
    is_active: true
  },
  {
    id: 'c1000000-0000-0000-0000-000000000007',
    name: 'Viandes',
    slug: 'viandes',
    description: "Pièces de bœuf et zébu d'exception maturées",
    icon_name: 'Flame',
    image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    display_order: 7,
    is_active: true
  },
  {
    id: 'c1000000-0000-0000-0000-000000000008',
    name: 'Poissons',
    slug: 'poissons',
    description: 'Poissons nobles et crustacés de nos côtes',
    icon_name: 'Fish',
    image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
    display_order: 8,
    is_active: true
  },
  {
    id: 'c1000000-0000-0000-0000-000000000009',
    name: 'Boissons',
    slug: 'boissons',
    description: 'Cocktails signatures, vins fins et jus pressés',
    icon_name: 'Wine',
    image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    display_order: 9,
    is_active: true
  },
  {
    id: 'c1000000-0000-0000-0000-000000000010',
    name: 'Desserts',
    slug: 'desserts',
    description: 'Douceurs sucrées de notre Maître Pâtissier',
    icon_name: 'IceCream',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    display_order: 10,
    is_active: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1000000-0000-0000-0000-000000000001',
    category_id: 'c1000000-0000-0000-0000-000000000003',
    category_name: 'Burgers',
    name: 'Burger Royal Signature',
    description: 'Steak haché de zébu 200g, cheddar affiné, oignons caramélisés au miel, salade croquante et sauce truffée maison dans un pain brioché artisanal.',
    price: 35000,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    popular: true,
    prep_time_minutes: 20,
    calories: 780,
    allergens: ['Gluten', 'Lait', 'Œufs']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000002',
    category_id: 'c1000000-0000-0000-0000-000000000003',
    category_name: 'Burgers',
    name: 'Smoky Bacon & Truffle Burger',
    description: 'Double smash patty de bœuf, bacon croustillant, raclette fondue, roquette et mayonnaise fumée au poivre sauvage.',
    price: 38000,
    image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: true,
    prep_time_minutes: 18,
    calories: 850,
    allergens: ['Gluten', 'Lait', 'Moutarde']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000003',
    category_id: 'c1000000-0000-0000-0000-000000000007',
    category_name: 'Viandes',
    name: 'Filet de Zébu au Poivre Vert de Madagascar',
    description: "Cœur de filet tendre saisi minute, réduction crémée au poivre vert frais de Manakara, écrasé de pommes de terre à l'huile de truffe.",
    price: 48000,
    image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    popular: true,
    prep_time_minutes: 25,
    calories: 620,
    allergens: ['Lait']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000004',
    category_id: 'c1000000-0000-0000-0000-000000000007',
    category_name: 'Viandes',
    name: 'Côte de Bœuf Grillée au Thym (Pour 2)',
    description: "Côte maturée 30 jours (800g) grillée aux sarments de vigne, beurre maître d'hôtel et légumes glacés de saison.",
    price: 95000,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: false,
    prep_time_minutes: 30,
    calories: 1100,
    allergens: ['Lait']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000005',
    category_id: 'c1000000-0000-0000-0000-000000000008',
    category_name: 'Poissons',
    name: 'Camarons Géants Flambés au Rhum',
    description: 'Gambas royales de Mahajanga saisies à la plancha, flambées au rhum ambré, émulsion citronnelle et riz parfumé au combava.',
    price: 55000,
    image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    popular: true,
    prep_time_minutes: 22,
    calories: 510,
    allergens: ['Crustacés', 'Sulfites']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000006',
    category_id: 'c1000000-0000-0000-0000-000000000008',
    category_name: 'Poissons',
    name: 'Pavé de Saumon Sauvage Rôti',
    description: "Saumon croustillant sur peau, mousseline de patates douces vanillées et beurre blanc à l'aneth.",
    price: 46000,
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: false,
    prep_time_minutes: 20,
    calories: 540,
    allergens: ['Poisson', 'Lait']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000007',
    category_id: 'c1000000-0000-0000-0000-000000000006',
    category_name: 'Poulet',
    name: 'Suprême de Volaille Fermière au Curry Coco',
    description: 'Suprême doré au four, sauce crémeuse lait de coco et épices douces, mangue rôtie et riz basmati aux amandes.',
    price: 36000,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: true,
    prep_time_minutes: 20,
    calories: 590,
    allergens: ['Fruits à coque']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000008',
    category_id: 'c1000000-0000-0000-0000-000000000006',
    category_name: 'Poulet',
    name: 'Brochettes de Poulet Yakitori Laquées',
    description: "Dés de cuisse marinés au gingembre et soja doux, graines de sésame grillées et salade d'algues wakame.",
    price: 28000,
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: false,
    prep_time_minutes: 15,
    calories: 450,
    allergens: ['Soja', 'Sésame']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000009',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    category_name: 'Pizzas',
    name: 'Pizza Truffe & Burrata Crémeuse',
    description: 'Crème de truffe blanche, fior di latte, véritable burrata des Pouilles posée à cru, copeaux de parmesan 24 mois et roquette.',
    price: 42000,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    popular: true,
    prep_time_minutes: 15,
    calories: 820,
    allergens: ['Gluten', 'Lait']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000010',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    category_name: 'Pizzas',
    name: 'Pizza Reine di Parma',
    description: 'Coulis de tomates San Marzano, mozzarella fraîche, jambon de Parme affiné 18 mois, champignons de Paris frais et basilic.',
    price: 34000,
    image_url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: false,
    prep_time_minutes: 15,
    calories: 760,
    allergens: ['Gluten', 'Lait']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000011',
    category_id: 'c1000000-0000-0000-0000-000000000005',
    category_name: 'Pâtes',
    name: 'Tagliatelles Fraîches aux Fruits de Mer',
    description: "Pâtes artisanales maison, calamars, moules, crevettes sautées à l'ail doux, vin blanc et bisque de homard.",
    price: 44000,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: true,
    prep_time_minutes: 18,
    calories: 640,
    allergens: ['Gluten', 'Crustacés', 'Mollusques', 'Lait']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000012',
    category_id: 'c1000000-0000-0000-0000-000000000005',
    category_name: 'Pâtes',
    name: 'Ravioles Maison Ricotta & Épinards',
    description: 'Ravioles confectionnées le jour même, crème légère de parmesan et noisettes torréfiées concassées.',
    price: 32000,
    image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: false,
    prep_time_minutes: 15,
    calories: 520,
    allergens: ['Gluten', 'Lait', 'Fruits à coque']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000013',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Entrées',
    name: 'Carpaccio de Zébu aux Baies Roses',
    description: "Fines tranches de zébu mariné à l'huile d'olive vierge extra, copeaux de pecorino, baies roses et câpres.",
    price: 24000,
    image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: true,
    prep_time_minutes: 10,
    calories: 310,
    allergens: ['Lait']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000014',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Entrées',
    name: "Foie Gras Poêlé sur Pain d'Épices",
    description: 'Escalope de foie gras de canard mi-cuit, chutney de mangue épicée et réduction de vin de porto.',
    price: 38000,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    available: false, // Exemplifies "Rupture de stock"
    featured: true,
    popular: false,
    prep_time_minutes: 12,
    calories: 490,
    allergens: ['Gluten', 'Sulfites']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000015',
    category_id: 'c1000000-0000-0000-0000-000000000010',
    category_name: 'Desserts',
    name: 'Dôme Chocolat Grand Cru Sambirano',
    description: 'Chocolat noir 70% pure origine Madagascar, cœur coulant praliné feuillantine et glace artisanale à la vanille Bourbon.',
    price: 22000,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    popular: true,
    prep_time_minutes: 10,
    calories: 480,
    allergens: ['Lait', 'Gluten', 'Fruits à coque']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000016',
    category_id: 'c1000000-0000-0000-0000-000000000010',
    category_name: 'Desserts',
    name: 'Millefeuille Croustillant Vanille Bourbon',
    description: 'Feuilletage inversé caramélisé, crème diplomate onctueuse aux gousses de vanille de Sava et caramel beurre salé.',
    price: 19000,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: true,
    prep_time_minutes: 10,
    calories: 410,
    allergens: ['Gluten', 'Lait', 'Œufs']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000017',
    category_id: 'c1000000-0000-0000-0000-000000000009',
    category_name: 'Boissons',
    name: 'Cocktail Royal Émeraude',
    description: 'Gin infusé au combava, liqueur de litchi, purée de fruit de la passion frais, jus de citron vert et champagne.',
    price: 25000,
    image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    popular: true,
    prep_time_minutes: 5,
    calories: 180,
    allergens: ['Sulfites']
  },
  {
    id: 'p1000000-0000-0000-0000-000000000018',
    category_id: 'c1000000-0000-0000-0000-000000000009',
    category_name: 'Boissons',
    name: 'Jus Frais Pressé des Îles (50cl)',
    description: 'Cocktail vitaminé minute : Ananas Victoria, mangue fraîche, gingembre et menthe poivrée.',
    price: 12000,
    image_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: false,
    prep_time_minutes: 5,
    calories: 120,
    allergens: []
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    user_name: 'Sarah Razafindrakoto',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    product_id: 'p1000000-0000-0000-0000-000000000001',
    product_name: 'Burger Royal Signature',
    rating: 5,
    comment: 'Le meilleur burger de la capitale sans hésiter ! La viande de zébu est d’une tendreté exceptionnelle et la sauce truffée apporte une touche royale.',
    is_visible: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'rev-2',
    user_name: 'Dr. Jean-Marc Andriamampianina',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    product_id: 'p1000000-0000-0000-0000-000000000005',
    product_name: 'Camarons Géants Flambés au Rhum',
    rating: 5,
    comment: 'Cadre somptueux, service irréprochable et cuisson parfaite des camarons. Une adresse incontournable pour les dîners d’affaires ou en famille.',
    is_visible: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: 'rev-3',
    user_name: 'Mialy Rakotoarisoa',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    product_id: 'p1000000-0000-0000-0000-000000000015',
    product_name: 'Dôme Chocolat Grand Cru Sambirano',
    rating: 5,
    comment: 'Le dessert au chocolat Sambirano est une pure merveille. L’expérience en ligne et la livraison rapide à domicile étaient parfaites !',
    is_visible: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    order_number: 'CMD-2026-0842',
    user_id: 'sample-cust-1',
    order_type: 'delivery',
    status: 'preparing',
    customer_name: 'Hery Randrianasolo',
    phone: '+261 34 11 222 33',
    email: 'hery.randria@example.com',
    delivery_address: 'Villa Les Orchidées, Ivandry',
    delivery_city: 'Antananarivo',
    notes: 'Sonner au portail noir s’il vous plaît',
    subtotal: 70000,
    delivery_fee: 5000,
    total: 75000,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    items: [
      {
        id: 'oi-1',
        order_id: 'ord-101',
        product_id: 'p1000000-0000-0000-0000-000000000001',
        product_name: 'Burger Royal Signature',
        quantity: 2,
        unit_price: 35000,
        subtotal: 70000,
        notes: 'Cuisson à point'
      }
    ]
  },
  {
    id: 'ord-102',
    order_number: 'CMD-2026-0841',
    user_id: 'sample-cust-2',
    order_type: 'dine_in',
    table_number: '5',
    status: 'confirmed',
    customer_name: 'Bodo Rasoanaivo',
    phone: '+261 32 04 555 66',
    email: 'bodo.raso@example.com',
    subtotal: 90000,
    delivery_fee: 0,
    total: 90000,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    items: [
      {
        id: 'oi-2',
        order_id: 'ord-102',
        product_id: 'p1000000-0000-0000-0000-000000000003',
        product_name: 'Filet de Zébu au Poivre Vert de Madagascar',
        quantity: 1,
        unit_price: 48000,
        subtotal: 48000
      },
      {
        id: 'oi-3',
        order_id: 'ord-102',
        product_id: 'p1000000-0000-0000-0000-000000000009',
        product_name: 'Pizza Truffe & Burrata Crémeuse',
        quantity: 1,
        unit_price: 42000,
        subtotal: 42000
      }
    ]
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    user_id: 'sample-cust-1',
    customer_name: 'Andry Rabemananjara',
    phone: '+261 33 12 789 00',
    email: 'andry.rabe@example.com',
    reservation_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString().split('T')[0],
    reservation_time: '19:30',
    guests: 4,
    message: 'Table près de la baie vitrée pour un anniversaire',
    status: 'confirmed',
    table_assigned: 'Table Royale 12',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    id: 'res-102',
    user_id: 'sample-cust-2',
    customer_name: 'Fanja Ramanantsoa',
    phone: '+261 34 55 432 10',
    email: 'fanja@example.com',
    reservation_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
    reservation_time: '20:00',
    guests: 2,
    message: 'Dîner romantique aux chandelles',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  }
];
