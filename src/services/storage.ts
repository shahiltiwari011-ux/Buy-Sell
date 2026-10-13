import type { Product, MessageThread } from '../types';
import { INITIAL_PRODUCTS, INITIAL_THREADS } from '../data/initialProducts';

const PRODUCTS_KEY = 'campusloop_products_v3';
const SAVED_KEY = 'campusloop_saved_v3';
const THREADS_KEY = 'campusloop_threads_v3';

export const storageService = {
  getProducts: (): Product[] => {
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
      console.error('Failed to read products from localStorage:', err);
      return INITIAL_PRODUCTS;
    }
  },

  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'isUserCreated'>): Product => {
    const current = storageService.getProducts();
    const newProduct: Product = {
      ...product,
      id: `drop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isUserCreated: true
    };
    
    // Put new product at the beginning of the list
    const updated = [newProduct, ...current];
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save product to localStorage:', err);
    }
    return newProduct;
  },

  deleteProduct: (id: string): Product[] => {
    const current = storageService.getProducts();
    const updated = current.filter(p => p.id !== id);
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update localStorage:', err);
    }
    return updated;
  },

  resetToDemo: (): Product[] => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(SAVED_KEY, JSON.stringify(['prod-1', 'prod-7']));
      localStorage.setItem(THREADS_KEY, JSON.stringify(INITIAL_THREADS));
    } catch (err) {
      console.error('Failed to reset demo data:', err);
    }
    return INITIAL_PRODUCTS;
  },

  // Saved / Favorited items
  getSavedIds: (): string[] => {
    try {
      const stored = localStorage.getItem(SAVED_KEY);
      if (!stored) {
        // Pre-save 2 items for demonstration like Psychology textbooks & Canon camera
        const initialSaved = ['prod-1', 'prod-7'];
        localStorage.setItem(SAVED_KEY, JSON.stringify(initialSaved));
        return initialSaved;
      }
      return JSON.parse(stored) || [];
    } catch (err) {
      console.error('Failed to get saved items:', err);
      return [];
    }
  },

  toggleSave: (id: string): string[] => {
    try {
      const current = storageService.getSavedIds();
      const updated = current.includes(id) 
        ? current.filter(item => item !== id)
        : [...current, id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error('Failed to toggle saved item:', err);
      return [];
    }
  },

  // Messages threads
  getThreads: (): MessageThread[] => {
    try {
      const stored = localStorage.getItem(THREADS_KEY);
      if (!stored) {
        localStorage.setItem(THREADS_KEY, JSON.stringify(INITIAL_THREADS));
        return INITIAL_THREADS;
      }
      return JSON.parse(stored) || INITIAL_THREADS;
    } catch (err) {
      console.error('Failed to get message threads:', err);
      return INITIAL_THREADS;
    }
  },

  sendMessage: (threadId: string, text: string): MessageThread[] => {
    try {
      const threads = storageService.getThreads();
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const updated = threads.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: text,
            time: 'Just now',
            messages: [
              ...t.messages,
              {
                id: `msg-${Date.now()}`,
                sender: 'user' as const,
                text,
                time: timeStr
              }
            ]
          };
        }
        return t;
      });
      localStorage.setItem(THREADS_KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error('Failed to send message:', err);
      return storageService.getThreads();
    }
  },

  startOrGetThread: (product: Product, initialText: string): { threads: MessageThread[]; activeThreadId: string } => {
    try {
      const threads = storageService.getThreads();
      const existing = threads.find(t => t.productId === product.id);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (existing) {
        const updated = storageService.sendMessage(existing.id, initialText);
        return { threads: updated, activeThreadId: existing.id };
      }

      const newThread: MessageThread = {
        id: `thread-${Date.now()}`,
        productId: product.id,
        productTitle: product.title,
        sellerName: product.sellerName,
        sellerAvatar: product.sellerAvatar,
        lastMessage: initialText,
        time: 'Just now',
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text: initialText,
            time: timeStr
          }
        ]
      };

      const updated = [newThread, ...threads];
      localStorage.setItem(THREADS_KEY, JSON.stringify(updated));
      return { threads: updated, activeThreadId: newThread.id };
    } catch (err) {
      console.error('Failed to start thread:', err);
      return { threads: INITIAL_THREADS, activeThreadId: INITIAL_THREADS[0].id };
    }
  }
};
