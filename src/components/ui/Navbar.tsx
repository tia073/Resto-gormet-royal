import React, { useState } from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  User,
  Menu as MenuIcon,
  X,
  Shield,
  CalendarCheck,
  LogOut,
  Database,
  QrCode,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { SupabaseConfigModal } from './SupabaseConfigModal';
import { formatAriary } from '../../lib/utils';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSupabaseConfig?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSupabaseConfig }) => {
  const { user, profile, role, isAdmin, signOut, isConfigured } = useAuth();
  const { itemCount, subtotal, setIsCartOpen, tableNumber, setTableNumber } = useCart();
  const { settings } = useRestaurant();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Réservation', path: '/reservation' },
    { name: 'À propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleOpenConfig = () => {
    if (onOpenSupabaseConfig) {
      onOpenSupabaseConfig();
    } else {
      setIsConfigModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E1D8] transition-all">
        {/* Table Banner if table QR code was scanned */}
        {tableNumber && (
          <div className="bg-[#F5F2ED] border-b border-[#E5E1D8] px-4 py-1.5 text-xs text-[#1A1A1A] flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
              <QrCode className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Commande sur place — <strong className="text-[#C5A059]">Table N° {tableNumber}</strong></span>
              <button
                onClick={() => setTableNumber(null)}
                className="ml-auto text-[#C5A059] hover:text-[#B38E47] underline text-xs font-semibold"
              >
                Changer de table
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => handleLinkClick('/')}
              className="flex items-center gap-3 group text-left"
            >
              <div className="w-10 h-10 bg-[#1A1A1A] flex items-center justify-center rounded-sm text-[#C5A059] font-serif text-2xl font-bold group-hover:scale-105 transition-transform shadow-sm">
                E
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-widest uppercase text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                  {settings.name || "L'Essence"}
                </span>
                <span className="text-[10px] text-[#C5A059] uppercase tracking-tighter font-semibold">
                  Gastronomie Moderne
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-semibold uppercase tracking-widest">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`transition-all py-1 cursor-pointer ${
                      isActive
                        ? 'border-b-2 border-[#C5A059] text-[#1A1A1A] font-bold'
                        : 'text-gray-400 hover:text-[#1A1A1A]'
                    }`}
                  >
                    {link.name}
                  </button>
                );
              })}
              {isAdmin && (
                <button
                  onClick={() => handleLinkClick('/admin')}
                  className={`transition-all py-1 cursor-pointer ${
                    currentPath === '/admin'
                      ? 'border-b-2 border-[#C5A059] text-[#C5A059] font-bold'
                      : 'text-gray-400 hover:text-[#C5A059]'
                  }`}
                >
                  Admin
                </button>
              )}
            </nav>

            {/* Actions: Cart, Auth, Supabase Status & Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* Supabase Status / Config Button */}
              <button
                onClick={handleOpenConfig}
                title="Configuration Supabase & SQL"
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isConfigured
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-[#F5F2ED] text-stone-600 border-[#E5E1D8] hover:border-[#C5A059] hover:text-[#1A1A1A]'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[11px] font-semibold">{isConfigured ? 'Supabase' : 'Setup DB'}</span>
              </button>

              {/* Cart Pill Button matching Design */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-3 py-1.5 border border-[#E5E1D8] hover:border-[#C5A059] bg-white rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-sm text-[#1A1A1A]"
                aria-label="Voir le panier"
              >
                <ShoppingBag className="w-4 h-4 text-[#1A1A1A]" />
                <span className="text-xs font-medium font-mono hidden sm:inline">
                  {itemCount > 0 ? formatAriary(subtotal) : '0 Ar'}
                </span>
                <div className="w-5 h-5 bg-[#C5A059] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  {itemCount}
                </div>
              </button>

              {/* Profile / Auth Menu */}
              {user || profile ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-[#C5A059] bg-white hover:bg-[#F5F2ED] transition-all text-left"
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
                        {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="hidden lg:block pr-2">
                      <span className="block text-xs font-semibold text-[#1A1A1A] truncate max-w-[90px]">
                        {profile?.full_name?.split(' ')[0] || 'Compte'}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-500 mr-1 hidden sm:block" />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E1D8] rounded-xl shadow-xl py-2 z-50 animate-fade-in text-[#1A1A1A] text-sm">
                      <div className="px-4 py-2 border-b border-[#E5E1D8] bg-[#FDFCF8]">
                        <p className="font-semibold text-[#1A1A1A] truncate">{profile?.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => handleLinkClick('/admin')}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#F5F2ED] text-[#C5A059] flex items-center gap-2.5 transition-colors font-semibold"
                        >
                          <Shield className="w-4 h-4 text-[#C5A059]" />
                          Espace Administrateur
                        </button>
                      )}

                      <button
                        onClick={() => handleLinkClick('/profile')}
                        className="w-full text-left px-4 py-2 hover:bg-[#F5F2ED] text-stone-700 hover:text-[#1A1A1A] flex items-center gap-2.5 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        Mon Profil
                      </button>

                      <button
                        onClick={() => handleLinkClick('/orders')}
                        className="w-full text-left px-4 py-2 hover:bg-[#F5F2ED] text-stone-700 hover:text-[#1A1A1A] flex items-center gap-2.5 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        Mes Commandes
                      </button>

                      <button
                        onClick={() => handleLinkClick('/reservations')}
                        className="w-full text-left px-4 py-2 hover:bg-[#F5F2ED] text-stone-700 hover:text-[#1A1A1A] flex items-center gap-2.5 transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 text-gray-400" />
                        Mes Réservations
                      </button>

                      <div className="border-t border-[#E5E1D8] my-1"></div>

                      <button
                        onClick={async () => {
                          await signOut();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 transition-colors text-xs font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
                >
                  <User className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Connexion</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-white border border-[#E5E1D8] text-[#1A1A1A] hover:bg-[#F5F2ED]"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E1D8] bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-lg">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
                  currentPath === link.path
                    ? 'bg-[#F5F2ED] text-[#C5A059] border-l-4 border-[#C5A059]'
                    : 'text-stone-700 hover:bg-[#F5F2ED]'
                }`}
              >
                {link.name}
              </button>
            ))}

            <button
              onClick={() => {
                handleOpenConfig();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-[#C5A059] bg-[#FDFCF8] border border-[#E5E1D8] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4" /> Config Supabase & SQL
              </span>
              <span className="text-[10px] text-gray-500">
                {isConfigured ? 'Connecté' : 'Setup'}
              </span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleLinkClick('/admin')}
                className="w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#1A1A1A] flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#C5A059]" />
                Accéder au Dashboard Admin
              </button>
            )}
          </div>
        )}
      </header>

      {/* Supabase Configuration Modal */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </>
  );
};

