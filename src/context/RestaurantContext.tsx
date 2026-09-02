import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSupabase } from '../lib/supabase';
import {
  Category,
  Product,
  Order,
  Reservation,
  Review,
  RestaurantSettings,
  OrderStatus,
  ReservationStatus,
  OrderType,
} from '../types/restaurant';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_RESTAURANT_SETTINGS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
} from '../lib/demo-data';
import { generateOrderNumber } from '../lib/utils';

interface CreateOrderInput {
  userId?: string | null;
  orderType: OrderType;
  tableNumber?: string | null;
  customerName: string;
  phone: string;
  email?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  notes?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    notes?: string;
    imageUrl?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

interface CreateReservationInput {
  userId?: string | null;
  customerName: string;
  phone: string;
  email?: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  message?: string;
}

interface RestaurantContextType {
  categories: Category[];
  products: Product[];
  orders: Order[];
  reservations: Reservation[];
  reviews: Review[];
  settings: RestaurantSettings;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  
  // Product Operations
  addProduct: (product: Omit<Product, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleProductAvailability: (id: string) => Promise<void>;
  
  // Category Operations
  addCategory: (category: Omit<Category, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<{ success: boolean; error?: string }>;
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Order Operations
  createOrder: (input: CreateOrderInput) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<{ success: boolean; error?: string }>;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;
  
  // Reservation Operations
  createReservation: (input: CreateReservationInput) => Promise<{ success: boolean; reservation?: Reservation; error?: string }>;
  updateReservationStatus: (reservationId: string, status: ReservationStatus, tableAssigned?: string) => Promise<{ success: boolean; error?: string }>;
  
  // Review Operations
  addReview: (review: { userId: string; userName: string; userAvatar?: string; productId?: string | null; productName?: string | null; rating: number; comment: string }) => Promise<{ success: boolean; error?: string }>;
  toggleReviewVisibility: (reviewId: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  
  // Settings Operations
  updateSettings: (updates: Partial<RestaurantSettings>) => Promise<{ success: boolean; error?: string }>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('gourmet_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gourmet_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gourmet_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('gourmet_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('gourmet_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('gourmet_settings');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANT_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch all data from Supabase if connected
  const refreshData = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    setIsLoading(true);
    try {
      // 1. Fetch Categories
      const { data: catData, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (catData && catData.length > 0) {
        setCategories(catData as Category[]);
        localStorage.setItem('gourmet_categories', JSON.stringify(catData));
      }

      // 2. Fetch Products
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (prodData && prodData.length > 0) {
        const formattedProds: Product[] = prodData.map((p: any) => ({
          ...p,
          category_name: p.categories?.name || '',
          price: Number(p.price),
        }));
        setProducts(formattedProds);
        localStorage.setItem('gourmet_products', JSON.stringify(formattedProds));
      }

      // 3. Fetch Orders with Items
      const { data: ordData } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (ordData) {
        const formattedOrders: Order[] = ordData.map((o: any) => ({
          ...o,
          subtotal: Number(o.subtotal),
          delivery_fee: Number(o.delivery_fee),
          total: Number(o.total),
          items: o.order_items?.map((item: any) => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: Number(item.unit_price),
            subtotal: Number(item.subtotal),
            notes: item.notes,
            image_url: item.image_url,
          })),
        }));
        setOrders(formattedOrders);
        localStorage.setItem('gourmet_orders', JSON.stringify(formattedOrders));
      }

      // 4. Fetch Reservations
      const { data: resData } = await supabase
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: false });

      if (resData) {
        setReservations(resData as Reservation[]);
        localStorage.setItem('gourmet_reservations', JSON.stringify(resData));
      }

      // 5. Fetch Reviews
      const { data: revData } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          ),
          products (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (revData) {
        const formattedRevs: Review[] = revData.map((r: any) => ({
          id: r.id,
          user_id: r.user_id,
          user_name: r.profiles?.full_name || 'Client Gourmand',
          user_avatar: r.profiles?.avatar_url,
          product_id: r.product_id,
          product_name: r.products?.name,
          rating: r.rating,
          comment: r.comment,
          is_visible: r.is_visible,
          created_at: r.created_at,
        }));
        setReviews(formattedRevs);
        localStorage.setItem('gourmet_reviews', JSON.stringify(formattedRevs));
      }

      // 6. Fetch Settings
      const { data: settData } = await supabase
        .from('restaurants')
        .select('*')
        .limit(1)
        .single();

      if (settData) {
        const mappedSettings: RestaurantSettings = {
          id: settData.id,
          name: settData.name,
          logo_url: settData.logo_url || INITIAL_RESTAURANT_SETTINGS.logo_url,
          tagline: settData.tagline,
          description: settData.description,
          phone: settData.phone,
          email: settData.email,
          address: settData.address,
          city: settData.city,
          opening_hours: {
            monday_friday: settData.hours_weekdays || INITIAL_RESTAURANT_SETTINGS.opening_hours.monday_friday,
            saturday_sunday: settData.hours_weekends || INITIAL_RESTAURANT_SETTINGS.opening_hours.saturday_sunday,
          },
          delivery_fee: Number(settData.delivery_fee),
          currency: settData.currency || 'MGA',
          currency_symbol: settData.currency_symbol || 'Ar',
          social_facebook: settData.social_facebook,
          social_instagram: settData.social_instagram,
          social_tripadvisor: settData.social_tripadvisor,
        };
        setSettings(mappedSettings);
        localStorage.setItem('gourmet_settings', JSON.stringify(mappedSettings));
      }
    } catch (err) {
      console.warn('Supabase data sync notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gourmet_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('gourmet_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gourmet_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gourmet_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('gourmet_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('gourmet_settings', JSON.stringify(settings));
  }, [settings]);

  // ==================== PRODUCT ACTIONS ====================
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const supabase = getSupabase();
    const category = categories.find((c) => c.id === product.category_id);
    const categoryName = category?.name || '';

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([
            {
              category_id: product.category_id,
              name: product.name,
              description: product.description,
              price: product.price,
              image_url: product.image_url,
              available: product.available ?? true,
              featured: product.featured ?? false,
              popular: product.popular ?? false,
              prep_time_minutes: product.prep_time_minutes || 20,
              calories: product.calories,
              allergens: product.allergens || [],
            },
          ])
          .select()
          .single();

        if (error) return { success: false, error: error.message };

        const newProd: Product = {
          ...data,
          category_name: categoryName,
          price: Number(data.price),
        };
        setProducts((prev) => [newProd, ...prev]);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    const newProd: Product = {
      ...product,
      id: `p-${Date.now()}`,
      category_name: categoryName,
      created_at: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    return { success: true };
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const supabase = getSupabase();
    const category = updates.category_id ? categories.find((c) => c.id === updates.category_id) : undefined;
    const categoryName = category?.name;

    if (supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .update({
            ...(updates.category_id && { category_id: updates.category_id }),
            ...(updates.name && { name: updates.name }),
            ...(updates.description && { description: updates.description }),
            ...(updates.price !== undefined && { price: updates.price }),
            ...(updates.image_url && { image_url: updates.image_url }),
            ...(updates.available !== undefined && { available: updates.available }),
            ...(updates.featured !== undefined && { featured: updates.featured }),
            ...(updates.popular !== undefined && { popular: updates.popular }),
            ...(updates.prep_time_minutes !== undefined && { prep_time_minutes: updates.prep_time_minutes }),
            ...(updates.calories !== undefined && { calories: updates.calories }),
            ...(updates.allergens && { allergens: updates.allergens }),
          })
          .eq('id', id);

        if (error) return { success: false, error: error.message };

        setProducts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...updates,
                  ...(categoryName ? { category_name: categoryName } : {}),
                }
              : p
          )
        );
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              ...(categoryName ? { category_name: categoryName } : {}),
            }
          : p
      )
    );
    return { success: true };
  };

  const deleteProduct = async (id: string) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) return { success: false, error: error.message };
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    return { success: true };
  };

  const toggleProductAvailability = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    await updateProduct(id, { available: !prod.available });
  };

  // ==================== CATEGORY ACTIONS ====================
  const addCategory = async (cat: Omit<Category, 'id'>) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([
            {
              name: cat.name,
              slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
              description: cat.description,
              icon_name: cat.icon_name || 'Utensils',
              image_url: cat.image_url,
              display_order: cat.display_order || categories.length + 1,
              is_active: cat.is_active ?? true,
            },
          ])
          .select()
          .single();

        if (error) return { success: false, error: error.message };
        setCategories((prev) => [...prev, data as Category]);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
    };
    setCategories((prev) => [...prev, newCat]);
    return { success: true };
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('categories')
          .update(updates)
          .eq('id', id);

        if (error) return { success: false, error: error.message };
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    return { success: true };
  };

  const deleteCategory = async (id: string) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) return { success: false, error: error.message };
        setCategories((prev) => prev.filter((c) => c.id !== id));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  };

  // ==================== ORDER ACTIONS ====================
  const createOrder = async (input: CreateOrderInput) => {
    const orderNumber = generateOrderNumber();
    const supabase = getSupabase();

    if (supabase) {
      try {
        // 1. Insert order
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .insert([
            {
              order_number: orderNumber,
              user_id: input.userId || null,
              order_type: input.orderType,
              table_number: input.tableNumber || null,
              status: 'pending',
              customer_name: input.customerName,
              phone: input.phone,
              email: input.email || null,
              delivery_address: input.deliveryAddress || null,
              delivery_city: input.deliveryCity || null,
              notes: input.notes || null,
              subtotal: input.subtotal,
              delivery_fee: input.deliveryFee,
              total: input.total,
            },
          ])
          .select()
          .single();

        if (orderErr) return { success: false, error: orderErr.message };

        // 2. Insert order items with snapshot
        const orderItemsPayload = input.items.map((item) => ({
          order_id: orderData.id,
          product_id: item.productId,
          product_name: item.productName, // Price and name snapshot
          quantity: item.quantity,
          unit_price: item.unitPrice,
          subtotal: item.subtotal,
          notes: item.notes || null,
          image_url: item.imageUrl || null,
        }));

        const { data: itemsData, error: itemsErr } = await supabase
          .from('order_items')
          .insert(orderItemsPayload)
          .select();

        if (itemsErr) {
          console.error('Failed to create order items snapshot:', itemsErr);
        }

        const newOrder: Order = {
          ...orderData,
          subtotal: Number(orderData.subtotal),
          delivery_fee: Number(orderData.delivery_fee),
          total: Number(orderData.total),
          items: itemsData || input.items.map((i, idx) => ({
            id: `oi-${idx}`,
            product_id: i.productId,
            product_name: i.productName,
            quantity: i.quantity,
            unit_price: i.unitPrice,
            subtotal: i.subtotal,
            notes: i.notes,
            image_url: i.imageUrl,
          })),
        };

        setOrders((prev) => [newOrder, ...prev]);
        return { success: true, order: newOrder };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Demo Mode Order Creation
    const demoOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      user_id: input.userId,
      order_type: input.orderType,
      table_number: input.tableNumber,
      status: 'pending',
      customer_name: input.customerName,
      phone: input.phone,
      email: input.email,
      delivery_address: input.deliveryAddress,
      delivery_city: input.deliveryCity,
      notes: input.notes,
      subtotal: input.subtotal,
      delivery_fee: input.deliveryFee,
      total: input.total,
      created_at: new Date().toISOString(),
      items: input.items.map((it, idx) => ({
        id: `demo-oi-${idx}-${Date.now()}`,
        product_id: it.productId,
        product_name: it.productName,
        quantity: it.quantity,
        unit_price: it.unitPrice,
        subtotal: it.subtotal,
        notes: it.notes,
        image_url: it.imageUrl,
      })),
    };

    setOrders((prev) => [demoOrder, ...prev]);
    return { success: true, order: demoOrder };
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId);

        if (error) return { success: false, error: error.message };
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    return { success: true };
  };

  const getOrderById = (orderIdOrNumber: string) => {
    return orders.find(
      (o) => o.id === orderIdOrNumber || o.order_number === orderIdOrNumber
    );
  };

  // ==================== RESERVATION ACTIONS ====================
  const createReservation = async (input: CreateReservationInput) => {
    // Basic conflict validation: check if identical date + time + customer phone exists
    const conflict = reservations.some(
      (r) =>
        r.reservation_date === input.reservationDate &&
        r.reservation_time === input.reservationTime &&
        r.phone.replace(/\s+/g, '') === input.phone.replace(/\s+/g, '') &&
        r.status !== 'cancelled'
    );

    if (conflict) {
      return {
        success: false,
        error: 'Une réservation existe déjà pour cette date et cette heure avec ce numéro de téléphone.',
      };
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .insert([
            {
              user_id: input.userId || null,
              customer_name: input.customerName,
              phone: input.phone,
              email: input.email || null,
              reservation_date: input.reservationDate,
              reservation_time: input.reservationTime,
              guests: input.guests,
              message: input.message || null,
              status: 'pending',
            },
          ])
          .select()
          .single();

        if (error) return { success: false, error: error.message };
        setReservations((prev) => [data as Reservation, ...prev]);
        return { success: true, reservation: data as Reservation };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      user_id: input.userId,
      customer_name: input.customerName,
      phone: input.phone,
      email: input.email,
      reservation_date: input.reservationDate,
      reservation_time: input.reservationTime,
      guests: input.guests,
      message: input.message,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setReservations((prev) => [newRes, ...prev]);
    return { success: true, reservation: newRes };
  };

  const updateReservationStatus = async (
    reservationId: string,
    status: ReservationStatus,
    tableAssigned?: string
  ) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('reservations')
          .update({
            status,
            ...(tableAssigned !== undefined ? { table_assigned: tableAssigned } : {}),
          })
          .eq('id', reservationId);

        if (error) return { success: false, error: error.message };
        setReservations((prev) =>
          prev.map((r) =>
            r.id === reservationId
              ? { ...r, status, ...(tableAssigned ? { table_assigned: tableAssigned } : {}) }
              : r
          )
        );
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? { ...r, status, ...(tableAssigned ? { table_assigned: tableAssigned } : {}) }
          : r
      )
    );
    return { success: true };
  };

  // ==================== REVIEW ACTIONS ====================
  const addReview = async (rev: {
    userId: string;
    userName: string;
    userAvatar?: string;
    productId?: string | null;
    productName?: string | null;
    rating: number;
    comment: string;
  }) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .insert([
            {
              user_id: rev.userId,
              product_id: rev.productId || null,
              rating: rev.rating,
              comment: rev.comment,
              is_visible: true,
            },
          ])
          .select()
          .single();

        if (error) return { success: false, error: error.message };

        const newReview: Review = {
          id: data.id,
          user_id: rev.userId,
          user_name: rev.userName,
          user_avatar: rev.userAvatar,
          product_id: rev.productId,
          product_name: rev.productName,
          rating: rev.rating,
          comment: rev.comment,
          is_visible: true,
          created_at: data.created_at,
        };

        setReviews((prev) => [newReview, ...prev]);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      user_id: rev.userId,
      user_name: rev.userName,
      user_avatar: rev.userAvatar,
      product_id: rev.productId,
      product_name: rev.productName,
      rating: rev.rating,
      comment: rev.comment,
      is_visible: true,
      created_at: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    return { success: true };
  };

  const toggleReviewVisibility = async (reviewId: string) => {
    const rev = reviews.find((r) => r.id === reviewId);
    if (!rev) return;
    const nextVal = !rev.is_visible;

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('reviews').update({ is_visible: nextVal }).eq('id', reviewId);
    }
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, is_visible: nextVal } : r))
    );
  };

  const deleteReview = async (reviewId: string) => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('reviews').delete().eq('id', reviewId);
    }
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  // ==================== SETTINGS ACTIONS ====================
  const updateSettings = async (updates: Partial<RestaurantSettings>) => {
    const supabase = getSupabase();
    if (supabase && settings.id) {
      try {
        const { error } = await supabase
          .from('restaurants')
          .update({
            ...(updates.name && { name: updates.name }),
            ...(updates.logo_url && { logo_url: updates.logo_url }),
            ...(updates.tagline && { tagline: updates.tagline }),
            ...(updates.description && { description: updates.description }),
            ...(updates.phone && { phone: updates.phone }),
            ...(updates.email && { email: updates.email }),
            ...(updates.address && { address: updates.address }),
            ...(updates.city && { city: updates.city }),
            ...(updates.delivery_fee !== undefined && { delivery_fee: updates.delivery_fee }),
            ...(updates.opening_hours?.monday_friday && {
              hours_weekdays: updates.opening_hours.monday_friday,
            }),
            ...(updates.opening_hours?.saturday_sunday && {
              hours_weekends: updates.opening_hours.saturday_sunday,
            }),
            ...(updates.social_facebook && { social_facebook: updates.social_facebook }),
            ...(updates.social_instagram && { social_instagram: updates.social_instagram }),
            ...(updates.social_tripadvisor && { social_tripadvisor: updates.social_tripadvisor }),
          })
          .eq('id', settings.id);

        if (error) return { success: false, error: error.message };
        setSettings((prev) => ({ ...prev, ...updates }));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    setSettings((prev) => ({ ...prev, ...updates }));
    return { success: true };
  };

  return (
    <RestaurantContext.Provider
      value={{
        categories,
        products,
        orders,
        reservations,
        reviews,
        settings,
        isLoading,
        refreshData,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        createOrder,
        updateOrderStatus,
        getOrderById,
        createReservation,
        updateReservationStatus,
        addReview,
        toggleReviewVisibility,
        deleteReview,
        updateSettings,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
