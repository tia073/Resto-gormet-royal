import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Sparkles,
  Utensils,
  CheckCircle2,
  X,
  QrCode,
} from 'lucide-react';
import { Product, Category } from '../../types/restaurant';
import { ProductCard } from './ProductCard';
import { DishDetailModal } from './DishDetailModal';
import { EmptyState } from '../ui/EmptyState';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

interface MenuBrowserProps {
  initialCategoryId?: string;
}

export const MenuBrowser: React.FC<MenuBrowserProps> = ({ initialCategoryId }) => {
  const { categories, products, isLoading } = useRestaurant();
  const { tableNumber } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [filterType, setFilterType] = useState<'all' | 'popular' | 'featured' | 'available'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Active categories only
  const activeCategories = useMemo(() => {
    return categories.filter((c) => c.is_active);
  }, [categories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
          return false;
        }

        // Quick filter
        if (filterType === 'popular' && !p.popular) return false;
        if (filterType === 'featured' && !p.featured) return false;
        if (filterType === 'available' && !p.available) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category_name?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // default order
      });
  }, [products, selectedCategory, filterType, searchQuery, sortBy]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Table Banner if table QR code is present */}
      {tableNumber && (
        <div className="p-4 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#C5A059] text-white font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#1A1A1A] text-sm">
                Service à Table Détecté : Table N° {tableNumber}
              </h4>
              <p className="text-xs text-stone-500">
                Vos sélections seront automatiquement associées à cette table lors de la commande.
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 bg-[#1A1A1A] text-[#C5A059] font-bold rounded-md uppercase tracking-wider">
            Sur Place
          </span>
        </div>
      )}

      {/* Header Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
          Haute Gastronomie
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A]">
          Notre Menu & Spécialités
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
          Découvrez des créations culinaires d'exception confectionnées avec les meilleurs ingrédients frais de saison.
        </p>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E5E1D8] shadow-xs">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un plat, ingrédient (ex: zébu, homard, camarons...)"
            className="w-full pl-10 pr-10 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] placeholder-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Buttons & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#F5F2ED] p-1 rounded-lg border border-[#E5E1D8]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterType('popular')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                filterType === 'popular'
                  ? 'bg-[#C5A059] text-white shadow-xs'
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              <Flame className="w-3 h-3" /> Populaire
            </button>
            <button
              onClick={() => setFilterType('featured')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                filterType === 'featured'
                  ? 'bg-[#C5A059] text-white shadow-xs'
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              <Sparkles className="w-3 h-3" /> Chef
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-stone-700 text-xs font-semibold focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="default">Tri : Recommandé</option>
              <option value="price-asc">Prix : Croissant</option>
              <option value="price-desc">Prix : Décroissant</option>
              <option value="name">Nom : A à Z</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-stone-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
              : 'bg-white text-stone-700 border-[#E5E1D8] hover:border-[#C5A059]'
          }`}
        >
          Tous les plats ({products.length})
        </button>

        {activeCategories.map((cat) => {
          const count = products.filter((p) => p.category_id === cat.id).length;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
                  : 'bg-white text-stone-700 border-[#E5E1D8] hover:border-[#C5A059]'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#F5F2ED] text-stone-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <LoadingSpinner label="Chargement des plats en cours..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="Aucun plat disponible"
          description="Aucune création culinaire ne correspond à vos critères de recherche ou de filtre actuels."
          actionLabel="Réinitialiser les filtres"
          onAction={() => {
            setSelectedCategory('all');
            setSearchQuery('');
            setFilterType('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Dish Detail Modal */}
      <DishDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
