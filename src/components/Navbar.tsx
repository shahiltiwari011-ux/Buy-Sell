import React from 'react';
import { LayoutGrid, Heart, Mail, ArrowUpRight, Users, Plus } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

interface NavbarProps {
  onOpenSellModal: () => void;
  onOpenMessages: () => void;
  onToggleSavedView: () => void;
  isSavedViewActive: boolean;
  savedCount: number;
  unreadCount: number;
  onResetToAll: () => void;
  currentView: 'marketplace' | 'roommates';
  onSelectView: (view: 'marketplace' | 'roommates') => void;
  onOpenPostRoommate?: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSellModal,
  onOpenMessages,
  onToggleSavedView,
  isSavedViewActive,
  savedCount,
  unreadCount,
  onResetToAll,
  currentView,
  onSelectView,
  onOpenPostRoommate,
  onOpenAuth
}) => {
  return (
    <>
      {/* ==================================================================== */}
      {/* TOP HEADER (Sticky Desktop & Mobile) */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20">
            
            {/* Logo & Brand: campusloop */}
            <div className="flex items-center gap-6 lg:gap-8">
              <button 
                onClick={onResetToAll}
                className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
              >
                {/* Circular loop arrow icon */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    <polyline points="21 3 21 9 15 9" />
                  </svg>
                </div>
                <span className="text-xl sm:text-[26px] font-black tracking-tight text-slate-900 group-hover:text-black">
                  campusloop
                </span>
              </button>

              {/* Desktop Nav links */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-700">
                <button
                  id="nav-marketplace-btn"
                  onClick={() => {
                    onSelectView('marketplace');
                    onResetToAll();
                  }}
                  className={`flex items-center gap-2 transition-colors cursor-pointer py-1 ${
                    currentView === 'marketplace' && !isSavedViewActive
                      ? 'text-black font-extrabold underline decoration-2 underline-offset-4'
                      : 'hover:text-black'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Marketplace</span>
                </button>

                <button
                  id="nav-roommates-btn"
                  onClick={() => onSelectView('roommates')}
                  className={`flex items-center gap-2 transition-colors cursor-pointer py-1 relative ${
                    currentView === 'roommates'
                      ? 'text-black font-extrabold underline decoration-2 underline-offset-4'
                      : 'hover:text-black'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Find Roommate</span>
                  <span className="bg-[#E2F952] text-black text-[10px] font-black px-1.5 py-0.2 rounded-md border border-black/20 shadow-2xs rotate-[-2deg]">
                    NEW
                  </span>
                </button>

                <button
                  id="nav-saved-btn"
                  onClick={() => {
                    if (currentView !== 'marketplace') {
                      onSelectView('marketplace');
                    }
                    onToggleSavedView();
                  }}
                  className={`flex items-center gap-2 transition-colors cursor-pointer py-1 relative ${
                    isSavedViewActive && currentView === 'marketplace'
                      ? 'text-black font-extrabold underline decoration-2 underline-offset-4'
                      : 'hover:text-black'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${savedCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                  <span>Saved</span>
                  {savedCount > 0 && (
                    <span className="bg-[#E2F952] text-black text-[11px] font-black px-1.5 py-0.2 rounded-full border border-black/20">
                      {savedCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={onOpenMessages}
                  className="flex items-center gap-2 hover:text-black transition-colors cursor-pointer py-1 relative"
                >
                  <Mail className="w-4 h-4" />
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Right Action: Action Button & User Avatar */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Desktop Action Buttons */}
              <div className="hidden md:block">
                {currentView === 'roommates' ? (
                  <button
                    onClick={onOpenPostRoommate || onOpenSellModal}
                    id="post-roommate-btn"
                    className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>Post Availability</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                ) : (
                  <button
                    onClick={onOpenSellModal}
                    id="sell-your-stuff-btn"
                    className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>Sell your stuff</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>

              {/* Mobile Quick Action Pill (Compact) */}
              <div className="md:hidden">
                {currentView === 'roommates' ? (
                  <button
                    onClick={onOpenPostRoommate || onOpenSellModal}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Post</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenSellModal}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Sell</span>
                  </button>
                )}
              </div>

              {/* User Profile Avatar with dropdown (Cleanly fits on mobile & desktop) */}
              <ProfileDropdown onOpenAuth={onOpenAuth} />

            </div>

          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (iOS / Android style, max thumb usability) */}
      {/* ==================================================================== */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-black md:hidden px-2 py-1.5 shadow-[0px_-2px_12px_rgba(0,0,0,0.08)] flex items-center justify-around"
      >
        {/* 1. Marketplace Tab */}
        <button
          onClick={() => {
            onSelectView('marketplace');
            if (isSavedViewActive) onToggleSavedView();
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors cursor-pointer ${
            currentView === 'marketplace' && !isSavedViewActive
              ? 'text-black font-black'
              : 'text-slate-500 hover:text-black font-bold'
          }`}
        >
          <div className={`p-1 rounded-lg ${currentView === 'marketplace' && !isSavedViewActive ? 'bg-[#E2F952] border border-black' : ''}`}>
            <LayoutGrid className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[10px]">Market</span>
        </button>

        {/* 2. Roommates Tab */}
        <button
          onClick={() => onSelectView('roommates')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors cursor-pointer relative ${
            currentView === 'roommates'
              ? 'text-black font-black'
              : 'text-slate-500 hover:text-black font-bold'
          }`}
        >
          <div className={`p-1 rounded-lg relative ${currentView === 'roommates' ? 'bg-[#E2F952] border border-black' : ''}`}>
            <Users className="w-4 h-4 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E2F952] border border-black"></span>
          </div>
          <span className="text-[10px]">Roommate</span>
        </button>

        {/* 3. Center Float Action: Sell or Post */}
        <button
          onClick={currentView === 'roommates' ? (onOpenPostRoommate || onOpenSellModal) : onOpenSellModal}
          className="relative -mt-4 w-12 h-12 rounded-full bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center text-black cursor-pointer group transition-transform"
          title={currentView === 'roommates' ? "Post Availability" : "Sell an Item"}
        >
          <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* 4. Saved Wishlist */}
        <button
          onClick={() => {
            if (currentView !== 'marketplace') onSelectView('marketplace');
            onToggleSavedView();
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors cursor-pointer relative ${
            isSavedViewActive && currentView === 'marketplace'
              ? 'text-black font-black'
              : 'text-slate-500 hover:text-black font-bold'
          }`}
        >
          <div className={`p-1 rounded-lg relative ${isSavedViewActive && currentView === 'marketplace' ? 'bg-[#E2F952] border border-black' : ''}`}>
            <Heart className={`w-4 h-4 stroke-[2.5] ${savedCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-[#E2F952] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Saved</span>
        </button>

        {/* 5. Messages */}
        <button
          onClick={onOpenMessages}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors cursor-pointer text-slate-500 hover:text-black font-bold relative"
        >
          <div className="p-1 rounded-lg relative">
            <Mail className="w-4 h-4 stroke-[2.5]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Chat</span>
        </button>
      </nav>
    </>
  );
};
