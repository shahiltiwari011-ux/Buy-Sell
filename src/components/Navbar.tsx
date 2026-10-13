import React from 'react';
import { LayoutGrid, Heart, Mail, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenSellModal: () => void;
  onOpenMessages: () => void;
  onToggleSavedView: () => void;
  isSavedViewActive: boolean;
  savedCount: number;
  unreadCount: number;
  onResetToAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSellModal,
  onOpenMessages,
  onToggleSavedView,
  isSavedViewActive,
  savedCount,
  unreadCount,
  onResetToAll
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand: campusloop */}
          <div className="flex items-center gap-8">
            <button 
              onClick={onResetToAll}
              className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
            >
              {/* Circular loop arrow icon */}
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  <polyline points="21 3 21 9 15 9" />
                </svg>
              </div>
              <span className="text-2xl sm:text-[26px] font-black tracking-tight text-slate-900 group-hover:text-black">
                campusloop
              </span>
            </button>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-700">
              <button
                onClick={onResetToAll}
                className="flex items-center gap-2 hover:text-black transition-colors cursor-pointer py-1"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Browse</span>
              </button>

              <button
                onClick={onToggleSavedView}
                className={`flex items-center gap-2 transition-colors cursor-pointer py-1 relative ${
                  isSavedViewActive ? 'text-black font-extrabold underline decoration-2 underline-offset-4' : 'hover:text-black'
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

          {/* Right Action: "Sell your stuff ↗" & User Avatar */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Mobile quick icons */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={onToggleSavedView}
                className={`p-2 rounded-xl border border-black/10 ${isSavedViewActive ? 'bg-[#E2F952]' : 'bg-slate-50'}`}
                title="Saved Items"
              >
                <Heart className={`w-4 h-4 ${savedCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              </button>
              <button
                onClick={onOpenMessages}
                className="p-2 rounded-xl border border-black/10 bg-slate-50 relative"
                title="Messages"
              >
                <Mail className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                )}
              </button>
            </div>

            {/* Prominent "Sell your stuff ↗" Button */}
            <button
              onClick={onOpenSellModal}
              id="sell-your-stuff-btn"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Sell your stuff</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* User Profile Avatar with yellow ring */}
            <div className="relative group cursor-pointer" title="Signed in as Student">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#E2F952] ring-2 ring-black overflow-hidden bg-amber-100 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Student Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
