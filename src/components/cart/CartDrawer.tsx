import React from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBasket,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatAriary } from '../../lib/utils';
import { EmptyState } from '../ui/EmptyState';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    itemCount,
    tableNumber,
  } = useCart();

  if (!isCartOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    onNavigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FDFCF8] border-l border-[#E5E1D8] h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E1D8] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] border border-[#C5A059]/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-[#1A1A1A] text-lg">
                Votre Panier Gourmand
              </h3>
              <p className="text-xs text-stone-500">
                {itemCount} {itemCount > 1 ? 'articles sélectionnés' : 'article sélectionné'}
                {tableNumber && ` • Table #${tableNumber}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-[#F5F2ED] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <EmptyState
              title="Votre panier est vide"
              description="Laissez-vous tenter par les créations uniques et saveurs royales de notre menu."
              icon={ShoppingBasket}
              actionLabel="Consulter le menu"
              onAction={() => {
                setIsCartOpen(false);
                onNavigate('/menu');
              }}
            />
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3.5 bg-white rounded-xl border border-[#E5E1D8] relative group shadow-xs"
                >
                  {/* Dish Image */}
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-lg object-cover shrink-0 border border-[#E5E1D8]"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif-title font-bold text-[#1A1A1A] text-sm truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-[#C5A059] font-mono mt-0.5">
                        {formatAriary(item.product.price)}
                      </p>
                      {item.special_instructions && (
                        <p className="text-[11px] text-stone-500 italic line-clamp-1 mt-0.5">
                          Note : {item.special_instructions}
                        </p>
                      )}
                    </div>

                    {/* Quantity Control & Line Total */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#E5E1D8]">
                      <div className="flex items-center gap-1.5 bg-[#FDFCF8] border border-[#E5E1D8] rounded-md p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded text-stone-500 hover:text-[#1A1A1A] hover:bg-[#F5F2ED] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#1A1A1A] font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded text-stone-500 hover:text-[#1A1A1A] hover:bg-[#F5F2ED] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#1A1A1A] font-mono">
                        {formatAriary(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-1">
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Vider le panier
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Subtotal & Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E5E1D8] bg-white space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>Sous-total plats :</span>
                <span className="font-mono text-stone-700 font-semibold">{formatAriary(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#1A1A1A] font-bold text-base pt-2 border-t border-[#E5E1D8]">
                <span className="font-serif-title">Total estimé :</span>
                <span className="text-[#C5A059] font-mono text-xl">{formatAriary(subtotal)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleGoToCheckout}
                className="w-full py-3 px-4 rounded-lg bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span>Passer la commande</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2.5 px-4 rounded-lg bg-[#F5F2ED] hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-[#E5E1D8]"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
