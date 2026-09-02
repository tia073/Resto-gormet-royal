/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SupabaseConfigModal } from './components/ui/SupabaseConfigModal';
import { HomePage } from './components/home/HomePage';
import { MenuBrowser } from './components/menu/MenuBrowser';
import { ReservationView } from './components/reservation/ReservationView';
import { UserReservationsView } from './components/reservation/UserReservationsView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderDetailView } from './components/orders/OrderDetailView';
import { OrderHistoryView } from './components/orders/OrderHistoryView';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { ProfileView } from './components/auth/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [orderDetailId, setOrderDetailId] = useState<string | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  const { isCartOpen, setIsCartOpen, setTableNumber } = useCart();
  const { isSupabaseConfigured } = useRestaurant();

  // Read URL query parameters on initial load (e.g. ?table=5 or ?order=id)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    if (table) {
      setTableNumber(table);
    }

    const orderParam = params.get('order');
    if (orderParam) {
      setOrderDetailId(orderParam);
      setCurrentPath('/order-detail');
    }

    // Handle back / forward browser navigation
    const handlePopState = () => {
      const pathname = window.location.pathname || '/';
      setCurrentPath(pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setTableNumber]);

  // Handle navigation
  const handleNavigate = (path: string) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (path.startsWith('/orders/')) {
      const id = path.replace('/orders/', '');
      setOrderDetailId(id);
      setCurrentPath('/order-detail');
      return;
    }

    setOrderDetailId(null);
    setCurrentPath(path);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C5A059] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Page Views */}
      <main className="flex-1">
        {currentPath === '/' && <HomePage onNavigate={handleNavigate} />}

        {currentPath === '/menu' && <MenuBrowser onNavigate={handleNavigate} />}

        {currentPath === '/reservation' && (
          <ReservationView onNavigate={handleNavigate} />
        )}

        {currentPath === '/reservations' && (
          <UserReservationsView onNavigate={handleNavigate} />
        )}

        {currentPath === '/checkout' && (
          <CheckoutView onNavigate={handleNavigate} />
        )}

        {currentPath === '/order-detail' && orderDetailId && (
          <OrderDetailView
            orderId={orderDetailId}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/orders' && (
          <OrderHistoryView onNavigate={handleNavigate} />
        )}

        {currentPath === '/about' && <AboutPage onNavigate={handleNavigate} />}

        {currentPath === '/contact' && (
          <ContactPage onNavigate={handleNavigate} />
        )}

        {currentPath === '/login' && <LoginView onNavigate={handleNavigate} />}

        {currentPath === '/register' && (
          <RegisterView onNavigate={handleNavigate} />
        )}

        {currentPath === '/profile' && (
          <ProfileView onNavigate={handleNavigate} />
        )}

        {currentPath === '/admin' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Supabase Schema & Live Connection Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RestaurantProvider>
          <AppContent />
        </RestaurantProvider>
      </CartProvider>
    </AuthProvider>
  );
}
