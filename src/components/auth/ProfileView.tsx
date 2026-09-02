import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Shield,
  Save,
  LogOut,
  ShoppingBag,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadAvatarImage } from '../../lib/storage-helpers';

interface ProfileViewProps {
  onNavigate: (path: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { user, profile, role, updateProfile, signOut } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      avatar_url: avatarUrl,
    });
    setIsSaving(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadedUrl = await uploadAvatarImage(file, user?.id || 'demo');
    setUploadingImage(false);

    if (uploadedUrl) {
      setAvatarUrl(uploadedUrl);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E1D8] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
            Mon Espace
          </span>
          <h1 className="font-serif-title text-2xl sm:text-4xl font-extrabold text-[#1A1A1A] mt-1">
            Profil Utilisateur
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Gérez vos coordonnées pour simplifier vos futures commandes et réservations.
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => onNavigate('/admin')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] font-bold text-xs uppercase tracking-wider transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Shield className="w-4 h-4 text-[#C5A059]" />
            <span>Dashboard Admin</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Avatar & Quick summary (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl text-center space-y-4 shadow-xs">
            <div className="relative w-28 h-28 mx-auto">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full rounded-xl object-cover border-2 border-[#C5A059]/40 shadow-xs"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-[#F5F2ED] border border-[#E5E1D8] text-[#C5A059] flex items-center justify-center text-3xl font-bold font-serif-title">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}

              {/* Upload button */}
              <label className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-[#C5A059] text-white hover:bg-[#B38E47] cursor-pointer shadow-xs transition-transform active:scale-90">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {uploadingImage && (
              <p className="text-[11px] text-[#C5A059] animate-pulse">
                Téléversement de l'avatar...
              </p>
            )}

            <div>
              <h3 className="font-serif-title font-bold text-[#1A1A1A] text-lg">
                {fullName || 'Client Anonyme'}
              </h3>
              <p className="text-xs text-stone-500">{profile?.email || user?.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 uppercase font-bold">
                  <Shield className="w-3 h-3" />
                  Rôle : {role}
                </span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="pt-3 border-t border-[#E5E1D8] space-y-2">
              <button
                onClick={() => onNavigate('/orders')}
                className="w-full py-2.5 px-3 rounded-lg bg-[#FDFCF8] hover:bg-[#F5F2ED] text-[#1A1A1A] text-xs font-bold flex items-center justify-between transition-colors border border-[#E5E1D8] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  Mes Commandes
                </span>
                <span>→</span>
              </button>

              <button
                onClick={() => onNavigate('/reservations')}
                className="w-full py-2.5 px-3 rounded-lg bg-[#FDFCF8] hover:bg-[#F5F2ED] text-[#1A1A1A] text-xs font-bold flex items-center justify-between transition-colors border border-[#E5E1D8] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#C5A059]" />
                  Mes Réservations
                </span>
                <span>→</span>
              </button>

              <button
                onClick={async () => {
                  await signOut();
                  onNavigate('/');
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-rose-200 pt-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Form (8 cols) */}
        <div className="md:col-span-8">
          <form
            onSubmit={handleSave}
            className="p-6 sm:p-8 bg-white border border-[#E5E1D8] rounded-xl space-y-5 shadow-xs"
          >
            <h3 className="font-serif-title font-bold text-[#1A1A1A] text-lg border-b border-[#E5E1D8] pb-3">
              Informations Personnelles
            </h3>

            {successMsg && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Votre profil a été mis à jour avec succès.</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nom Complet
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Adresse Email (Lecture seule)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="email"
                    value={profile?.email || user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F5F2ED] border border-[#E5E1D8] text-stone-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Numéro de Téléphone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+261 34 00 000 00"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Adresse par Défaut pour la Livraison
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Lot IVB 24, Isoraka, Antananarivo"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E1D8]">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 disabled:opacity-60 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les Modifications'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
