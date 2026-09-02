import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Shield,
  Database,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenSupabaseConfig?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSupabaseConfig }) => {
  const { settings } = useRestaurant();
  const { isAdmin, isConfigured } = useAuth();

  return (
    <footer className="bg-[#1A1A1A] border-t border-[#2A2A2A] text-stone-300 text-sm">
      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Presentation */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A1A1A] border border-[#C5A059] flex items-center justify-center rounded-sm text-[#C5A059] font-serif text-2xl font-bold">
                E
              </div>
              <div className="flex flex-col">
                <span className="font-serif-title text-base font-bold text-white tracking-widest uppercase">
                  {settings.name || "L'Essence"}
                </span>
                <span className="text-[10px] text-[#C5A059] uppercase tracking-tighter font-semibold">
                  Gastronomie Moderne
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-normal">
              {settings.description ||
                "Une cuisine gastronomique d'exception mariant fraîcheur locale et savoir-faire culinaire moderne."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-md bg-[#252525] border border-[#333333] flex items-center justify-center text-stone-300 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-md bg-[#252525] border border-[#333333] flex items-center justify-center text-stone-300 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs font-serif-title text-[#C5A059]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#C5A059] transition-colors text-stone-400"
                >
                  Dashboard & Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/menu')}
                  className="hover:text-[#C5A059] transition-colors text-stone-400"
                >
                  Notre Carte & Menus
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/reservation')}
                  className="hover:text-[#C5A059] transition-colors text-stone-400"
                >
                  Réservation de Table
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[#C5A059] transition-colors text-stone-400"
                >
                  Histoire & Le Chef
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#C5A059] transition-colors text-stone-400"
                >
                  Contact & Plan d'accès
                </button>
              </li>
            </ul>
          </div>

          {/* Horaires d'ouverture */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs font-serif-title text-[#C5A059] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Horaires
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="block text-stone-200 font-semibold">Lundi — Vendredi :</span>
                <span className="text-stone-400">{settings.opening_hours?.monday_friday || '11h30 - 15h00 | 18h30 - 23h00'}</span>
              </div>
              <div>
                <span className="block text-stone-200 font-semibold">Samedi — Dimanche :</span>
                <span className="text-stone-400">{settings.opening_hours?.saturday_sunday || '11h00 - 23h30 (Non-stop)'}</span>
              </div>
              <p className="text-[11px] text-[#C5A059] pt-1">
                ★ Service voiturier & réservation recommandée.
              </p>
            </div>
          </div>

          {/* Adresse & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs font-serif-title text-[#C5A059]">
              Coordonnées
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  {settings.address || 'Boulevard de la Gastronomie'}, {settings.city || 'Antananarivo'}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-[#C5A059] transition-colors">
                  {settings.phone || '+261 34 00 000 00'}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#C5A059] transition-colors">
                  {settings.email || 'contact@gourmetroyal.mg'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar matching design theme */}
      <div className="border-t border-[#2A2A2A] px-4 sm:px-8 py-3.5 bg-[#141414] text-[10px] uppercase tracking-[0.2em] text-stone-400 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span>© {new Date().getFullYear()} {settings.name || "L'ESSENCE"} RESTAURANT — ANTANANARIVO</span>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-1.5 text-stone-400">
            <Database className="w-3 h-3 text-[#C5A059]" />
            Node: {isConfigured ? 'Supabase Active' : 'Local Demo'}
          </span>
          <span className="text-stone-400">RLS Policy: Secured</span>
          <button
            onClick={() => onNavigate('/admin')}
            className="text-[#C5A059] font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            {isAdmin ? 'Admin Mode (Active)' : 'Admin Portal'}
          </button>
        </div>
      </div>
    </footer>
  );
};

