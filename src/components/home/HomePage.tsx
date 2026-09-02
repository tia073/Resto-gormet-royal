import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Star,
  Truck,
  ChefHat,
  CalendarCheck,
  QrCode,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../menu/ProductCard';
import { DishDetailModal } from '../menu/DishDetailModal';
import { Product } from '../../types/restaurant';
import { formatAriary } from '../../lib/utils';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { categories, products, orders, reservations, reviews, settings } = useRestaurant();
  const { tableNumber } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Popular and Featured items
  const popularDishes = products.filter((p) => p.popular && p.available).slice(0, 4);
  const featuredDishes = products.filter((p) => p.featured && p.available).slice(0, 4);
  const publicReviews = reviews.filter((r) => r.is_visible).slice(0, 3);
  const platDuJour = products.find((p) => p.featured && p.available) || products[0];

  // Calculated Stats
  const activeOrdersCount = orders.filter((o) => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length;
  const reservedTablesCount = reservations.filter((r) => r.status === 'confirmed' || r.status === 'pending').length;
  const todayRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-12 pb-20 pt-6">
      {/* 1. HERO & GASTRONOMY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Block: Experience Culinaire Dark Hero Card */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-8 sm:p-10 bg-[#1A1A1A] text-white rounded-xl shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[320px]">
              <div className="relative z-10 space-y-4">
                {tableNumber && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold uppercase tracking-wider">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Table N° {tableNumber} active</span>
                  </div>
                )}
                
                <div className="inline-flex items-center gap-2 text-[10px] text-[#C5A059] uppercase tracking-widest font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gastronomie & Saveurs Royales</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif leading-tight">
                  Expérience Culinaire
                </h2>

                <p className="text-gray-400 text-xs sm:text-sm max-w-lg leading-relaxed font-normal">
                  Bienvenue sur votre portail {settings.name || "L'Essence"}. Découvrez des créations saisonnières d'exception mariant zébu raffiné, fruits de mer de l'Océan Indien et savoir-faire haute gastronomie.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    onClick={() => onNavigate('/reservation')}
                    className="bg-[#C5A059] hover:bg-[#B38E47] text-white px-6 py-3 rounded-md text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Réserver une Table</span>
                  </button>
                  <button
                    onClick={() => onNavigate('/menu')}
                    className="bg-transparent hover:bg-white/10 text-white border border-[#E5E1D8]/30 px-6 py-3 rounded-md text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Explorer le Menu
                  </button>
                </div>
              </div>

              {/* Geometric subtle circle accent */}
              <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
                <div className="w-72 h-72 border-[24px] border-[#C5A059] rounded-full"></div>
              </div>
            </div>

            {/* Plat du Jour spotlight card matching design */}
            {platDuJour && (
              <div
                onClick={() => setSelectedProduct(platDuJour)}
                className="p-5 bg-white border border-[#E5E1D8] rounded-xl shadow-sm hover:border-[#C5A059] transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F5F2ED] border border-[#E5E1D8] shrink-0">
                    <img
                      src={platDuJour.image_url}
                      alt={platDuJour.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-1">
                      Plat du Jour Signature
                    </h3>
                    <h4 className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                      {platDuJour.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1 max-w-sm mt-0.5">
                      {platDuJour.description}
                    </p>
                    <span className="text-[#C5A059] font-bold text-sm block mt-1 font-mono">
                      {formatAriary(platDuJour.price)}
                    </span>
                  </div>
                </div>

                <button className="px-4 py-2 bg-[#F5F2ED] group-hover:bg-[#C5A059] text-stone-800 group-hover:text-white rounded-md text-xs font-bold uppercase tracking-wider transition-all self-end sm:self-center shrink-0">
                  Découvrir
                </button>
              </div>
            )}
          </div>

          {/* Right Block: Live Dashboard Indicators & Quick Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E5E1D8] p-5 rounded-xl flex flex-col justify-between shadow-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400">Revenu Global</span>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-xl font-bold text-[#1A1A1A]">
                    {todayRevenue > 0 ? (todayRevenue / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + 'k' : '1 240k'}
                  </span>
                  <span className="text-[10px] text-[#C5A059] font-bold">Ar</span>
                </div>
                <div className="w-full h-1 bg-[#F5F2ED] rounded-full overflow-hidden">
                  <div className="w-[70%] h-full bg-[#C5A059]"></div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E1D8] p-5 rounded-xl flex flex-col justify-between shadow-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400">Commandes</span>
                <span className="text-3xl font-bold text-[#1A1A1A] my-1">
                  {orders.length > 0 ? String(orders.length).padStart(2, '0') : '12'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">
                    {activeOrdersCount > 0 ? `${activeOrdersCount} en cours` : '8 en cuisine'}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-[#E5E1D8] p-5 rounded-xl flex flex-col justify-between shadow-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400">Tables Réservées</span>
                <span className="text-3xl font-bold text-[#1A1A1A] my-1">
                  {reservedTablesCount > 0 ? String(reservedTablesCount).padStart(2, '0') : '07'}
                </span>
                <span className="text-[10px] text-gray-500 uppercase italic">
                  Service du soir
                </span>
              </div>
            </div>

            {/* Suivi des Commandes Récentes Table */}
            <div className="bg-white border border-[#E5E1D8] rounded-xl overflow-hidden flex flex-col shadow-sm flex-1">
              <div className="bg-[#FDFCF8] px-6 py-3.5 border-b border-[#E5E1D8] flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                  Suivi des Commandes Récentes
                </h3>
                <span className="text-[10px] bg-[#C5A059]/10 text-[#C5A059] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Temps Réel
                </span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F5F2ED]/60 text-[10px] uppercase tracking-wider text-gray-400 border-b border-[#E5E1D8]">
                      <th className="px-4 py-2.5 font-semibold">Numéro</th>
                      <th className="px-4 py-2.5 font-semibold">Client</th>
                      <th className="px-4 py-2.5 font-semibold">Type</th>
                      <th className="px-4 py-2.5 font-semibold">Total</th>
                      <th className="px-4 py-2.5 font-semibold">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {orders.slice(0, 3).map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => onNavigate(`/orders/${order.id}`)}
                        className="border-b border-[#F5F2ED] hover:bg-[#FDFCF8] cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-[11px] font-medium text-gray-600">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#1A1A1A] truncate max-w-[100px]">
                          {order.customer_name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-700 uppercase font-medium">
                            {order.delivery_type === 'dine_in'
                              ? `Table ${order.table_number || '1'}`
                              : order.delivery_type === 'takeaway'
                              ? 'Retrait'
                              : 'Livraison'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-[#1A1A1A] font-mono">
                          {formatAriary(order.total)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-semibold text-[#C5A059] capitalize">
                            {order.status === 'preparing' ? 'En préparation' : order.status === 'ready' ? 'Prête' : order.status === 'completed' ? 'Terminée' : 'Confirmée'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr className="border-b border-[#F5F2ED]">
                        <td className="px-4 py-3 font-mono text-xs">CMD-2026-0412</td>
                        <td className="px-4 py-3 font-medium">Jean-Claude R.</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-[10px]">Livraison</span></td>
                        <td className="px-4 py-3 font-bold">75 000 Ar</td>
                        <td className="px-4 py-3"><span className="text-xs text-amber-600 font-semibold italic">En préparation</span></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-[#FDFCF8] border-t border-[#E5E1D8] text-center">
                <button
                  onClick={() => onNavigate('/orders')}
                  className="text-xs font-bold text-[#C5A059] hover:underline uppercase tracking-wider"
                >
                  Voir toutes les commandes →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E1D8] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
              Voyage Gustatif
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mt-1">
              Explorez Nos Catégories
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/menu')}
            className="text-xs text-[#C5A059] hover:underline font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>Voir toute la carte</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate('/menu')}
                className="group p-5 bg-white border border-[#E5E1D8] hover:border-[#C5A059] rounded-xl text-center space-y-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 shadow-xs hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-lg bg-[#F5F2ED] border border-[#E5E1D8] group-hover:border-[#C5A059] flex items-center justify-center text-[#C5A059] mx-auto transition-colors">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <h3 className="font-serif-title font-bold text-[#1A1A1A] text-xs sm:text-sm group-hover:text-[#C5A059] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-gray-500 block">
                  {count} {count > 1 ? 'créations' : 'création'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. POPULAR DISHES */}
      {popularDishes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E1D8] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] font-serif-title flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-[#C5A059]" /> Les Incontournables
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mt-1">
                Nos Plats Populaires
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/menu')}
              className="text-xs text-[#C5A059] hover:underline font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Voir tout le menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. CHEF'S SIGNATURE CREATIONS */}
      {featuredDishes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E1D8] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] font-serif-title flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Recommandations Royales
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mt-1">
                Les Suggestions du Chef
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/menu')}
              className="text-xs text-[#C5A059] hover:underline font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Explorer la carte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDishes.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. RESERVATION BANNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-[#1A1A1A] text-white p-8 sm:p-12 text-center space-y-6 shadow-xl border border-[#E5E1D8]">
          <div className="w-12 h-12 bg-[#252525] border border-[#C5A059] flex items-center justify-center text-[#C5A059] mx-auto rounded-sm">
            <CalendarCheck className="w-6 h-6" />
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
              Moments d'Exception
            </span>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-extrabold text-white">
              Vivez une Expérience Gastronomique Inoubliable
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-normal">
              Pour un dîner d'affaires, une célébration en famille ou un tête-à-tête intime, notre équipe vous réserve une table d'honneur dans un cadre feutré et soigné.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('/reservation')}
              className="px-8 py-3.5 rounded-md bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Réserver Votre Table Dès Maintenant</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. REVIEWS & TESTIMONIALS */}
      {publicReviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
              Témoignages & Avis
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
              Ce Que Disent Nos Convives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publicReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-stone-600 text-xs sm:text-sm italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E1D8] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A1A1A]">{rev.user_name}</span>
                  {rev.product_name && (
                    <span className="text-[#C5A059] text-[11px] font-semibold">{rev.product_name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dish Detail Modal */}
      <DishDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
