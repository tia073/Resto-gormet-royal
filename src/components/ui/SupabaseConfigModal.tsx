import React, { useState, useEffect } from 'react';
import {
  Database,
  Key,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  X,
  ShieldCheck,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  supabaseUrl,
  supabaseAnonKey,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
} from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { role, switchDemoRole } = useAuth();
  const [url, setUrl] = useState(supabaseUrl);
  const [key, setKey] = useState(supabaseAnonKey);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql' | 'guide'>('config');

  useEffect(() => {
    if (isOpen) {
      setUrl(supabaseUrl);
      setKey(supabaseAnonKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      alert('Veuillez remplir les deux champs.');
      return;
    }
    saveCustomSupabaseConfig(url, key);
  };

  const handleClear = () => {
    if (confirm('Voulez-vous réinitialiser la configuration Supabase ?')) {
      clearCustomSupabaseConfig();
    }
  };

  const sqlSchemaText = `-- ==============================================================================
-- SCHEMA COMPLET SUPABASE - LE GOURMET ROYAL
-- Exécuter dans : Supabase Dashboard -> SQL Editor -> New Query
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE RESTAURANTS
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE PROFILES
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

-- 3. TABLE CATEGORIES
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

-- 4. TABLE PRODUCTS
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

-- 5. TABLE ORDERS
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

-- 6. TABLE ORDER_ITEMS
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

-- 7. TABLE RESERVATIONS
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

-- 8. TABLE REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUTO PROFILE TRIGGER ON AUTH.USERS INSERTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        'customer'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. RLS POLICIES
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Public Read Restaurants" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Admin All Restaurants" ON public.restaurants FOR ALL USING (public.is_admin());

CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL USING (public.is_admin());

CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (available = true OR public.is_admin());
CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (public.is_admin());

CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "User Update Profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin All Profiles" ON public.profiles FOR ALL USING (public.is_admin());

CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "User Read Orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admin All Orders" ON public.orders FOR ALL USING (public.is_admin());

CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "User Read Order Items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Admin All Order Items" ON public.order_items FOR ALL USING (public.is_admin());

CREATE POLICY "Public Insert Reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "User Read Reservations" ON public.reservations FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admin All Reservations" ON public.reservations FOR ALL USING (public.is_admin());

CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (is_visible = true OR public.is_admin());
CREATE POLICY "User Insert Reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin All Reviews" ON public.reviews FOR ALL USING (public.is_admin());
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadSql = () => {
    const blob = new Blob([sqlSchemaText], { type: 'text/sql;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'le-gourmet-royal-supabase-schema.sql';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 flex items-center gap-2 text-lg">
                Configuration Supabase PostgreSQL & Auth
                {isSupabaseConfigured ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connecté
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <AlertCircle className="w-3.5 h-3.5" /> Mode Démo / Hors-Ligne Actif
                  </span>
                )}
              </h3>
              <p className="text-xs text-stone-400">
                Gestion de la base de données relationnelle, RLS, Storage et Authentification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-800 bg-stone-900/50">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'config'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Paramètres de Connexion
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Script SQL Complet
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Guide d'Installation (8 Étapes)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-300">
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-200">État actuel :</span>
                  {isSupabaseConfigured ? (
                    <span className="text-emerald-400 font-medium">Connecté à votre projet Supabase</span>
                  ) : (
                    <span className="text-amber-400 font-medium">Stockage local actif (Prêt pour injection)</span>
                  )}
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  L'application utilise le client officiel <code className="text-amber-300">@supabase/supabase-js</code>. Vous pouvez connecter votre propre projet Supabase en renseignant ci-dessous vos variables ou en configurant les variables d'environnement <code className="text-amber-300">VITE_SUPABASE_URL</code> et <code className="text-amber-300">VITE_SUPABASE_ANON_KEY</code>.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    VITE_SUPABASE_URL
                  </label>
                  <div className="relative">
                    <Database className="w-4 h-4 absolute left-3 top-3.5 text-stone-500" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    VITE_SUPABASE_ANON_KEY
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-3.5 text-stone-500" />
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                  >
                    Effacer les clés enregistrées
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-stone-300 hover:bg-stone-800 transition-colors"
                    >
                      Fermer
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold transition-colors shadow-lg shadow-amber-500/20"
                    >
                      Enregistrer & Connecter
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Role Switcher for instant admin evaluation */}
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Simulateur de Rôle (Test immédiat)
                  </span>
                  <span className="text-xs text-amber-400 font-medium capitalize">
                    Rôle actif : {role}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mb-3">
                  Permet de tester instantanément l'interface Client vs l'espace d'administration Dashboard (/admin) :
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => switchDemoRole('customer')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      role === 'customer'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    Rôle Client (Customer)
                  </button>
                  <button
                    onClick={() => switchDemoRole('admin')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      role === 'admin'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    Rôle Administrateur (Admin)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-400">
                  Copiez ou téléchargez ce script SQL complet pour initialiser automatiquement les 8 tables, triggers, politiques RLS et les 18 plats en Ariary dans Supabase.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={copySql}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copié !' : 'Copier SQL'}
                  </button>
                  <button
                    onClick={downloadSql}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-stone-950 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Télécharger .sql
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-stone-950 rounded-xl border border-stone-800 text-xs font-mono text-stone-300 overflow-x-auto max-h-96 leading-relaxed">
                {sqlSchemaText}
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <strong>Guide Officiel d'Installation Supabase pour Le Gourmet Royal</strong>
              </div>

              <ol className="space-y-4 list-decimal list-inside text-stone-300 text-xs sm:text-sm">
                <li className="p-3 bg-stone-950 rounded-lg border border-stone-800">
                  <strong className="text-stone-100">1. Créer le projet Supabase :</strong> Rendez-vous sur <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a>, créez un compte et un nouveau projet PostgreSQL.
                </li>
                <li className="p-3 bg-stone-950 rounded-lg border border-stone-800">
                  <strong className="text-stone-100">2. Exécuter le script SQL :</strong> Ouvrez l'onglet <em>SQL Editor</em> dans Supabase, collez le contenu du script de l'onglet <em>Script SQL Complet</em> ci-dessus et cliquez sur <strong>Run</strong>.
                </li>
                <li className="p-3 bg-stone-950 rounded-lg border border-stone-800">
                  <strong className="text-stone-100">3. Créer les buckets Storage :</strong> Allez dans <em>Storage</em> et créez les 3 buckets publics : <code className="text-amber-300">product-images</code>, <code className="text-amber-300">avatars</code>, et <code className="text-amber-300">restaurant-assets</code>.
                </li>
                <li className="p-3 bg-stone-950 rounded-lg border border-stone-800">
                  <strong className="text-stone-100">4. Configurer Supabase Auth :</strong> Dans <em>Authentication &gt; Providers</em>, vérifiez que le fournisseur Email est activé.
                </li>
                <li className="p-3 bg-stone-950 rounded-lg border border-stone-800">
                  <strong className="text-stone-100">5. Configurer Google OAuth (Optionnel) :</strong> Activez Google dans <em>Authentication → Providers</em>. Dans <em>Authentication → URL Configuration</em>, Site URL = l’URL publique du site, et Redirect URLs doit contenir <code className="text-amber-300">{'{origine}'}/auth/callback</code> (ex. <code className="text-amber-300">http://localhost:3000/auth/callback</code> et l’URL de production). Dans Google Cloud (client OAuth <em>Web</em>), Authorized redirect URI = <code className="text-amber-300">https://VOTRE-PROJET.supabase.co/auth/v1/callback</code> ; Authorized JavaScript origins = l’origine du site + <code className="text-amber-300">https://VOTRE-PROJET.supabase.co</code>.
                </li>
                <li className="p-3 bg-stone-950 rounded-lg border border-stone-800">
                  <strong className="text-stone-100">6. Récupérer les clés API :</strong> Rendez-vous dans <em>Project Settings &gt; API</em>. Copiez l'<strong>URL du projet</strong> et la <strong>Clé anonyme (anon / public)</strong>.
                </li>
                <li className="p-3 bg-stone-950 rounded-lg border border-stone-800">
                  <strong className="text-stone-100">7. Créer le premier Administrateur :</strong> Créez votre compte client normal via l'application, puis dans Supabase (<em>Table Editor &gt; profiles</em>), modifiez votre rôle de <code className="text-stone-300">customer</code> à <code className="text-amber-300">admin</code>.
                </li>
                <li className="p-3 bg-stone-950 rounded-lg border border-stone-800">
                  <strong className="text-stone-100">8. Connecter l'application :</strong> Collez vos identifiants dans le formulaire de l'onglet <em>Paramètres de Connexion</em> ou dans votre fichier <code className="text-stone-300">.env</code> (<code className="text-amber-300">VITE_SUPABASE_URL</code> et <code className="text-amber-300">VITE_SUPABASE_ANON_KEY</code>).
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
