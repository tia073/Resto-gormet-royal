import React, { useState } from 'react';
import {
  ShoppingBag,
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  Filter,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { formatAriary, formatDateTime } from '../../lib/utils';
import { OrderStatusBadge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { OrderStatus } from '../../types/restaurant';

interface OrderHistoryViewProps {
  onSelectOrder: (orderId: string) => void;
  onNavigate: (path: string) => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  onSelectOrder,
  onNavigate,
}) => {
  const { orders } = useRestaurant();
  const { user, profile } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter orders for current user if logged in, or show all in demo
  const userOrders = orders.filter((o) => {
    if (user || profile) {
      const currentId = user?.id || profile?.id;
      return o.user_id === currentId || !o.user_id;
    }
    return true;
  });

  const filteredOrders = userOrders.filter((o) => {
    if (filterStatus !== 'all') {
      return o.status === filterStatus;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E1D8] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
            Mes Commandes
          </span>
          <h1 className="font-serif-title text-2xl sm:text-4xl font-extrabold text-[#1A1A1A] mt-1">
            Historique & Suivi
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Retrouvez l'état de préparation et l'historique complet de vos commandes gourmandes.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer shadow-xs"
          >
            <option value="all">Tous les statuts ({userOrders.length})</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="preparing">En préparation</option>
            <option value="ready">Prêtes / En livraison</option>
            <option value="completed">Terminées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="Aucune commande trouvée"
          description="Vous n'avez pas encore passé de commande ou aucune ne correspond au filtre sélectionné."
          actionLabel="Découvrir notre menu"
          onAction={() => onNavigate('/menu')}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order.id)}
              className="p-5 sm:p-6 bg-white hover:bg-[#FDFCF8] border border-[#E5E1D8] hover:border-[#C5A059] rounded-xl transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-xs"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-base sm:text-lg text-[#1A1A1A] font-mono group-hover:text-[#C5A059] transition-colors">
                    #{order.order_number}
                  </span>
                  <OrderStatusBadge status={order.status} />
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F5F2ED] text-stone-600 border border-[#E5E1D8] font-medium">
                    {order.order_type === 'dine_in'
                      ? `Sur place (Table #${order.table_number || '1'})`
                      : order.order_type === 'takeaway'
                      ? 'À emporter'
                      : 'Livraison'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {formatDateTime(order.created_at)}
                  </span>
                  <span>•</span>
                  <span>
                    {order.items?.length || 0} {order.items?.length > 1 ? 'articles' : 'article'}
                  </span>
                  <span>•</span>
                  <span className="text-stone-700 font-medium">Client : {order.customer_name}</span>
                </div>
              </div>

              {/* Total & Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#E5E1D8]">
                <div className="text-left md:text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                    Montant
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-[#C5A059] font-mono">
                    {formatAriary(order.total)}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOrder(order.id);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-[#F5F2ED] group-hover:bg-[#C5A059] group-hover:text-white border border-[#E5E1D8] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Détails</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
