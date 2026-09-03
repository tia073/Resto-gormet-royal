import React, { useEffect, useState } from 'react';
import {
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  Shield,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { consumeOAuthError } from '../../lib/oauth';

interface LoginViewProps {
  onNavigate: (path: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { signInWithEmail, signInWithGoogle, switchDemoRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const oauthError = consumeOAuthError();
    if (oauthError) setErrorMessage(oauthError);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const res = await signInWithEmail(email.trim(), password);
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
      return;
    }

    onNavigate('/');
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res.error) {
        setErrorMessage(res.error);
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la connexion avec Google.');
      setIsGoogleLoading(false);
    }
  };

  const handleQuickDemo = (role: 'customer' | 'admin') => {
    switchDemoRole(role);
    if (role === 'admin') {
      onNavigate('/admin');
    } else {
      onNavigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white border border-[#E5E1D8] rounded-xl shadow-xs">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
            Espace Membre
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
            Connexion au Restaurant
          </h2>
          <p className="text-xs text-stone-500">
            Accédez à vos commandes, réservations et avantages royaux.
          </p>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@domaine.mg"
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Mot de Passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#C5A059] font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3 px-4 rounded-lg bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>Vérification...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Se Connecter</span>
              </>
            )}
          </button>
        </form>

        {/* Google OAuth Button */}
        <div className="space-y-3 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E5E1D8] w-full" />
            <span className="bg-white px-3 text-[11px] text-stone-500 uppercase tracking-wider font-bold">
              Ou via Supabase Auth
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#FDFCF8] hover:bg-[#F5F2ED] border border-[#E5E1D8] text-[#1A1A1A] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Redirection vers Google...' : 'Continuer avec Google'}</span>
          </button>
        </div>

        {/* Demo Fast Login Switcher */}
        <div className="p-4 rounded-xl bg-[#FDFCF8] border border-[#E5E1D8] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Accès Démo Rapide (1-Clic)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-2 px-3 rounded-lg bg-white hover:bg-[#F5F2ED] text-[#1A1A1A] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#E5E1D8] cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>Compte Client</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-3 rounded-lg bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#C5A059]/30 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Compte Admin</span>
            </button>
          </div>
        </div>

        {/* Footer switch */}
        <p className="text-center text-xs text-stone-500">
          Pas encore de compte ?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-[#C5A059] hover:underline font-bold cursor-pointer"
          >
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  );
};
