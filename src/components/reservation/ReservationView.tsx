import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  CalendarCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { ReservationStatusBadge } from '../ui/Badge';

interface ReservationViewProps {
  onNavigate: (path: string) => void;
}

export const ReservationView: React.FC<ReservationViewProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const { settings, createReservation } = useRestaurant();

  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [customerName, setCustomerName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '+261 34 ');
  const [email, setEmail] = useState(profile?.email || '');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successReservation, setSuccessReservation] = useState<any | null>(null);

  // Available reservation time slots
  const timeSlots = [
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
  ];

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

    if (!date) {
      setErrorMessage('Veuillez sélectionner une date.');
      return;
    }

    setIsSubmitting(true);

    const res = await createReservation({
      userId: user?.id || profile?.id || null,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      reservationDate: date,
      reservationTime: time,
      guests,
      message: message.trim() || undefined,
    });

    setIsSubmitting(false);

    if (!res.success || !res.reservation) {
      setErrorMessage(res.error || 'Erreur lors de la réservation de la table.');
      return;
    }

    setSuccessReservation(res.reservation);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
          Expérience Gastronomique
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A]">
          Réserver Votre Table
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
          Pour un dîner romantique, un déjeuner d'affaires ou une célébration royale, laissez-nous préparer votre venue.
        </p>
      </div>

      {successReservation ? (
        /* Confirmation Card */
        <div className="max-w-xl mx-auto p-8 bg-white border border-[#C5A059] rounded-xl text-center space-y-6 shadow-md animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              Demande Reçue avec Succès
            </span>
            <h2 className="font-serif-title text-2xl font-bold text-[#1A1A1A] mt-1">
              Table Réservée au Nom de {successReservation.customer_name}
            </h2>
            <p className="text-xs text-stone-500 mt-2">
              Notre maître d'hôtel vous contactera par téléphone ({successReservation.phone}) pour confirmation finale.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-xs text-stone-700 grid grid-cols-2 gap-3 text-left">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Date</span>
              <span className="font-semibold text-[#1A1A1A]">{successReservation.reservation_date}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Heure</span>
              <span className="font-semibold text-[#1A1A1A]">{successReservation.reservation_time}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Convives</span>
              <span className="font-semibold text-[#1A1A1A]">{successReservation.guests} personnes</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Statut</span>
              <ReservationStatusBadge status={successReservation.status} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('/reservations')}
              className="flex-1 py-2.5 px-4 rounded-md bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Voir mes réservations
            </button>
            <button
              onClick={() => {
                setSuccessReservation(null);
                setMessage('');
              }}
              className="flex-1 py-2.5 px-4 rounded-md bg-[#F5F2ED] hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider border border-[#E5E1D8] transition-colors cursor-pointer"
            >
              Nouvelle réservation
            </button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Reservation Form (8 cols) */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-8 p-6 sm:p-8 bg-white border border-[#E5E1D8] rounded-xl space-y-6 shadow-xs"
          >
            <h3 className="font-serif-title font-bold text-[#1A1A1A] text-lg sm:text-xl border-b border-[#E5E1D8] pb-4">
              Formulaire de Réservation
            </h3>

            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Date */}
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Date de venue *
                </label>
                <div className="relative">
                  <CalendarIcon className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] font-mono"
                  />
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Heure souhaitée *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nombre de convives *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                      <option key={n} value={n}>
                        {n} {n > 1 ? 'personnes' : 'personne'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E1D8]">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nom du responsable *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Madame Rasoa"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Téléphone de contact *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+261 34 00 000 00"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] font-mono"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email (pour confirmation & rappel)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@exemple.mg"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Demandes particulières (Emplacement, Occasion, Allergies...)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex: Table près de la baie vitrée, anniversaire de mariage, chaise bébé..."
                    rows={3}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-md bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Envoi de la réservation...</span>
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4" />
                    <span>Confirmer la Réservation</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-4 text-xs shadow-xs">
              <h4 className="font-serif-title font-bold text-[#C5A059] text-base">
                Informations & Accueil
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Toute réservation est maintenue 20 minutes après l'heure convenue. Pour les groupes de plus de 15 personnes ou des événements privés, veuillez nous joindre directement par téléphone.
              </p>

              <div className="space-y-2 pt-3 border-t border-[#E5E1D8]">
                <div className="flex items-start gap-2 text-stone-700">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>{settings.address}, {settings.city}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <a href={`tel:${settings.phone}`} className="text-[#C5A059] font-mono font-bold hover:underline">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-stone-600 text-[11px] space-y-1">
                <span className="font-bold text-[#1A1A1A] block">Horaires de service :</span>
                <span>Déjeuner : 11h30 – 15h00</span>
                <br />
                <span>Dîner : 18h30 – 23h30</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
