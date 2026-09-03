import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import {
  formatOAuthError,
  getOAuthRedirectTo,
  parseOAuthCallbackUrl,
  SUPABASE_NOT_CONFIGURED_MESSAGE,
} from '../lib/oauth';
import { Profile, UserRole } from '../types/restaurant';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  role: UserRole;
  isAdmin: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error?: string; message?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  completeOAuthCallback: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
  forgotPassword: (email: string) => Promise<{ error?: string; message?: string }>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN_PROFILE: Profile = {
  id: 'demo-admin-uuid-0001',
  full_name: 'Chef Directeur (Admin)',
  email: 'admin@legourmetroyal.mg',
  phone: '+261 34 00 123 45',
  address: "14 Avenue de l'Indépendance, Analakely",
  avatar_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
  role: 'admin',
  created_at: new Date().toISOString()
};

const DEMO_CUSTOMER_PROFILE: Profile = {
  id: 'demo-cust-uuid-0002',
  full_name: 'Tiana Andriamasy',
  email: 'tiana.andriamasy@gmail.com',
  phone: '+261 34 88 777 66',
  address: 'Lot IVB 42 Manakambahiny, Antananarivo',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'customer',
  created_at: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load profile from Supabase
  const fetchProfile = async (userId: string, userEmail?: string, metadata?: any) => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data as Profile);
      } else if (error) {
        // If profile doesn't exist yet, construct fallback profile
        const newProf: Profile = {
          id: userId,
          full_name: metadata?.full_name || metadata?.name || userEmail?.split('@')[0] || 'Client',
          email: userEmail || '',
          phone: metadata?.phone || '',
          role: 'customer', // strictly customer
          created_at: new Date().toISOString(),
        };
        setProfile(newProf);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    const supabase = getSupabase();

    if (supabase) {
      // 1. Get current session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
        }
        setIsLoading(false);
      });

      // 2. Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (newSession?.user) {
            await fetchProfile(newSession.user.id, newSession.user.email, newSession.user.user_metadata);
          } else {
            setProfile(null);
          }
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local demo mode state initialization
      const savedDemo = localStorage.getItem('demo_profile');
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          setProfile(parsed);
          setUser({ id: parsed.id, email: parsed.email } as User);
        } catch {
          setProfile(DEMO_CUSTOMER_PROFILE);
          setUser({ id: DEMO_CUSTOMER_PROFILE.id, email: DEMO_CUSTOMER_PROFILE.email } as User);
        }
      } else {
        // Default to demo customer for immediate experience
        setProfile(DEMO_CUSTOMER_PROFILE);
        setUser({ id: DEMO_CUSTOMER_PROFILE.id, email: DEMO_CUSTOMER_PROFILE.email } as User);
      }
      setIsLoading(false);
    }
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    const supabase = getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }
        if (data.user) {
          await fetchProfile(data.user.id, data.user.email, data.user.user_metadata);
        }
        setIsLoading(false);
        return {};
      } catch (err: any) {
        setIsLoading(false);
        return { error: err.message || 'Erreur lors de la connexion' };
      }
    } else {
      // Demo simulation
      const isAdminLogin = email.toLowerCase().includes('admin');
      const chosen = isAdminLogin ? DEMO_ADMIN_PROFILE : { ...DEMO_CUSTOMER_PROFILE, email };
      setProfile(chosen);
      setUser({ id: chosen.id, email: chosen.email } as User);
      localStorage.setItem('demo_profile', JSON.stringify(chosen));
      setIsLoading(false);
      return {};
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<{ error?: string; message?: string }> => {
    setIsLoading(true);
    const supabase = getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone || '',
              role: 'customer', // strictly customer
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          // If session exists (email auto-confirmed or disabled confirm)
          if (data.session) {
            await fetchProfile(data.user.id, data.user.email, { full_name: fullName, phone });
          }
          setIsLoading(false);
          return {
            message: data.session
              ? 'Compte créé avec succès !'
              : 'Compte créé ! Veuillez vérifier votre boîte mail pour confirmer votre inscription.',
          };
        }
        setIsLoading(false);
        return {};
      } catch (err: any) {
        setIsLoading(false);
        return { error: err.message || "Erreur lors de l'inscription" };
      }
    } else {
      // Demo simulation
      const newProf: Profile = {
        id: `demo-cust-${Date.now()}`,
        full_name: fullName,
        email,
        phone: phone || '',
        role: 'customer',
        created_at: new Date().toISOString(),
      };
      setProfile(newProf);
      setUser({ id: newProf.id, email: newProf.email } as User);
      localStorage.setItem('demo_profile', JSON.stringify(newProf));
      setIsLoading(false);
      return { message: 'Compte client créé avec succès !' };
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: SUPABASE_NOT_CONFIGURED_MESSAGE };
    }

    try {
      // skipBrowserRedirect + assign: Chrome Android often blocks the delayed default redirect.
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getOAuthRedirectTo(),
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) return { error: error.message };
      if (!data.url) {
        return { error: "Impossible d'obtenir l'URL de connexion Google (Supabase)." };
      }

      window.location.assign(data.url);
      return {};
    } catch (err: any) {
      return { error: err.message || 'Erreur OAuth Google' };
    }
  };

  const completeOAuthCallback = async (): Promise<{ error?: string }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: SUPABASE_NOT_CONFIGURED_MESSAGE };
    }

    const callback = parseOAuthCallbackUrl();
    const providerError = formatOAuthError(callback.error, callback.errorDescription);
    if (providerError) {
      return { error: providerError };
    }

    try {
      // detectSessionInUrl may already have exchanged the PKCE code during client init.
      const existing = await supabase.auth.getSession();
      if (existing.data.session) {
        return {};
      }

      if (callback.code) {
        const { error } = await supabase.auth.exchangeCodeForSession(callback.code);
        if (error) return { error: error.message };
        return {};
      }

      return {
        error:
          "La connexion Google n'a pas renvoyé de code. Vérifiez Redirect URLs : " +
          getOAuthRedirectTo(),
      };
    } catch (err: any) {
      return { error: err.message || "Erreur lors de l'échange du code OAuth" };
    }
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    localStorage.removeItem('demo_profile');
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error?: string }> => {
    if (!profile) return { error: 'Aucun utilisateur connecté' };

    const supabase = getSupabase();
    if (supabase && user) {
      try {
        // Prevent customer from escalating role to admin in profile updates
        const cleanUpdates = { ...updates };
        if (profile.role !== 'admin') {
          delete cleanUpdates.role;
        }

        const { error } = await supabase
          .from('profiles')
          .update(cleanUpdates)
          .eq('id', user.id);

        if (error) return { error: error.message };

        setProfile((prev) => (prev ? { ...prev, ...cleanUpdates } : null));
        return {};
      } catch (err: any) {
        return { error: err.message };
      }
    } else {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      localStorage.setItem('demo_profile', JSON.stringify(updated));
      return {};
    }
  };

  const forgotPassword = async (email: string): Promise<{ error?: string; message?: string }> => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return { error: error.message };
        return { message: 'Un e-mail de réinitialisation vous a été envoyé.' };
      } catch (err: any) {
        return { error: err.message };
      }
    }
    return { message: 'Lien de réinitialisation simulé envoyé à votre adresse e-mail.' };
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const newProf = targetRole === 'admin' ? DEMO_ADMIN_PROFILE : DEMO_CUSTOMER_PROFILE;
    setProfile(newProf);
    setUser({ id: newProf.id, email: newProf.email } as User);
    localStorage.setItem('demo_profile', JSON.stringify(newProf));
  };

  const currentRole: UserRole = profile?.role || 'customer';
  const isAdmin = currentRole === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        role: currentRole,
        isAdmin,
        isLoading,
        isConfigured: isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        completeOAuthCallback,
        signOut,
        updateProfile,
        forgotPassword,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
