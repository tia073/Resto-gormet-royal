import React from 'react';
import {
  CalendarCheck,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { ReservationStatusBadge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

interface UserReservationsViewProps {
  onNavigate: (path: string) => void;
}

export const UserReservationsView: React.FC<UserReservationsViewProps> = ({
  onNavigate,
}) => {
  const { reservations } = useRestaurant();
  const { user, profile } = useAuth();

  const userReservations = reservations.filter((r) => {
    if (user || profile) {
      const currentId = user?.id || profile?.id;
      return r.user_id === currentId || !r.user_id;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E1D8] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
            Mes Réservations
          </span>
          <h1 className="font-serif-title text-2xl sm:text-4xl font-extrabold text-[#1A1A1A] mt-1">
            Tables Réservées
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Consultez le statut et les détails de vos prochaines visites au restaurant.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/reservation')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle réservation</span>
        </button>
      </div>

      {userReservations.length === 0 ? (
        <EmptyState
          title="Aucune réservation enregistrée"
          description="Vous n'avez pas encore effectué de réservation de table."
          actionLabel="Réserver une table maintenant"
          onAction={() => onNavigate('/reservation')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userReservations.map((res) => (
            <div
              key={res.id}
              className="p-5 bg-white border border-[#E5E1D8] rounded-xl space-y-4 hover:border-[#C5A059] transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif-title font-bold text-base text-[#1A1A1A]">
                  Réservation pour {res.customer_name}
                </span>
                <ReservationStatusBadge status={res.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-[#FDFCF8] p-3.5 rounded-lg border border-[#E5E1D8]">
                <div className="flex items-center gap-2 text-stone-700">
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>{res.reservation_date}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span>{res.reservation_time}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <Users className="w-4 h-4 text-[#C5A059]" />
                  <span>{res.guests} personnes</span>
                </div>
                {res.table_assigned && (
                  <div className="text-[#C5A059] font-bold">
                    Table #{res.table_assigned}
                  </div>
                )}
              </div>

              {res.message && (
                <div className="text-xs text-stone-500 flex items-start gap-2 bg-[#F5F2ED] p-2.5 rounded-lg border border-[#E5E1D8]">
                  <MessageSquare className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span className="italic line-clamp-2">"{res.message}"</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
