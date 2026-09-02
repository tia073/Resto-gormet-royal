import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  Store,
  Utensils,
  MapPin,
  Phone,
  User,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderType } from '../../types/restaurant';
import { formatAriary } from '../../lib/utils';
import { EmptyState } from '../ui/EmptyState';

interface CheckoutViewProps {
  onNavigate: (path: string) => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onNavigate,
  onOrderSuccess,
}) => {
  const { items, subtotal, clearCart, tableNumber, setTableNumber } = useCart();
  const { user, profile } = useAuth();
  const { settings, createOrder } = useRestaurant();

  // Order type selection
  const [orderType, setOrderType] = useState<OrderType>(
    tableNumber ? 'dine_in' : 'delivery'
  );

  // Form states
  const [customerName, setCustomerName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '+261 34 ');
  const [email, setEmail] = useState(profile?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState(profile?.address || '');
  const [deliveryCity, setDeliveryCity] = useState(settings.city || 'Antananarivo');
  const [notes, setNotes] = useState('');
  const [tableInput, setTableInput] = useState(tableNumber || '1');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculations
  const deliveryFee = orderType === 'delivery' ? settings.delivery_fee : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="py-20 px-4 max-w-2xl mx-auto">
        <EmptyState
          title="Votre panier est vide"
          description="Vous devez sélectionner au moins un plat avant de passer commande."
          actionLabel="Retourner au menu"
          onAction={() => onNavigate('/menu')}
        />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Veuillez renseigner votre nom complet.');
      return;
    }

    if (!phone.trim() || phone.length < 8) {
      setErrorMessage('Veuillez renseigner un numéro de téléphone valide.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Veuillez renseigner votre adresse de livraison complète.');
      return;
    }

    if (orderType === 'dine_in' && !tableInput.trim()) {
      setErrorMessage('Veuillez préciser le numéro de votre table.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        subtotal: item.product.price * item.quantity,
        notes: item.special_instructions,
        imageUrl: item.product.image_url,
      }));

      const res = await createOrder({
        userId: user?.id || profile?.id || null,
        orderType,
        tableNumber: orderType === 'dine_in' ? tableInput : null,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        deliveryCity: orderType === 'delivery' ? deliveryCity.trim() : undefined,
        notes: notes.trim() || undefined,
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
      });

      if (!res.success || !res.order) {
        setErrorMessage(res.error || 'Erreur lors de la création de la commande.');
        setIsSubmitting(false);
        return;
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#b45309', '#ffffff'],
        });
      } catch (_) {}

      clearCart();
      setIsSubmitting(false);
      onOrderSuccess(res.order.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur inattendue est survenue.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/menu')}
        className="inline-flex items-center gap-2 text-stone-500 hover:text-[#C5A059] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retourner à la carte</span>
      </button>

      {/* Header */}
      <div className="space-y-2 border-b border-[#E5E1D8] pb-5">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
          Finalisation
        </span>
        <h1 className="font-serif-title text-2xl sm:text-4xl font-extrabold text-[#1A1A1A]">
          Validation de votre Commande
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          Choisissez votre mode de service et confirmez vos informations de contact.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Type Selector */}
          <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-4 shadow-xs">
            <h3 className="font-serif-title font-bold text-[#1A1A1A] text-sm sm:text-base">
              1. Sélectionnez votre mode de dégustation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all cursor-pointer ${
                  orderType === 'dine_in'
                    ? 'bg-[#C5A059]/10 border-[#C5A059] text-[#1A1A1A] shadow-xs'
                    : 'bg-[#FDFCF8] border-[#E5E1D8] text-stone-600 hover:border-[#C5A059]'
                }`}
              >
                <Utensils className="w-6 h-6 mb-2 text-[#C5A059]" />
                <span className="font-bold text-xs sm:text-sm text-[#1A1A1A]">Sur place</span>
                <span className="text-[11px] text-stone-500 mt-1">Service à table</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all cursor-pointer ${
                  orderType === 'takeaway'
                    ? 'bg-[#C5A059]/10 border-[#C5A059] text-[#1A1A1A] shadow-xs'
                    : 'bg-[#FDFCF8] border-[#E5E1D8] text-stone-600 hover:border-[#C5A059]'
                }`}
              >
                <Store className="w-6 h-6 mb-2 text-[#C5A059]" />
                <span className="font-bold text-xs sm:text-sm text-[#1A1A1A]">À emporter</span>
                <span className="text-[11px] text-stone-500 mt-1">Retrait au comptoir</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-[#C5A059]/10 border-[#C5A059] text-[#1A1A1A] shadow-xs'
                    : 'bg-[#FDFCF8] border-[#E5E1D8] text-stone-600 hover:border-[#C5A059]'
                }`}
              >
                <Truck className="w-6 h-6 mb-2 text-[#C5A059]" />
                <span className="font-bold text-xs sm:text-sm text-[#1A1A1A]">Livraison</span>
                <span className="text-[11px] text-stone-500 mt-1">
                  À domicile ({formatAriary(settings.delivery_fee)})
                </span>
              </button>
            </div>

            {/* If Dine-in: Table number field */}
            {orderType === 'dine_in' && (
              <div className="pt-2">
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Numéro de table
                </label>
                <div className="relative">
                  <QrCode className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={tableInput}
                    onChange={(e) => {
                      setTableInput(e.target.value);
                      setTableNumber(e.target.value);
                    }}
                    placeholder="Ex: 12"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059] font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-4 shadow-xs">
            <h3 className="font-serif-title font-bold text-[#1A1A1A] text-sm sm:text-base">
              2. Vos Coordonnées & Précisions
            </h3>

            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Jean Rakoto"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Téléphone (Mvola, Airtel, Orange) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+261 34 00 000 00"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059] font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Adresse Email (pour confirmation & suivi)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean@exemple.mg"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery address if Delivery */}
            {orderType === 'delivery' && (
              <div className="space-y-4 pt-2 border-t border-[#E5E1D8]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Adresse de livraison complète *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Ex: Lot IVB 24, Isoraka, près de la pharmacie"
                        required={orderType === 'delivery'}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Ville / Quartier
                    </label>
                    <input
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      placeholder="Antananarivo"
                      className="w-full px-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional notes */}
            <div className="pt-2">
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Instructions pour la cuisine ou le livreur (Optionnel)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Sonnette en panne, sauce piquante supplémentaire..."
                  rows={2}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#E5E1D8]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-lg bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Enregistrement de la commande...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirmer et Commander ({formatAriary(total)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-5 sticky top-24 shadow-xs">
            <h3 className="font-serif-title font-bold text-[#1A1A1A] text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              Récapitulatif ({items.length} {items.length > 1 ? 'articles' : 'article'})
            </h3>

            {/* Order Items List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between gap-3 text-xs border-b border-[#E5E1D8] pb-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-11 h-11 rounded-lg object-cover shrink-0 border border-[#E5E1D8]"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-[#1A1A1A] block truncate">
                        {item.quantity}x {item.product.name}
                      </span>
                      {item.special_instructions && (
                        <span className="text-[10px] text-stone-500 italic block truncate">
                          {item.special_instructions}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#1A1A1A] shrink-0">
                    {formatAriary(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs pt-2 border-t border-[#E5E1D8] text-stone-600">
              <div className="flex justify-between">
                <span>Sous-total plats :</span>
                <span className="font-mono text-[#1A1A1A] font-semibold">{formatAriary(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de service / Livraison :</span>
                <span className="font-mono text-[#1A1A1A] font-semibold">
                  {deliveryFee > 0 ? formatAriary(deliveryFee) : 'Gratuit (0 Ar)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-[#1A1A1A] pt-3 border-t border-[#E5E1D8]">
                <span className="font-serif-title text-base">Total TTC à régler :</span>
                <span className="text-xl font-bold text-[#C5A059] font-mono">
                  {formatAriary(total)}
                </span>
              </div>
            </div>

            {/* Payment Info Note */}
            <div className="p-3.5 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[11px] text-stone-500 space-y-1">
              <p className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                Paiement à la réception ou à table
              </p>
              <p>
                Règlement en Espèces (Ariary), Mobile Money (Mvola, Airtel Money, Orange Money) ou Carte Bancaire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
