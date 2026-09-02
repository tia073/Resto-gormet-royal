import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Uploads a product image to Supabase Storage (products bucket)
 * If Supabase is not configured, converts to base64 data URL for local storage
 */
export async function uploadProductImage(file: File): Promise<string | null> {
  if (!file) return null;

  try {
    if (isSupabaseConfigured && supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError) {
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        return data.publicUrl;
      }
      console.warn('Supabase storage upload error:', uploadError);
    }

    // Fallback: local FileReader data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error uploading product image:', error);
    return null;
  }
}

/**
 * Uploads an avatar image to Supabase Storage (avatars bucket)
 */
export async function uploadAvatarImage(file: File, userId: string): Promise<string | null> {
  if (!file) return null;

  try {
    if (isSupabaseConfigured && supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError) {
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        return data.publicUrl;
      }
      console.warn('Supabase avatar storage error:', uploadError);
    }

    // Fallback: local FileReader data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error uploading avatar image:', error);
    return null;
  }
}
