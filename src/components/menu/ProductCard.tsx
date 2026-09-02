import React from 'react';
import { Plus, Flame, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { Product } from '../../types/restaurant';
import { formatAriary } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.available) {
      addToCart(product, 1);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-xl border border-[#E5E1D8] hover:border-[#C5A059] transition-all duration-200 overflow-hidden cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-[#F5F2ED] border-b border-[#E5E1D8]">
        <img
          src={product.image_url}
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            !product.available ? 'grayscale opacity-60' : ''
          }`}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {!product.available ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-rose-600 text-white shadow-xs">
              <AlertCircle className="w-3 h-3" /> Indisponible
            </span>
          ) : (
            <>
              {product.popular && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#1A1A1A] text-[#C5A059] border border-[#C5A059]/40 shadow-xs">
                  <Flame className="w-3 h-3 fill-[#C5A059]" /> Populaire
                </span>
              )}
              {product.featured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#C5A059] text-white shadow-xs">
                  <Sparkles className="w-3 h-3" /> Chef
                </span>
              )}
            </>
          )}
        </div>

        {/* Prep Time */}
        {product.prep_time_minutes && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-black/70 text-white backdrop-blur-xs">
            <Clock className="w-3 h-3 text-[#C5A059]" />
            <span>{product.prep_time_minutes} min</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="mb-2">
          {product.category_name && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
              {product.category_name}
            </span>
          )}
          <h3 className="font-serif-title font-bold text-[#1A1A1A] text-base group-hover:text-[#C5A059] transition-colors line-clamp-1 mt-0.5">
            {product.name}
          </h3>
        </div>

        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        {/* Footer: Price & Add Button */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E5E1D8] mt-auto">
          <div>
            <span className="block text-[9px] uppercase tracking-widest text-stone-400 font-bold">
              Tarif
            </span>
            <span className="font-bold text-sm sm:text-base text-[#C5A059] font-mono">
              {formatAriary(product.price)}
            </span>
          </div>

          <button
            disabled={!product.available}
            onClick={handleAddToCart}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-xs ${
              product.available
                ? 'bg-[#C5A059] hover:bg-[#B38E47] text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{product.available ? 'Ajouter' : 'Épuisé'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
