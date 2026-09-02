export type UserRole = 'customer' | 'admin';

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  description: string;
  price: number; // in Ariary (MGA)
  image_url: string;
  available: boolean;
  featured: boolean;
  popular: boolean;
  prep_time_minutes?: number;
  calories?: number;
  allergens?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  special_instructions?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
  image_url?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  order_type: OrderType;
  table_number?: string | null;
  status: OrderStatus;
  customer_name: string;
  phone: string;
  email?: string;
  delivery_address?: string;
  delivery_city?: string;
  notes?: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface Reservation {
  id: string;
  user_id?: string | null;
  customer_name: string;
  phone: string;
  email?: string;
  reservation_date: string; // YYYY-MM-DD
  reservation_time: string; // HH:MM
  guests: number;
  message?: string;
  status: ReservationStatus;
  table_assigned?: string;
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  user_id?: string;
  user_name: string;
  user_avatar?: string;
  product_id?: string | null;
  product_name?: string | null;
  rating: number; // 1 to 5
  comment: string;
  is_visible: boolean;
  created_at: string;
}

export interface RestaurantSettings {
  id: string;
  name: string;
  logo_url: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  opening_hours: {
    monday_friday: string;
    saturday_sunday: string;
  };
  delivery_fee: number;
  currency: string;
  currency_symbol: string;
  social_facebook?: string;
  social_instagram?: string;
  social_tripadvisor?: string;
}
