import React from 'react';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Truck,
  Phone,
  ArrowLeft,
  Calendar,
  MapPin,
  Utensils,
  Receipt,
  AlertCircle,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatAriary, formatDateTime } from '../../lib/utils';
import { OrderStatusBadge } from '../ui/Badge';
import { OrderStatus } from '../../types/restaurant';

interface OrderDetailViewProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  orderId,
  onNavigate,
}) => {
  const { getOrderById, settings } = useRestaurant();
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-white border border-[#E5E1D8] flex items-center justify-center text-stone-400 mx-auto shadow-xs">
          <Receipt className="w-8 h-8" />
        </div>
        <h2 className="font-serif-title text-2xl font-bold text-[#1A1A1A]">
          Commande introuvable
        </h2>
        <p className="text-stone-500 text-xs">
          Le numéro de commande #{orderId} n'existe pas ou a été archivé.
        </p>
        <button
          onClick={() => onNavigate('/menu')}
          className="px-5 py-2.5 rounded-lg bg-[#C5A059] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B38E47] transition-colors cursor-pointer"
        >
          Retourner au menu
        </button>
      </div>
    );
  }

  // Steps for visual tracking
  const steps: { key: OrderStatus; label: string; icon: any; desc: string }[] = [
    {
      key: 'pending',
      label: 'Reçue',
      icon: Clock,
      desc: 'Transmise en cuisine',
    },
    {
      key: 'confirmed',
      label: 'Confirmée',
      icon: CheckCircle2,
      desc: 'Validée par le Chef',
    },
    {
      key: 'preparing',
      label: 'En préparation',
      icon: ChefHat,
      desc: 'Mijotée avec passion',
    },
    {
      key: 'ready',
      label: order.order_type === 'delivery' ? 'En livraison' : 'Prête',
      icon: order.order_type === 'delivery' ? Truck : PackageCheck,
      desc: order.order_type === 'delivery' ? 'En route vers chez vous' : 'Prête à être servie',
    },
    {
      key: 'completed',
      label: 'Terminée',
      icon: Sparkles,
      desc: 'Bonne dégustation !',
    },
  ];

  const statusOrder: OrderStatus[] = [
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'completed',
  ];

  const currentStepIndex = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/orders')}
          className="inline-flex items-center gap-2 text-stone-500 hover:text-[#C5A059] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Historique des commandes</span>
        </button>

        <span className="text-xs text-stone-500 font-medium">
          Mise à jour en temps réel
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="p-6 sm:p-8 bg-white border border-[#E5E1D8] rounded-xl space-y-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E1D8] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
                Commande
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mt-1">
              #{order.order_number}
            </h1>
            <p className="text-xs text-stone-500 flex items-center gap-2 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDateTime(order.created_at)}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Total de la commande
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#C5A059] font-mono">
              {formatAriary(order.total)}
            </span>
          </div>
        </div>

        {/* Real-Time Stepper Progress Tracker */}
        {!isCancelled ? (
          <div className="py-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 font-serif-title mb-5">
              Progression en temps réel
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={step.key}
                    className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-[#C5A059]/10 border-[#C5A059] text-[#1A1A1A] shadow-xs'
                        : isPassed
                        ? 'bg-[#FDFCF8] border-[#E5E1D8] text-stone-700'
                        : 'bg-[#FDFCF8]/50 border-[#E5E1D8] text-stone-400 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 font-bold ${
                        isCurrent
                          ? 'bg-[#C5A059] text-white shadow-xs'
                          : isPassed
                          ? 'bg-[#F5F2ED] text-[#C5A059] border border-[#E5E1D8]'
                          : 'bg-[#F5F2ED] text-stone-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-[#1A1A1A]">{step.label}</span>
                    <span className="text-[10px] text-stone-500 mt-0.5">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <div>
              <p className="font-bold">Cette commande a été annulée.</p>
              <p className="text-xs text-rose-600">
                N'hésitez pas à nous contacter si vous avez la moindre question.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Ordered Items (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-4 shadow-xs">
            <h3 className="font-serif-title font-bold text-[#1A1A1A] text-base flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#C5A059]" />
              Plats Commandés ({order.items.length})
            </h3>

            <div className="space-y-3 divide-y divide-[#E5E1D8]">
              {order.items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#E5E1D8]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] flex items-center justify-center text-[#C5A059] font-bold">
                        {item.quantity}x
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-bold text-[#1A1A1A] block truncate">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="text-xs text-stone-500 font-mono">
                        {formatAriary(item.unit_price)} unitaire
                      </span>
                      {item.notes && (
                        <span className="text-[11px] text-[#C5A059] italic block truncate font-medium">
                          Note : {item.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-mono font-bold text-[#1A1A1A] shrink-0">
                    {formatAriary(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs pt-4 border-t border-[#E5E1D8] text-stone-600">
              <div className="flex justify-between">
                <span>Sous-total plats :</span>
                <span className="font-mono text-[#1A1A1A] font-semibold">{formatAriary(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison :</span>
                <span className="font-mono text-[#1A1A1A] font-semibold">
                  {order.delivery_fee > 0 ? formatAriary(order.delivery_fee) : 'Gratuit (0 Ar)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-[#1A1A1A] pt-3 border-t border-[#E5E1D8]">
                <span className="font-serif-title text-base">Total Réglé / À Régler :</span>
                <span className="text-xl font-bold text-[#C5A059] font-mono">
                  {formatAriary(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Delivery Infos (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-4 text-xs shadow-xs">
            <h3 className="font-serif-title font-bold text-[#1A1A1A] text-base">
              Informations & Livraison
            </h3>

            <div className="space-y-3 text-stone-600">
              <div>
                <span className="block text-stone-500 uppercase tracking-wider font-bold text-[10px]">
                  Client
                </span>
                <span className="font-bold text-[#1A1A1A] text-sm">{order.customer_name}</span>
              </div>

              <div>
                <span className="block text-stone-500 uppercase tracking-wider font-bold text-[10px]">
                  Téléphone
                </span>
                <a
                  href={`tel:${order.phone}`}
                  className="font-mono text-[#C5A059] hover:underline inline-flex items-center gap-1.5 font-bold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {order.phone}
                </a>
              </div>

              <div>
                <span className="block text-stone-500 uppercase tracking-wider font-bold text-[10px]">
                  Type de service
                </span>
                <span className="capitalize font-bold text-[#1A1A1A]">
                  {order.order_type === 'dine_in'
                    ? `Sur place (Table #${order.table_number || 'N/A'})`
                    : order.order_type === 'takeaway'
                    ? 'À emporter (Retrait au restaurant)'
                    : 'Livraison à domicile'}
                </span>
              </div>

              {order.order_type === 'delivery' && (
                <div>
                  <span className="block text-stone-500 uppercase tracking-wider font-bold text-[10px]">
                    Adresse de livraison
                  </span>
                  <p className="text-stone-700 mt-0.5 flex items-start gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                    <span>
                      {order.delivery_address}, {order.delivery_city}
                    </span>
                  </p>
                </div>
              )}

              {order.notes && (
                <div>
                  <span className="block text-stone-500 uppercase tracking-wider font-bold text-[10px]">
                    Instructions particulières
                  </span>
                  <p className="text-stone-700 italic bg-[#FDFCF8] p-2.5 rounded-lg border border-[#E5E1D8] mt-1">
                    "{order.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Support Call */}
            <div className="pt-3 border-t border-[#E5E1D8]">
              <a
                href={`tel:${settings.phone}`}
                className="w-full py-2.5 px-4 rounded-lg bg-[#F5F2ED] hover:bg-stone-200 border border-[#E5E1D8] text-[#1A1A1A] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Une question ? Appeler le restaurant</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
