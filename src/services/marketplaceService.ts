import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_KEY = 'campusloop_products_v3';

/** Maps a Supabase row to a Product object */
function mapRow(row: Record<string, unknown>, currentUserId?: string): Product {
  return {
    id: row.id as string,
    title: row.title as string,
    price: Number(row.price),
    category: row.category as Product['category'],
    condition: row.condition as Product['condition'],
    badge: (row.badge as string) || undefined,
    badgeType: (row.badge_type as Product['badgeType']) || undefined,
    description: row.description as string,
    imageUrl: row.image_url as string,
    imageBgColor: (row.image_bg_color as string) || '#F1F5F9',
    sellerName: row.seller_name as string,
    sellerAvatar: (row.seller_avatar as string) || undefined,
    sellerEmail: row.seller_email as string,
    sellerPhone: (row.seller_phone as string) || '',
    sellerLocation: (row.seller_location as string) || 'On campus',
    createdAt: row.created_at as string,
    isUserCreated: currentUserId ? row.user_id === currentUserId : false,
    isSold: (row.is_sold as boolean) || false,
  };
}

export const marketplaceService = {
  isConfiguredWithSupabase: (): boolean => isSupabaseConfigured(),

  /** Fetch all products */
  getProducts: async (currentUserId?: string): Promise<Product[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('marketplace_products')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((row) => mapRow(row, currentUserId));
        }
        // If database is empty, return initial products from localStorage
      } catch (err) {
        console.warn('[Marketplace] Supabase query failed, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      if (!stored) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return parsed;
    } catch (err) {
      console.error('[Marketplace] Failed to read products from localStorage:', err);
      return INITIAL_PRODUCTS;
    }
  },

  /** Create a new product listing */
  createProduct: async (
    productData: Omit<Product, 'id' | 'createdAt' | 'isUserCreated' | 'isSold'>,
    userId?: string
  ): Promise<Product> => {
    if (supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('marketplace_products')
          .insert({
            user_id: userId,
            title: productData.title,
            price: productData.price,
            category: productData.category,
            condition: productData.condition,
            badge: productData.badge || null,
            badge_type: productData.badgeType || null,
            description: productData.description,
            image_url: productData.imageUrl,
            image_bg_color: productData.imageBgColor || '#F1F5F9',
            seller_name: productData.sellerName,
            seller_avatar: productData.sellerAvatar || null,
            seller_email: productData.sellerEmail,
            seller_phone: productData.sellerPhone || null,
            seller_location: productData.sellerLocation || 'On campus',
          })
          .select()
          .single();

        if (!error && data) {
          return mapRow(data, userId);
        }
        if (error) {
          console.warn('[Marketplace] Supabase insert failed:', error.message);
        }
      } catch (err) {
        console.warn('[Marketplace] Supabase insert exception:', err);
      }
    }

    // LocalStorage fallback
    const newProduct: Product = {
      ...productData,
      id: `drop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isUserCreated: true,
    };

    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      const current: Product[] = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
      const updated = [newProduct, ...current];
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('[Marketplace] Failed to save product to localStorage:', err);
    }
    return newProduct;
  },

  /** Update a product (only owner) */
  updateProduct: async (
    id: string,
    updates: Partial<Pick<Product, 'title' | 'price' | 'description' | 'category' | 'condition' | 'badge' | 'imageUrl' | 'isSold'>>,
    userId?: string
  ): Promise<{ error: string | null }> => {
    if (supabase && userId) {
      try {
        const updatePayload: Record<string, unknown> = {};
        if (updates.title !== undefined) updatePayload.title = updates.title;
        if (updates.price !== undefined) updatePayload.price = updates.price;
        if (updates.description !== undefined) updatePayload.description = updates.description;
        if (updates.category !== undefined) updatePayload.category = updates.category;
        if (updates.condition !== undefined) updatePayload.condition = updates.condition;
        if (updates.badge !== undefined) updatePayload.badge = updates.badge;
        if (updates.imageUrl !== undefined) updatePayload.image_url = updates.imageUrl;
        if (updates.isSold !== undefined) updatePayload.is_sold = updates.isSold;

        const { error } = await supabase
          .from('marketplace_products')
          .update(updatePayload)
          .eq('id', id)
          .eq('user_id', userId); // RLS + client-side owner check

        if (error) return { error: error.message };
        return { error: null };
      } catch (err) {
        return { error: (err as Error).message };
      }
    }

    // LocalStorage fallback
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      const products: Product[] = stored ? JSON.parse(stored) : [];
      const target = products.find((p) => p.id === id);
      if (!target) return { error: 'Product not found' };
      if (!target.isUserCreated) return { error: 'You can only edit your own listings.' };
      const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  },

  /** Delete a product (only owner) */
  deleteProduct: async (id: string, userId?: string): Promise<{ error: string | null }> => {
    if (supabase && userId) {
      try {
        const { error } = await supabase
          .from('marketplace_products')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
        if (error) return { error: error.message };
        return { error: null };
      } catch (err) {
        return { error: (err as Error).message };
      }
    }

    // LocalStorage fallback
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      const products: Product[] = stored ? JSON.parse(stored) : [];
      const target = products.find((p) => p.id === id);
      if (target && !target.isUserCreated) return { error: 'You can only delete your own listings.' };
      const updated = products.filter((p) => p.id !== id);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  },

  /** Mark product as sold */
  markAsSold: async (id: string, userId?: string): Promise<{ error: string | null }> => {
    return marketplaceService.updateProduct(id, { isSold: true }, userId);
  },

  /** Mark product as available again */
  markAsAvailable: async (id: string, userId?: string): Promise<{ error: string | null }> => {
    return marketplaceService.updateProduct(id, { isSold: false }, userId);
  },

  /** Report a product listing */
  reportProduct: async (
    productId: string,
    reason: string,
    details: string,
    reporterId?: string
  ): Promise<{ error: string | null }> => {
    if (supabase && reporterId) {
      try {
        const { error } = await supabase.from('marketplace_reports').insert({
          product_id: productId,
          reporter_id: reporterId,
          reason,
          details,
        });
        if (error) return { error: error.message };
        return { error: null };
      } catch (err) {
        return { error: (err as Error).message };
      }
    }

    // LocalStorage fallback
    try {
      const key = 'campusloop_marketplace_reports';
      const stored = localStorage.getItem(key);
      const reports = stored ? JSON.parse(stored) : [];
      reports.push({
        id: `report-${Date.now()}`,
        productId,
        reason,
        details,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(reports));
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  },

  /** Upload product image to Supabase Storage */
  uploadProductImage: async (file: File, userId?: string): Promise<{ url: string | null; error: string | null }> => {
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: 'Only JPEG, PNG, WebP and GIF images are allowed.' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: 'Image must be smaller than 5 MB.' };
    }

    if (!supabase || !userId) {
      // Return a data URL for demo mode
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ url: reader.result as string, error: null });
        reader.onerror = () => resolve({ url: null, error: 'Failed to read file' });
        reader.readAsDataURL(file);
      });
    }

    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${userId}/products/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from('campusloop_media')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) return { url: null, error: error.message };

      const { data: urlData } = supabase.storage
        .from('campusloop_media')
        .getPublicUrl(path);
      return { url: urlData.publicUrl, error: null };
    } catch (err) {
      return { url: null, error: (err as Error).message };
    }
  },

  /** Reset local marketplace data to initial demo catalog */
  resetDemoData: (): Product[] => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    } catch (err) {
      console.error('[Marketplace] Failed to reset demo products:', err);
    }
    return INITIAL_PRODUCTS;
  },
};

