import React, { useState, useEffect, useMemo } from 'react';
import type { Product, Category, MessageThread } from './types';
import { storageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MarqueeTicker } from './components/MarqueeTicker';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ContactSellerModal } from './components/ContactSellerModal';
import { SellModal } from './components/SellModal';
import { MessagesModal } from './components/MessagesModal';
import { NotificationToast, type ToastMessage } from './components/NotificationToast';
import { Footer } from './components/Footer';
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
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [contactingProduct, setContactingProduct] = useState<Product | null>(null);

  // Feedback toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Load initial data
  useEffect(() => {
    setProducts(storageService.getProducts());
    setSavedProductIds(storageService.getSavedIds());
    setThreads(storageService.getThreads());
  }, []);

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

  const handlePublishDrop = (productData: Omit<Product, 'id' | 'createdAt' | 'isUserCreated'>) => {
    const newProduct = storageService.addProduct(productData);
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
  };

  const handleResetDemoData = () => {
    const reset = storageService.resetToDemo();
    setProducts(reset);
    setSavedProductIds(storageService.getSavedIds());
    setThreads(storageService.getThreads());
    setSelectedCategory('All');
    setIsSavedViewActive(false);
    setSearchQuery('');
    setToast({
      id: String(Date.now()),
      type: 'info',
      message: 'Reset to original 8 campus drops!'
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

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-[#E2F952] selection:text-black">
      
      {/* 1. Header / Navbar */}
      <Navbar
        onOpenSellModal={() => setIsSellOpen(true)}
        onOpenMessages={() => setIsMessagesOpen(true)}
        onToggleSavedView={() => setIsSavedViewActive(prev => !prev)}
        isSavedViewActive={isSavedViewActive}
        savedCount={savedProductIds.length}
        unreadCount={unreadMessagesCount}
        onResetToAll={handleResetFilters}
      />

      {/* 2. Hero Section: new semester. new-to-you stuff. */}
      <HeroBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSubmitSearch={handleSearchSubmit}
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
                onClick={() => setIsSellOpen(true)}
                className="px-4 py-2 rounded-xl text-sm font-black bg-[#E2F952] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                Sell an Item
              </button>
            </div>
          </div>
        )}

      </main>

      {/* 6. Footer with centered "good stuff deserves a second semester." */}
      <Footer
        onResetDemo={handleResetDemoData}
        onOpenSellModal={() => setIsSellOpen(true)}
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

      <NotificationToast
        toast={toast}
        onDismiss={() => setToast(null)}
      />

    </div>
  );
}

export default App;
