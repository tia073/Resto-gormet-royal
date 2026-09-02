-- ==============================================================================
-- SCHEMA COMPLET SUPABASE - LE GOURMET ROYAL
-- Script PostgreSQL à exécuter dans : Supabase Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE RESTAURANTS (Informations et paramètres de l'établissement)
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL DEFAULT 'Le Gourmet Royal',
    logo_url TEXT,
    tagline TEXT DEFAULT 'L''Art Culinaire d''Excellence & Saveurs Royales',
    description TEXT DEFAULT 'Une cuisine gastronomique d''exception mariant fraîcheur locale et savoir-faire culinaire moderne.',
    phone VARCHAR(50) DEFAULT '+261 34 00 123 45',
    email VARCHAR(255) DEFAULT 'contact@legourmetroyal.mg',
    address TEXT DEFAULT '14 Avenue de l''Indépendance, Analakely',
    city VARCHAR(100) DEFAULT 'Antananarivo 101',
    hours_weekdays VARCHAR(100) DEFAULT '11h30 - 15h00 | 18h30 - 23h00',
    hours_weekends VARCHAR(100) DEFAULT '11h30 - 23h30 non-stop',
    delivery_fee NUMERIC(12, 2) DEFAULT 5000.00,
    currency VARCHAR(10) DEFAULT 'MGA',
    currency_symbol VARCHAR(10) DEFAULT 'Ar',
    social_facebook TEXT DEFAULT 'https://facebook.com/legourmetroyal',
    social_instagram TEXT DEFAULT 'https://instagram.com/legourmetroyal',
    social_tripadvisor TEXT DEFAULT 'https://tripadvisor.com',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE PROFILES (Liée à auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Utensils',
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE PRODUCTS (Plats et Boissons)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    popular BOOLEAN NOT NULL DEFAULT false,
    prep_time_minutes INTEGER DEFAULT 20,
    calories INTEGER,
    allergens TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLE ORDERS (Commandes)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('dine_in', 'takeaway', 'delivery')),
    table_number VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    delivery_address TEXT,
    delivery_city VARCHAR(100),
    notes TEXT,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLE ORDER_ITEMS (Articles de commande avec SNAPSHOT de prix)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    notes TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLE RESERVATIONS (Réservations de tables)
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 50),
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    table_assigned VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLE REVIEWS (Avis clients)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. INDEXES POUR HAUTES PERFORMANCES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(available);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(reservation_date, reservation_time);
CREATE INDEX IF NOT EXISTS idx_reservations_user ON public.reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

-- ==============================================================================
-- 11. TRIGGERS AUTOMATIQUES
-- ==============================================================================

-- A. Fonction mise à jour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_restaurants_updated_at ON public.restaurants;
CREATE TRIGGER set_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_reservations_updated_at ON public.reservations;
CREATE TRIGGER set_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- B. Auto-création du profile lors de l'inscription via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        'customer' -- STRICTEMENT customer par défaut
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = CASE WHEN profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 12. SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Activation de RLS sur toutes les tables
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Helper function pour vérifier si l'utilisateur courant est admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLITIQUES RESTAURANTS
CREATE POLICY "Lecture publique des infos restaurant" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Admin modifie les infos restaurant" ON public.restaurants FOR ALL USING (public.is_admin());

-- POLITIQUES PROFILES
CREATE POLICY "Utilisateur lit son propre profil" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Utilisateur modifie son propre profil" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Admin gère tous les profils" ON public.profiles FOR ALL USING (public.is_admin());

-- POLITIQUES CATEGORIES
CREATE POLICY "Lecture publique des catégories" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin gère les catégories" ON public.categories FOR ALL USING (public.is_admin());

-- POLITIQUES PRODUCTS
CREATE POLICY "Lecture publique des produits" ON public.products FOR SELECT USING (available = true OR public.is_admin());
CREATE POLICY "Admin gère les produits" ON public.products FOR ALL USING (public.is_admin());

-- POLITIQUES ORDERS
CREATE POLICY "Création de commande autorisée" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Client lit ses propres commandes" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admin gère toutes les commandes" ON public.orders FOR ALL USING (public.is_admin());

-- POLITIQUES ORDER_ITEMS
CREATE POLICY "Création des articles de commande" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Client lit ses articles de commande" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Admin gère tous les articles de commande" ON public.order_items FOR ALL USING (public.is_admin());

-- POLITIQUES RESERVATIONS
CREATE POLICY "Création de réservation autorisée" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Client lit ses réservations" ON public.reservations FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Client modifie/annule sa réservation" ON public.reservations FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admin gère toutes les réservations" ON public.reservations FOR ALL USING (public.is_admin());

-- POLITIQUES REVIEWS
CREATE POLICY "Lecture publique des avis visibles" ON public.reviews FOR SELECT USING (is_visible = true OR public.is_admin());
CREATE POLICY "Utilisateur connecté poste un avis" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin gère les avis" ON public.reviews FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 13. CONFIGURATION DES BUCKETS SUPABASE STORAGE (À exécuter dans Storage SQL)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('restaurant-assets', 'restaurant-assets', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Product Images Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Product Images Admin Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "Product Images Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "Product Images Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Avatars Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Avatars User Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Avatars User Update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==============================================================================
-- 14. SEED DATA - RESTAURANT INITIAL & CATEGORIES & 15+ PLATS GASTRONOMIQUES
-- ==============================================================================

-- Info restaurant
INSERT INTO public.restaurants (id, name, tagline, description, phone, email, address, city, delivery_fee)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Le Gourmet Royal',
    'L''Art Culinaire d''Excellence & Saveurs Royales',
    'Une cuisine gastronomique d''exception mariant fraîcheur des produits du terroir et savoir-faire culinaire moderne.',
    '+261 34 00 123 45',
    'contact@legourmetroyal.mg',
    '14 Avenue de l''Indépendance, Analakely',
    'Antananarivo 101',
    5000.00
) ON CONFLICT (id) DO NOTHING;

-- Catégories obligatoires
INSERT INTO public.categories (id, name, slug, description, icon_name, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Entrées', 'entrees', 'Mises en bouche raffinées et salades gourmandes', 'Salad', 1),
('c1000000-0000-0000-0000-000000000002', 'Plats', 'plats', 'Nos créations signatures et spécialités du Chef', 'ChefHat', 2),
('c1000000-0000-0000-0000-000000000003', 'Burgers', 'burgers', 'Burgers gourmets avec pains artisanaux et viandes sélectionnées', 'Beef', 3),
('c1000000-0000-0000-0000-000000000004', 'Pizzas', 'pizzas', 'Pizzas au feu de bois pâte fine et mozzarella di bufala', 'Pizza', 4),
('c1000000-0000-0000-0000-000000000005', 'Pâtes', 'pates', 'Pâtes fraîches maison aux sauces onctueuses', 'Soup', 5),
('c1000000-0000-0000-0000-000000000006', 'Poulet', 'poulet', 'Volailles fermières rôties, marinées et braisées', 'Egg', 6),
('c1000000-0000-0000-0000-000000000007', 'Viandes', 'viandes', 'Pièces de bœuf et zébu d''exception maturies', 'Flame', 7),
('c1000000-0000-0000-0000-000000000008', 'Poissons', 'poissons', 'Poissons nobles et crustacés de nos côtes', 'Fish', 8),
('c1000000-0000-0000-0000-000000000009', 'Boissons', 'boissons', 'Cocktails signatures, vins fins et jus pressés', 'Wine', 9),
('c1000000-0000-0000-0000-000000000010', 'Desserts', 'desserts', 'Douceurs sucrées de notre Maître Pâtissier', 'IceCream', 10)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 15+ Plats gastronomiques réalistes avec prix en Ariary (MGA)
INSERT INTO public.products (id, category_id, name, description, price, image_url, available, featured, popular, prep_time_minutes, calories) VALUES
-- Burgers
('p1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'Burger Royal Signature', 'Steak haché de zébu 200g, cheddar affiné, oignons caramélisés au miel, salade croquante et sauce truffée maison dans un pain brioché artisanal.', 35000.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', true, true, true, 20, 780),
('p1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003', 'Smoky Bacon & Truffle Burger', 'Double smash patty de bœuf, bacon croustillant, raclette fondue, roquette et mayonnaise fumée au poivre sauvage.', 38000.00, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80', true, false, true, 18, 850),

-- Viandes
('p1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000007', 'Filet de Zébu au Poivre Vert de Madagascar', 'Cœur de filet tendre saisi minute, réduction crémée au poivre vert frais de Manakara, écrasé de pommes de terre à l''huile de truffe.', 48000.00, 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80', true, true, true, 25, 620),
('p1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000007', 'Côte de Bœuf Grillée au Thym (Pour 2)', 'Côte maturée 30 jours (800g) grillée aux sarments de vigne, beurre maître d''hôtel et légumes glacés de saison.', 95000.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', true, false, false, 30, 1100),

-- Poissons
('p1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000008', 'Camarons Géants Flambés au Rhum', 'Gambas royales de Mahajanga saisies à la plancha, flambées au rhum ambré, émulsion citronnelle et riz parfumé au combava.', 55000.00, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80', true, true, true, 22, 510),
('p1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000008', 'Pavé de Saumon Sauvage Rôti', 'Saumon croustillant sur peau, mousseline de patates douces vanillées et beurre blanc à l''aneth.', 46000.00, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80', true, false, false, 20, 540),

-- Poulet
('p1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000006', 'Suprême de Volaille Fermière au Curry Coco', 'Suprême doré au four, sauce crémeuse lait de coco et épices douces, mangue rôtie et riz basmati aux amandes.', 36000.00, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80', true, false, true, 20, 590),
('p1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000006', 'Brochettes de Poulet Yakitori Laquées', 'Dés de cuisse marinés au gingembre et soja doux, graines de sésame grillées et salade d''algues wakame.', 28000.00, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80', true, false, false, 15, 450),

-- Pizzas
('p1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000004', 'Pizza Truffe & Burrata Crémeuse', 'Crème de truffe blanche, fior di latte, véritable burrata des Pouilles posée à cru, copeaux de parmesan 24 mois et roquette.', 42000.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', true, true, true, 15, 820),
('p1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000004', 'Pizza Reine di Parma', 'Coulis de tomates San Marzano, mozzarella fraîche, jambon de Parme affiné 18 mois, champignons de Paris frais et basilic.', 34000.00, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80', true, false, false, 15, 760),

-- Pâtes
('p1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000005', 'Tagliatelles Fraîches aux Fruits de Mer', 'Pâtes artisanales maison, calamars, moules, crevettes sautées à l''ail doux, vin blanc et bisque de homard.', 44000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', true, false, true, 18, 640),
('p1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000005', 'Ravioles Maison Ricotta & Épinards', 'Ravioles confectionnées le jour même, crème légère de parmesan et noisettes torréfiées concassées.', 32000.00, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', true, false, false, 15, 520),

-- Entrées
('p1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000001', 'Carpaccio de Zébu aux Baies Roses', 'Fines tranches de zébu mariné à l''huile d''olive vierge extra, copeaux de pecorino, baies roses et câpres.', 24000.00, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80', true, false, true, 10, 310),
('p1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000001', 'Foie Gras Poêlé sur Pain d''Épices', 'Escalope de foie gras de canard mi-cuit, chutney de mangue épicée et réduction de vin de porto.', 38000.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', true, true, false, 12, 490),

-- Desserts
('p1000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000010', 'Dôme Chocolat Grand Cru Sambirano', 'Chocolat noir 70% pure origine Madagascar, cœur coulant praliné feuillantine et glace artisanale à la vanille Bourbon.', 22000.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', true, true, true, 10, 480),
('p1000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000010', 'Millefeuille Croustillant Vanille Bourbon', 'Feuilletage inversé caramélisé, crème diplomate onctueuse aux gousses de vanille de Sava et caramel beurre salé.', 19000.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', true, false, true, 10, 410),

-- Boissons
('p1000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000009', 'Cocktail Royal Émeraude', 'Gin infusé au combava, liqueur de litchi, purée de fruit de la passion frais, jus de citron vert et champagne.', 25000.00, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', true, true, true, 5, 180),
('p1000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000009', 'Jus Frais Pressé des Îles (50cl)', 'Cocktail vitaminé minute : Ananas Victoria, mangue fraîche, gingembre et menthe poivrée.', 12000.00, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80', true, false, false, 5, 120)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price;
