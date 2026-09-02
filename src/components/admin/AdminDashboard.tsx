import React, { useState } from 'react';
import {
  LayoutDashboard,
  Utensils,
  FolderTree,
  ShoppingBag,
  CalendarCheck,
  Star,
  Settings,
  QrCode,
  TrendingUp,
  DollarSign,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Upload,
  AlertTriangle,
  ArrowRight,
  Printer,
  Download,
  Flame,
  Sparkles,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { formatAriary, formatDateTime } from '../../lib/utils';
import { OrderStatusBadge, ReservationStatusBadge } from '../ui/Badge';
import { Product, OrderStatus, ReservationStatus, Category } from '../../types/restaurant';
import { uploadProductImage } from '../../lib/storage-helpers';
import { EmptyState } from '../ui/EmptyState';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { role, switchDemoRole } = useAuth();
  const {
    categories,
    products,
    orders,
    reservations,
    reviews,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    updateReservationStatus,
    toggleReviewVisibility,
    deleteReview,
    updateSettings,
    refreshData,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'categories'
    | 'orders'
    | 'reservations'
    | 'reviews'
    | 'settings'
    | 'qrcode'
  >('overview');

  // Product modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category_id: categories[0]?.id || '',
    price: 35000,
    image_url: '',
    available: true,
    popular: false,
    featured: false,
    prep_time_minutes: 20,
    calories: 450,
  });
  const [isUploadingProductImg, setIsUploadingProductImg] = useState(false);

  // Category modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    display_order: 1,
  });

  // Table QR Code generator state
  const [qrTableNum, setQrTableNum] = useState('1');

  // Overview Stats
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const pendingReservations = reservations.filter((r) => r.status === 'pending');
  const activeProducts = products.filter((p) => p.available);

  // ==================== PRODUCT HANDLERS ====================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      category_id: categories[0]?.id || '',
      price: 35000,
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      available: true,
      popular: false,
      featured: false,
      prep_time_minutes: 20,
      calories: 450,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      category_id: prod.category_id,
      price: prod.price,
      image_url: prod.image_url,
      available: prod.available,
      popular: prod.popular || false,
      featured: prod.featured || false,
      prep_time_minutes: prod.prep_time_minutes || 20,
      calories: prod.calories || 450,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.category_id) return;

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: productForm.name,
        description: productForm.description,
        category_id: productForm.category_id,
        price: Number(productForm.price),
        image_url: productForm.image_url,
        available: productForm.available,
        popular: productForm.popular,
        featured: productForm.featured,
        prep_time_minutes: Number(productForm.prep_time_minutes),
        calories: Number(productForm.calories),
      });
    } else {
      await addProduct({
        name: productForm.name,
        description: productForm.description,
        category_id: productForm.category_id,
        price: Number(productForm.price),
        image_url: productForm.image_url,
        available: productForm.available,
        popular: productForm.popular,
        featured: productForm.featured,
        prep_time_minutes: Number(productForm.prep_time_minutes),
        calories: Number(productForm.calories),
      });
    }

    setIsProductModalOpen(false);
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProductImg(true);
    const uploaded = await uploadProductImage(file);
    setIsUploadingProductImg(false);

    if (uploaded) {
      setProductForm((prev) => ({ ...prev, image_url: uploaded }));
    }
  };

  // ==================== CATEGORY HANDLERS ====================
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      display_order: categories.length + 1,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name: categoryForm.name,
        description: categoryForm.description,
        display_order: Number(categoryForm.display_order),
      });
    } else {
      await addCategory({
        name: categoryForm.name,
        slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryForm.description,
        display_order: Number(categoryForm.display_order),
        is_active: true,
      });
    }
    setIsCategoryModalOpen(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-[#E5E1D8] rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] border border-[#C5A059]/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
              Console d'Administration
            </span>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
              Tableau de Bord — {settings.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            title="Rafraîchir les données"
            className="p-2.5 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-stone-700 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="px-4 py-2.5 rounded-lg bg-[#F5F2ED] hover:bg-stone-200 border border-[#E5E1D8] text-stone-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Voir le site public
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
              : 'bg-white text-stone-700 border-[#E5E1D8] hover:border-[#C5A059]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Vue d'ensemble</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
              : 'bg-white text-stone-700 border-[#E5E1D8] hover:border-[#C5A059]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Commandes ({orders.length})</span>
          {pendingOrders.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'reservations'
              ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
              : 'bg-white text-stone-700 border-[#E5E1D8] hover:border-[#C5A059]'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Réservations ({reservations.length})</span>
          {pendingReservations.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#1A1A1A] text-[#C5A059] text-[9px] font-bold flex items-center justify-center">
              {pendingReservations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
              : 'bg-white text-stone-700 border-[#E5E1D8] hover:border-[#C5A059]'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Plats & Menu ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
              : 'bg-white text-stone-700 border-[#E5E1D8] hover:border-[#C5A059]'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Catégories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
              : 'bg-white text-stone-700 border-[#E5E1D8] hover:border-[#C5A059]'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Avis ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('qrcode')}
          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'qrcode'
              ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
              : 'bg-white text-stone-700 border-[#E5E1D8] hover:border-[#C5A059]'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Code Table</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
              : 'bg-white text-stone-700 border-[#E5E1D8] hover:border-[#C5A059]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Paramètres</span>
        </button>
      </div>

      {/* ==================== TAB 1: OVERVIEW ==================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white border border-[#E5E1D8] rounded-xl space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider">Chiffre d'Affaires</span>
                <DollarSign className="w-4 h-4 text-[#C5A059]" />
              </div>
              <p className="text-2xl font-bold text-[#C5A059] font-mono">
                {formatAriary(totalRevenue)}
              </p>
              <p className="text-[10px] text-stone-400">Commandes actives et réglées</p>
            </div>

            <div className="p-5 bg-white border border-[#E5E1D8] rounded-xl space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Commandes</span>
                <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A] font-mono">
                {orders.length}
              </p>
              <p className="text-[10px] text-[#C5A059] font-semibold">
                {pendingOrders.length} en attente de validation
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E5E1D8] rounded-xl space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider">Réservations</span>
                <CalendarCheck className="w-4 h-4 text-[#C5A059]" />
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A] font-mono">
                {reservations.length}
              </p>
              <p className="text-[10px] text-stone-500 font-semibold">
                {pendingReservations.length} en attente de placement
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E5E1D8] rounded-xl space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider">Plats au Menu</span>
                <Utensils className="w-4 h-4 text-[#C5A059]" />
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A] font-mono">
                {products.length}
              </p>
              <p className="text-[10px] text-stone-400">
                {activeProducts.length} actuellement en cuisine
              </p>
            </div>
          </div>

          {/* Recent Orders Grid */}
          <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-title font-bold text-[#1A1A1A] text-lg">
                Dernières Commandes
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-[#C5A059] hover:underline font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <span>Toutes les commandes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#F5F2ED] text-stone-700 uppercase tracking-wider font-bold border-b border-[#E5E1D8] text-[10px]">
                  <tr>
                    <th className="p-3">N° Commande</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Montant</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3 text-right">Actions rapides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1D8]">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FDFCF8]">
                      <td className="p-3 font-mono font-bold text-[#1A1A1A]">
                        #{ord.order_number}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#1A1A1A] block">{ord.customer_name}</span>
                        <span className="text-[10px] text-stone-400">{ord.phone}</span>
                      </td>
                      <td className="p-3">
                        {ord.order_type === 'dine_in'
                          ? `Table #${ord.table_number || '1'}`
                          : ord.order_type === 'takeaway'
                          ? 'À emporter'
                          : 'Livraison'}
                      </td>
                      <td className="p-3 font-mono font-bold text-[#C5A059]">
                        {formatAriary(ord.total)}
                      </td>
                      <td className="p-3">
                        <OrderStatusBadge status={ord.status} />
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {ord.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'confirmed')}
                            className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] uppercase border border-emerald-200 cursor-pointer"
                          >
                            Valider
                          </button>
                        )}
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'preparing')}
                            className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[10px] uppercase border border-purple-200 cursor-pointer"
                          >
                            En cuisine
                          </button>
                        )}
                        {ord.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'ready')}
                            className="px-2.5 py-1 rounded-md bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059]/20 font-bold text-[10px] uppercase border border-[#C5A059]/30 cursor-pointer"
                          >
                            Prête
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: ORDERS MANAGEMENT ==================== */}
      {activeTab === 'orders' && (
        <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-title font-bold text-[#1A1A1A] text-xl">
                Gestion des Commandes
              </h3>
              <p className="text-xs text-stone-500">
                Suivez et modifiez en direct l'avancement des commandes en cuisine.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 bg-[#FDFCF8] border border-[#E5E1D8] rounded-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E1D8] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-base text-[#1A1A1A]">
                      #{ord.order_number}
                    </span>
                    <OrderStatusBadge status={ord.status} />
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#F5F2ED] text-stone-600 border border-[#E5E1D8] font-medium">
                      {ord.order_type === 'dine_in'
                        ? `Table #${ord.table_number || '1'}`
                        : ord.order_type === 'takeaway'
                        ? 'À emporter'
                        : 'Livraison'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-base text-[#C5A059]">
                      {formatAriary(ord.total)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
                  <div>
                    <span className="text-stone-400 block font-bold text-[10px] uppercase tracking-wider">
                      Client & Contact
                    </span>
                    <span className="font-bold text-[#1A1A1A]">{ord.customer_name}</span>
                    <span className="block text-stone-500 font-mono">{ord.phone}</span>
                    {ord.delivery_address && (
                      <span className="block text-stone-500 mt-0.5">
                        {ord.delivery_address}, {ord.delivery_city}
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-stone-400 block font-bold text-[10px] uppercase tracking-wider mb-1">
                      Articles ({ord.items?.length || 0})
                    </span>
                    <div className="space-y-1">
                      {ord.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-stone-700 bg-white px-2.5 py-1 rounded-md border border-[#E5E1D8]"
                        >
                          <span>
                            {item.quantity}x {item.product_name}
                            {item.notes && (
                              <span className="text-[#C5A059] italic ml-1">({item.notes})</span>
                            )}
                          </span>
                          <span className="font-mono font-bold text-[#1A1A1A]">{formatAriary(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Change Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E5E1D8]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Changer l'état :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'] as OrderStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(ord.id, st)}
                          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            ord.status === st
                              ? 'bg-[#1A1A1A] text-white shadow-xs'
                              : 'bg-white text-stone-600 border border-[#E5E1D8] hover:border-[#C5A059]'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: RESERVATIONS MANAGEMENT ==================== */}
      {activeTab === 'reservations' && (
        <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title font-bold text-[#1A1A1A] text-xl">
              Gestion des Réservations de Table
            </h3>
          </div>

          <div className="space-y-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="p-5 bg-[#FDFCF8] border border-[#E5E1D8] rounded-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E1D8] pb-3">
                  <div>
                    <h4 className="font-bold text-[#1A1A1A] text-base">
                      {res.customer_name} ({res.guests} personnes)
                    </h4>
                    <p className="text-xs text-stone-500">
                      Date : <strong>{res.reservation_date}</strong> à{' '}
                      <strong>{res.reservation_time}</strong> • Tél : {res.phone}
                    </p>
                  </div>
                  <ReservationStatusBadge status={res.status} />
                </div>

                {res.message && (
                  <p className="text-xs text-stone-600 italic bg-white p-2.5 rounded-lg border border-[#E5E1D8]">
                    "{res.message}"
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-stone-500">Table attribuée :</span>
                    <input
                      type="text"
                      defaultValue={res.table_assigned || ''}
                      placeholder="Ex: Table 4"
                      onBlur={(e) =>
                        updateReservationStatus(res.id, res.status, e.target.value)
                      }
                      className="px-2.5 py-1 rounded-md bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs w-28 font-mono focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateReservationStatus(res.id, 'confirmed')}
                      className="px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => updateReservationStatus(res.id, 'completed')}
                      className="px-3 py-1.5 rounded-md bg-[#F5F2ED] hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider border border-[#E5E1D8] cursor-pointer"
                    >
                      Honorée
                    </button>
                    <button
                      onClick={() => updateReservationStatus(res.id, 'cancelled')}
                      className="px-3 py-1.5 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: PRODUCTS MANAGEMENT ==================== */}
      {activeTab === 'products' && (
        <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-title font-bold text-[#1A1A1A] text-xl">
                Carte des Plats ({products.length})
              </h3>
              <p className="text-xs text-stone-500">
                Créez, modifiez et gérez la disponibilité des plats en temps réel.
              </p>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Plat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-4 bg-[#FDFCF8] border border-[#E5E1D8] rounded-xl flex flex-col justify-between gap-3 relative group"
              >
                <div className="flex gap-3">
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#E5E1D8]"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold text-[#C5A059] tracking-wider">
                      {prod.category_name}
                    </span>
                    <h4 className="font-bold text-[#1A1A1A] text-sm truncate">{prod.name}</h4>
                    <p className="text-xs font-bold text-[#C5A059] font-mono mt-0.5">
                      {formatAriary(prod.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E5E1D8] text-xs">
                  <button
                    onClick={() => toggleProductAvailability(prod.id)}
                    className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                      prod.available
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {prod.available ? 'En cuisine (Actif)' : 'Rupture (Masqué)'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="p-1.5 rounded-md bg-white border border-[#E5E1D8] hover:bg-[#F5F2ED] text-stone-700 transition-colors cursor-pointer"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Supprimer définitivement "${prod.name}" ?`)) {
                          deleteProduct(prod.id);
                        }
                      }}
                      className="p-1.5 rounded-md bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: CATEGORIES MANAGEMENT ==================== */}
      {activeTab === 'categories' && (
        <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-title font-bold text-[#1A1A1A] text-xl">
                Catégories du Menu ({categories.length})
              </h3>
            </div>
            <button
              onClick={handleOpenAddCategory}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Catégorie</span>
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => {
              const count = products.filter((p) => p.category_id === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="p-4 bg-[#FDFCF8] border border-[#E5E1D8] rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#1A1A1A] text-sm block">{cat.name}</span>
                    <span className="text-stone-500">
                      Slug : {cat.slug} • {count} plats associés
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setCategoryForm({
                          name: cat.name,
                          description: cat.description || '',
                          display_order: cat.display_order || 1,
                        });
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-2 rounded-md bg-white border border-[#E5E1D8] hover:bg-[#F5F2ED] text-stone-700 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-2 rounded-md bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: REVIEWS MODERATION ==================== */}
      {activeTab === 'reviews' && (
        <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-6 shadow-xs">
          <h3 className="font-serif-title font-bold text-[#1A1A1A] text-xl">
            Modération des Avis Clients ({reviews.length})
          </h3>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-[#FDFCF8] border border-[#E5E1D8] rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1A1A]">{rev.user_name}</span>
                    {rev.product_name && (
                      <span className="text-[#C5A059] font-semibold">sur "{rev.product_name}"</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating ? 'fill-[#C5A059]' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-stone-600 italic leading-relaxed">"{rev.comment}"</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#E5E1D8]">
                  <span className="text-[10px] text-stone-400">
                    {formatDateTime(rev.created_at)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleReviewVisibility(rev.id)}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
                        rev.is_visible
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}
                    >
                      {rev.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{rev.is_visible ? 'Visible' : 'Masqué'}</span>
                    </button>
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="p-1 rounded-md text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 7: TABLE QR CODE GENERATOR ==================== */}
      {activeTab === 'qrcode' && (
        <div className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-6 shadow-xs">
          <div className="max-w-2xl">
            <h3 className="font-serif-title font-bold text-[#1A1A1A] text-xl">
              Générateur de QR Code pour Table Restaurant
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Imprimez ces QR codes et disposez-les sur chaque table. Vos convives scannent avec leur smartphone pour accéder au menu avec numéro de table pré-rempli.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Generator Form */}
            <div className="p-5 bg-[#FDFCF8] border border-[#E5E1D8] rounded-xl space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Numéro de Table
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={qrTableNum}
                    onChange={(e) => setQrTableNum(e.target.value)}
                    className="w-20 px-3 py-2 rounded-md bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs font-bold font-mono focus:border-[#C5A059]"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {['1', '2', '3', '4', '5', '10', '12', '15'].map((num) => (
                      <button
                        key={num}
                        onClick={() => setQrTableNum(num)}
                        className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer ${
                          qrTableNum === num
                            ? 'bg-[#1A1A1A] text-white'
                            : 'bg-white text-stone-700 border border-[#E5E1D8] hover:bg-[#F5F2ED]'
                        }`}
                      >
                        #{num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs text-stone-600 space-y-1">
                <span className="font-bold text-[#1A1A1A] block text-[10px] uppercase">Lien généré :</span>
                <code className="text-[#C5A059] font-mono text-[11px] block break-all bg-white p-2 rounded-md border border-[#E5E1D8]">
                  {window.location.origin}/?table={qrTableNum}
                </code>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-2.5 px-4 rounded-md bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer le Chevalet de Table</span>
              </button>
            </div>

            {/* Printable Table Card Preview */}
            <div className="p-8 bg-white border-2 border-[#C5A059] rounded-xl text-center space-y-4 shadow-md">
              <div className="font-serif-title font-bold text-[#C5A059] uppercase tracking-widest text-xs">
                {settings.name}
              </div>
              <div className="text-3xl font-serif-title font-extrabold text-[#1A1A1A]">
                TABLE N° {qrTableNum}
              </div>

              {/* Dynamic QR Code */}
              <div className="w-48 h-48 bg-white p-3 rounded-lg border border-[#E5E1D8] mx-auto flex items-center justify-center shadow-xs">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    `${window.location.origin}/?table=${qrTableNum}`
                  )}`}
                  alt={`QR Code Table ${qrTableNum}`}
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="text-xs text-stone-600 font-medium max-w-xs mx-auto">
                Scannez pour consulter notre carte gastronomique et commander directement depuis votre table.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 8: SETTINGS MANAGEMENT ==================== */}
      {activeTab === 'settings' && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            alert('Paramètres du restaurant mis à jour avec succès !');
          }}
          className="p-6 bg-white border border-[#E5E1D8] rounded-xl space-y-6 shadow-xs"
        >
          <h3 className="font-serif-title font-bold text-[#1A1A1A] text-xl">
            Paramètres Généraux de l'Établissement
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Nom du Restaurant
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => updateSettings({ name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => updateSettings({ tagline: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Téléphone de Contact
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => updateSettings({ phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Email Professionnel
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => updateSettings({ email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Frais de Livraison (Ariary MGA)
              </label>
              <input
                type="number"
                value={settings.delivery_fee}
                onChange={(e) => updateSettings({ delivery_fee: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Adresse & Ville
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => updateSettings({ address: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </form>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <form
            onSubmit={handleSaveProduct}
            className="w-full max-w-xl bg-[#FDFCF8] border border-[#E5E1D8] rounded-xl p-6 sm:p-8 space-y-4 my-8 shadow-2xl"
          >
            <h3 className="font-serif-title font-bold text-xl text-[#1A1A1A]">
              {editingProduct ? 'Modifier le Plat' : 'Ajouter un Plat au Menu'}
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Nom du Plat *
              </label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Ex: Pavé de Zébu au Poivre Vert"
                required
                className="w-full px-4 py-2 rounded-lg bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Catégorie *
                </label>
                <select
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Prix (Ariary MGA) *
                </label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Description & Ingrédients *
              </label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                rows={3}
                required
                className="w-full px-4 py-2 rounded-lg bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] resize-none"
              />
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Image du Plat (URL ou Upload Supabase Storage)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-2 rounded-lg bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs font-mono"
                />
                <label className="px-4 py-2 rounded-md bg-[#F5F2ED] hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 transition-colors border border-[#E5E1D8]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {isUploadingProductImg && (
                <p className="text-[11px] text-[#C5A059] mt-1 animate-pulse font-semibold">
                  Téléversement vers Supabase Storage...
                </p>
              )}
            </div>

            {/* Switches */}
            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.popular}
                  onChange={(e) => setProductForm({ ...productForm, popular: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#C5A059]"
                />
                <span>Populaire 🔥</span>
              </label>

              <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#C5A059]"
                />
                <span>Recommandé ✨</span>
              </label>

              <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.available}
                  onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#C5A059]"
                />
                <span>Disponible en cuisine</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E1D8]">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-md bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                {editingProduct ? 'Enregistrer les modifications' : 'Créer le plat'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleSaveCategory}
            className="w-full max-w-md bg-[#FDFCF8] border border-[#E5E1D8] rounded-xl p-6 space-y-4 shadow-2xl"
          >
            <h3 className="font-serif-title font-bold text-lg text-[#1A1A1A]">
              {editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Nom de la Catégorie *
              </label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Ex: Poissons & Fruits de Mer"
                required
                className="w-full px-4 py-2 rounded-lg bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Description (Optionnel)
              </label>
              <textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg bg-white border border-[#E5E1D8] text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C5A059] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-md bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
