import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Instagram,
  Facebook,
  MessageSquare,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { settings } = useRestaurant();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
          Contact & Accès
        </span>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-extrabold text-[#1A1A1A]">
          Nous Contacter & Nous Rendre Visite
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
          Pour toute demande d'information, privatisation, événement sur mesure ou commande spéciale, notre équipe est à votre disposition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 bg-white border border-[#E5E1D8] rounded-xl space-y-6 text-xs text-stone-600 shadow-xs">
            <h3 className="font-serif-title font-bold text-[#1A1A1A] text-xl">
              Coordonnées de l'Établissement
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#1A1A1A] block text-sm">Adresse</span>
                  <p className="text-stone-500 mt-0.5">
                    {settings.address}, {settings.city}
                  </p>
                  <p className="text-[11px] text-[#C5A059] font-medium mt-1">
                    ★ Parking privé et service voiturier à disposition.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#1A1A1A] block text-sm">Téléphone & WhatsApp</span>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-stone-600 hover:text-[#C5A059] font-mono block mt-0.5"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#1A1A1A] block text-sm">Email</span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-stone-600 hover:text-[#C5A059] block mt-0.5"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#1A1A1A] block text-sm">Horaires de Service</span>
                  <p className="text-stone-500 mt-0.5">
                    Semaine : {settings.opening_hours.monday_friday}
                  </p>
                  <p className="text-stone-500">
                    Week-end : {settings.opening_hours.saturday_sunday}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 bg-white border border-[#E5E1D8] rounded-xl space-y-4 shadow-xs"
          >
            <h3 className="font-serif-title font-bold text-[#1A1A1A] text-xl border-b border-[#E5E1D8] pb-3">
              Envoyez-nous un Message
            </h3>

            {sent && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Merci pour votre message ! Notre maître d'hôtel vous répondra sous peu.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Votre Nom *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Votre Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean@exemple.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Objet du Message *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Privatisation, Demande particulière, Événement..."
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Votre Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Détaillez votre demande ici..."
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le Message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
