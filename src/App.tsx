import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Product, Category, MessageThread } from './types';
import { storageService } from './services/storage';
import { marketplaceService } from './services/marketplaceService';
import { useAuth } from './services/authService';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MarqueeTicker } from './components/MarqueeTicker';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ContactSellerModal } from './components/ContactSellerModal';
import { SellModal } from './components/SellModal';
import { MessagesModal } from './components/MessagesModal';
import { AuthModal } from './components/AuthModal';
import { NotificationToast, type ToastMessage } from './components/NotificationToast';
import { Footer } from './components/Footer';
import { RoommateFinderSection } from './components/roommate/RoommateFinderSection';
import { SearchX, ArrowUpRight } from 'lucide-react';

const CATEGORIES: Category[] = [
  'All',
  'Books',
  'Tech',
  'Room',
  'Bikes',
  'Fits',
  'Other'
];

export function App() {
  const { user } = useAuth();

  // Navigation View State: 'marketplace' | 'roommates'
  const [currentView, setCurrentView] = useState<'marketplace' | 'roommates'>('marketplace');

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSavedViewActive, setIsSavedViewActive] = useState(false);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [contactingProduct, setContactingProduct] = useState<Product | null>(null);

  // Feedback toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Load products from marketplaceService
  const loadProducts = useCallback(async () => {
    try {
      const items = await marketplaceService.getProducts(user?.id);
      setProducts(items);
    } catch (err) {
      console.error('Failed to load marketplace products:', err);
    }
  }, [user?.id]);

  // Load initial data
  useEffect(() => {
    loadProducts();
    setSavedProductIds(storageService.getSavedIds());
    setThreads(storageService.getThreads());
  }, [loadProducts]);

  // Keep selectedProduct in sync if list updates
  useEffect(() => {
    if (selectedProduct) {
      const updated = products.find((p) => p.id === selectedProduct.id);
      if (updated) setSelectedProduct(updated);
    }
  }, [products, selectedProduct]);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Saved items view filter
      if (isSavedViewActive && !savedProductIds.includes(p.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchSeller = p.sellerName.toLowerCase().includes(q);
        if (!matchTitle && !matchCategory && !matchDesc && !matchSeller) {
          return false;
        }
      }

      return true;
    });
  }, [products, savedProductIds, isSavedViewActive, selectedCategory, searchQuery]);

  // Unread messages count
  const unreadMessagesCount = useMemo(() => {
    return threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
  }, [threads]);

  // Handlers
  const handleToggleSave = (productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = storageService.toggleSave(productId);
    setSavedProductIds(updated);

    const isNowSaved = updated.includes(productId);
    setToast({
      id: String(Date.now()),
      type: isNowSaved ? 'success' : 'info',
      message: isNowSaved ? 'Saved to your wishlist!' : 'Removed from saved items'
    });
  };

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleContactFromDetails = (product: Product) => {
    setContactingProduct(product);
    setIsContactOpen(true);
  };

  const handleDirectMessage = (product: Product) => {
    const { threads: updatedThreads, activeThreadId: threadId } = storageService.startOrGetThread(
      product,
      `Hi ${product.sellerName}, is "${product.title}" still available on campus?`
    );
    setThreads(updatedThreads);
    setActiveThreadId(threadId);
    setIsDetailsOpen(false);
    setIsMessagesOpen(true);
  };

  const handleSendMessage = (threadId: string, text: string) => {
    const updated = storageService.sendMessage(threadId, text);
    setThreads(updated);
  };

  const handlePublishDrop = async (productData: Omit<Product, 'id' | 'createdAt' | 'isUserCreated' | 'isSold'>) => {
    try {
      const newProduct = await marketplaceService.createProduct(productData, user?.id);
      setProducts((prev) => [newProduct, ...prev]);

      // Reset filters to show the new drop right at the top
      setSelectedCategory('All');
      setIsSavedViewActive(false);
      setSearchQuery('');

      setToast({
        id: String(Date.now()),
        type: 'success',
        message: `🎉 "${newProduct.title}" dropped! Live now on campusloop.`
      });

      setTimeout(() => {
        document.getElementById('drops-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      console.error('Failed to create product:', err);
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Failed to publish drop. Please try again.'
      });
    }
  };

  const handleToggleSold = async (productId: string, isSold: boolean) => {
    try {
      if (isSold) {
        await marketplaceService.markAsSold(productId, user?.id);
      } else {
        await marketplaceService.markAsAvailable(productId, user?.id);
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isSold } : p))
      );
      setToast({
        id: String(Date.now()),
        type: 'info',
        message: isSold ? 'Item marked as sold!' : 'Item marked as available!'
      });
    } catch {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Could not update status.'
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await marketplaceService.deleteProduct(productId, user?.id);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setToast({
        id: String(Date.now()),
        type: 'info',
        message: 'Product listing removed.'
      });
    } catch {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Could not delete product.'
      });
    }
  };

  const handleReportProduct = async (productId: string, reason: string, details: string) => {
    try {
      await marketplaceService.reportProduct(productId, reason, details, user?.id);
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'Thank you for keeping campusloop safe. Report submitted for review.'
      });
    } catch {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Could not submit report. Please try again.'
      });
    }
  };

  const handleOpenSellModal = () => {
    if (marketplaceService.isConfiguredWithSupabase() && !user) {
      setToast({
        id: String(Date.now()),
        type: 'info',
        message: 'Please sign in to drop an item.'
      });
      setAuthView('sign-in');
      setIsAuthOpen(true);
      return;
    }
    setIsSellOpen(true);
  };

  const handleResetDemoData = () => {
    const reset = marketplaceService.resetDemoData();
    storageService.resetDemoThreadsAndSaved();
    setProducts(reset);
    setSavedProductIds(storageService.getSavedIds());
    setThreads(storageService.getThreads());
    setSelectedCategory('All');
    setIsSavedViewActive(false);
    setSearchQuery('');
    setToast({
      id: String(Date.now()),
      type: 'info',
      message: 'Reset to original campus drops & demo threads!'
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setIsSavedViewActive(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = () => {
    document.getElementById('drops-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDirectRoommateMessage = (name: string, college: string, text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentThreads = storageService.getThreads();
    const existing = currentThreads.find(t => t.sellerName === name);

    if (existing) {
      const updated = storageService.sendMessage(existing.id, text);
      setThreads(updated);
      setActiveThreadId(existing.id);
    } else {
      const newThread: MessageThread = {
        id: `roommate-thread-${Date.now()}`,
        productTitle: `Roommate Inquiry • ${college}`,
        sellerName: name,
        sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        lastMessage: text,
        time: 'Just now',
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text,
            time: timeStr
          }
        ]
      };
      const updated = [newThread, ...currentThreads];
      try {
        localStorage.setItem('campusloop_threads_v3', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to store thread:', err);
      }
      setThreads(updated);
      setActiveThreadId(newThread.id);
    }
  };

  const handleShowToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({
      id: String(Date.now()),
      type,
      message
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-[#E2F952] selection:text-black pb-20 md:pb-0">
      
      {/* 1. Header / Navbar */}
      <Navbar
        onOpenSellModal={handleOpenSellModal}
        onOpenMessages={() => setIsMessagesOpen(true)}
        onToggleSavedView={() => setIsSavedViewActive(prev => !prev)}
        isSavedViewActive={isSavedViewActive}
        savedCount={savedProductIds.length}
        unreadCount={unreadMessagesCount}
        onResetToAll={handleResetFilters}
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenPostRoommate={() => setCurrentView('roommates')}
        onOpenAuth={() => {
          setAuthView('sign-in');
          setIsAuthOpen(true);
        }}
      />

      {currentView === 'marketplace' ? (
        <>
          {/* 2. Hero Section: new semester. new-to-you stuff. */}
          <HeroBanner
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmitSearch={handleSearchSubmit}
            onExploreRoommates={() => setCurrentView('roommates')}
          />

          {/* 3. Forest Green Marquee Ribbon Ticker */}
          <MarqueeTicker />

          {/* 4. Drops Section */}
          <main id="drops-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
            {/* Category Pills: All, Books, Tech, Room, Bikes, Fits, Other */}
            <div className="mb-6">
              <CategoryFilter
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setIsSavedViewActive(false);
                }}
              />
            </div>

            {/* Section Heading: the latest drops [JUST IN] */}
            <div className="flex items-center justify-between pt-2 pb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {isSavedViewActive ? 'saved drops' : 'the latest drops'}
                </h2>
                
                {!isSavedViewActive ? (
                  <span className="bg-[#F472B6] text-white font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider rotate-[-4deg] inline-block shadow-xs border border-black/10 select-none">
                    JUST IN
                  </span>
                ) : (
                  <span className="bg-[#E2F952] text-black font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider inline-block shadow-xs border border-black/15">
                    {filteredProducts.length} ITEMS
                  </span>
                )}
              </div>

              {/* Right action: Browse all ↗ */}
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 font-black text-sm sm:text-base text-slate-900 hover:underline cursor-pointer group"
              >
                <span>Browse all</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Active search filter feedback chip */}
            {searchQuery && (
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                <span>Filtering for: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-black font-bold ml-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* 5. Product Cards Grid (4 columns across as in design) */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSaved={savedProductIds.includes(product.id)}
                    onSelect={handleOpenDetails}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              /* Empty state if nothing found */
              <div className="bg-white rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-10 text-center max-w-md mx-auto my-12">
                <div className="w-16 h-16 rounded-2xl bg-[#E2F952] border-2 border-black flex items-center justify-center mx-auto mb-4 text-black">
                  <SearchX className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">No drops found</h3>
                <p className="text-sm text-slate-600 mb-6 font-medium">
                  {isSavedViewActive
                    ? "You haven't saved any drops yet. Click the heart icon on any item to save it!"
                    : `We couldn't find anything matching your search. Clear filters to explore all items.`}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-white border-2 border-black hover:bg-slate-50 shadow-xs cursor-pointer"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={handleOpenSellModal}
                    className="px-4 py-2 rounded-xl text-sm font-black bg-[#E2F952] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    Sell an Item
                  </button>
                </div>
              </div>
            )}

          </main>
        </>
      ) : (
        <>
          {/* Continuous scrolling marquee banner */}
          <MarqueeTicker />

          {/* Roommate Finder Main Section */}
          <RoommateFinderSection
            onDirectMessage={handleDirectRoommateMessage}
            onShowToast={handleShowToast}
            onOpenAuth={() => {
              setAuthView('sign-in');
              setIsAuthOpen(true);
            }}
          />
        </>
      )}

      {/* 6. Footer with centered "good stuff deserves a second semester." */}
      <Footer
        onResetDemo={handleResetDemoData}
        onOpenSellModal={handleOpenSellModal}
      />

      {/* Modals & Drawers */}
      <ProductDetailsModal
        isOpen={isDetailsOpen}
        product={selectedProduct}
        isSaved={selectedProduct ? savedProductIds.includes(selectedProduct.id) : false}
        onClose={() => setIsDetailsOpen(false)}
        onToggleSave={(id) => handleToggleSave(id)}
        onContactSeller={handleContactFromDetails}
        onDirectMessage={handleDirectMessage}
        onToggleSold={handleToggleSold}
        onDeleteProduct={handleDeleteProduct}
        onReportProduct={handleReportProduct}
      />

      <ContactSellerModal
        isOpen={isContactOpen}
        product={contactingProduct}
        onClose={() => setIsContactOpen(false)}
      />

      <SellModal
        isOpen={isSellOpen}
        onClose={() => setIsSellOpen(false)}
        onPublish={handlePublishDrop}
      />

      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={setActiveThreadId}
        onSendMessage={handleSendMessage}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialView={authView}
      />

      <NotificationToast
        toast={toast}
        onDismiss={() => setToast(null)}
      />

    </div>
  );
}

export default App;
