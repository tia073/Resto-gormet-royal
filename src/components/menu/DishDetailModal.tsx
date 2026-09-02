import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  Flame,
  Sparkles,
  AlertCircle,
  Star,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { Product, Review } from '../../types/restaurant';
import { formatAriary } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';

interface DishDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { user, profile } = useAuth();
  const { reviews, addReview } = useRestaurant();

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!product) return null;

  const dishReviews = reviews.filter(
    (r) => r.product_id === product.id && r.is_visible
  );

  const handleAdd = () => {
    if (!product.available) return;
    addToCart(product, quantity, specialInstructions);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 900);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user || !profile) return;

    setIsSubmittingReview(true);
    const res = await addReview({
      userId: user.id || profile.id,
      userName: profile.full_name || 'Client Gourmand',
      userAvatar: profile.avatar_url,
      productId: product.id,
      productName: product.name,
      rating,
      comment,
    });

    setIsSubmittingReview(false);
    if (res.success) {
      setComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FDFCF8] border border-[#E5E1D8] rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 text-stone-700 hover:text-black hover:bg-white transition-colors border border-[#E5E1D8] shadow-xs cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#F5F2ED] border-b border-[#E5E1D8]">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {!product.available ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                <AlertCircle className="w-3.5 h-3.5" /> Indisponible
              </span>
            ) : (
              <>
                {product.popular && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#1A1A1A] text-[#C5A059] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    <Flame className="w-3.5 h-3.5 fill-[#C5A059]" /> Populaire
                  </span>
                )}
                {product.featured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" /> Recommandation du Chef
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Title and Category */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E5E1D8] pb-5">
            <div>
              {product.category_name && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                  {product.category_name}
                </span>
              )}
              <h2 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mt-1">
                {product.name}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="block text-[9px] uppercase tracking-widest text-stone-400 font-bold">Prix unitaire</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#C5A059] font-mono">
                {formatAriary(product.price)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 font-serif-title">
              Description & Préparation
            </h4>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Attributes: Prep time, calories, allergens */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white rounded-xl border border-[#E5E1D8] text-xs shadow-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <span>Temps : {product.prep_time_minutes || 20} minutes</span>
            </div>
            {product.calories && (
              <div className="flex items-center gap-2 text-stone-700">
                <Flame className="w-4 h-4 text-[#C5A059]" />
                <span>Calories : {product.calories} kcal</span>
              </div>
            )}
            {product.allergens && product.allergens.length > 0 && (
              <div className="flex items-center gap-2 text-stone-700 col-span-1 sm:col-span-3">
                <ShieldAlert className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Allergènes : {product.allergens.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Special instructions */}
          {product.available && (
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider">
                Instructions Spéciales pour la cuisine (Optionnel)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Ex: Cuisson à point, sauce à part, sans oignons..."
                rows={2}
                className="w-full px-4 py-2 rounded-lg bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] resize-none"
              />
            </div>
          )}

          {/* Add to Cart Actions */}
          {product.available ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-[#E5E1D8]">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between sm:justify-start gap-4 p-1 bg-white border border-[#E5E1D8] rounded-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3 hidden sm:inline">
                  Quantité :
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 rounded-md bg-[#F5F2ED] text-stone-700 hover:text-black transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-[#1A1A1A] font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 rounded-md bg-[#F5F2ED] text-stone-700 hover:text-black transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Total & Submit Button */}
              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-md font-bold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 cursor-pointer ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#C5A059] hover:bg-[#B38E47] text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ajouté au panier !</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Ajouter au panier — {formatAriary(product.price * quantity)}
                    </span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-700 font-semibold">
              Ce plat est actuellement indisponible en cuisine. Revenez très bientôt !
            </div>
          )}

          {/* Customer Reviews for this dish */}
          <div className="border-t border-[#E5E1D8] pt-6 space-y-4">
            <h4 className="font-serif-title font-bold text-base text-[#1A1A1A] flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
              Avis des Convives ({dishReviews.length})
            </h4>

            {dishReviews.length === 0 ? (
              <p className="text-xs text-stone-400 italic">
                Soyez le premier à donner votre avis sur cette création culinaire !
              </p>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {dishReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 bg-white rounded-xl border border-[#E5E1D8] text-xs space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1A1A]">{rev.user_name}</span>
                      <div className="flex items-center gap-0.5 text-[#C5A059]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Post review if logged in */}
            {user || profile ? (
              <form onSubmit={handleReviewSubmit} className="pt-2 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-500 font-medium">Votre note :</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 text-[#C5A059] hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            s <= rating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre avis sur ce plat..."
                    required
                    className="flex-1 px-4 py-2 rounded-lg bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    {isSubmittingReview ? 'Envoi...' : 'Publier'}
                  </button>
                </div>
                {reviewSuccess && (
                  <p className="text-xs text-emerald-600 font-semibold">Merci ! Votre avis a été enregistré.</p>
                )}
              </form>
            ) : (
              <p className="text-xs text-stone-500 bg-white p-3 rounded-lg border border-[#E5E1D8]">
                Connectez-vous pour laisser un avis sur ce plat.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
