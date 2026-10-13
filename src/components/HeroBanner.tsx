import React from 'react';
import { ArrowRight, X } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSubmitSearch?: () => void;
  onExploreRoommates?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  onSubmitSearch,
  onExploreRoommates
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmitSearch?.();
    }
  };

  return (
    <div className="bg-white pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Headline, subline, search bar */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-[76px] font-black tracking-tight leading-[1.04] text-slate-900">
            new semester.<br />
            <span className="relative inline-block bg-[#E2F952] px-3 py-0.5 rounded-sm mr-2 text-black">
              new-to-you
            </span>
            stuff.
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl font-semibold text-slate-700">
            Big finds. Student-budget energy.
          </p>

          {/* Roommate Finder Discovery Chip */}
          {onExploreRoommates && (
            <div>
              <button
                id="hero-explore-roommates-btn"
                type="button"
                onClick={onExploreRoommates}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FCFBF7] hover:bg-[#E2F952] border-2 border-black rounded-full text-xs font-bold text-slate-900 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 group"
              >
                <span>🏠 Moving near campus this semester?</span>
                <span className="font-black underline group-hover:no-underline">Explore Roommate Finder ↗</span>
              </button>
            </div>
          )}

          {/* Search Pill */}
          <div className="pt-2 max-w-lg">
            <div className="relative flex items-center bg-white border-2 border-black rounded-full p-1.5 pl-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-0.5 focus-within:translate-y-0.5 transition-all">
              <input
                type="text"
                id="campus-search-input"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Find your next campus obsession"
                className="w-full py-2 pr-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 font-medium bg-transparent border-0 focus:outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-1.5 mr-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Teal circular submit button */}
              <button
                type="button"
                onClick={onSubmitSearch}
                className="w-10 h-10 rounded-full bg-[#0E6C54] hover:bg-[#0B5441] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
                title="Search drops"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Neo-brutalist collage with checkered grid and stickers */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96">
            
            {/* Checkered Mint Backdrop */}
            <div 
              className="absolute inset-0 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
              style={{
                backgroundColor: '#DCFCE7',
                backgroundImage: `
                  linear-gradient(45deg, #B9F6CA 25%, transparent 25%), 
                  linear-gradient(-45deg, #B9F6CA 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #B9F6CA 75%), 
                  linear-gradient(-45deg, transparent 75%, #B9F6CA 75%)
                `,
                backgroundSize: '36px 36px',
                backgroundPosition: '0 0, 0 18px, 18px -18px, -18px 0px'
              }}
            />

            {/* PRE-LOVED Pink Ticket Sticker (top-left) */}
            <div className="absolute top-2 left-6 z-20 -rotate-8 transform bg-[#F472B6] border-2 border-black rounded-lg px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[11px] font-black text-black tracking-wider uppercase">
                PRE-LOVED
              </span>
            </div>

            {/* Sneaker with tape (left middle) */}
            <div className="absolute top-24 -left-6 z-10 w-36 sm:w-44 -rotate-12 hover:rotate-0 transition-transform duration-300">
              {/* Tape */}
              <div className="w-12 h-4 bg-white/75 backdrop-blur-xs border border-slate-300/60 shadow-xs mx-auto -mb-2 rotate-6 relative z-20"></div>
              <img
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80"
                alt="Sneakers"
                className="w-full h-24 sm:h-28 object-contain drop-shadow-md"
              />
            </div>

            {/* Over-ear Headphones with tape (top right) */}
            <div className="absolute top-4 right-20 z-10 w-24 sm:w-32 rotate-6 hover:rotate-0 transition-transform duration-300">
              {/* Tape */}
              <div className="w-10 h-3.5 bg-white/75 backdrop-blur-xs border border-slate-300/60 shadow-xs mx-auto -mb-2 -rotate-3 relative z-20"></div>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                alt="Headphones"
                className="w-full h-24 sm:h-28 object-contain drop-shadow-md"
              />
            </div>

            {/* Backpack with tape (right middle) */}
            <div className="absolute top-16 -right-4 z-10 w-28 sm:w-36 rotate-3 hover:scale-105 transition-transform duration-300">
              {/* Tape */}
              <div className="w-12 h-3.5 bg-white/75 backdrop-blur-xs border border-slate-300/60 shadow-xs mx-auto -mb-2 rotate-2 relative z-20"></div>
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80"
                alt="Backpack"
                className="w-full h-32 sm:h-40 object-contain drop-shadow-md"
              />
            </div>

            {/* Stack of textbooks with tape (bottom center) */}
            <div className="absolute bottom-6 left-28 z-10 w-32 sm:w-40 -rotate-3 hover:rotate-0 transition-transform duration-300">
              {/* Tape */}
              <div className="w-12 h-3.5 bg-white/75 backdrop-blur-xs border border-slate-300/60 shadow-xs mx-auto -mb-2 rotate-4 relative z-20"></div>
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80"
                alt="Textbooks"
                className="w-full h-24 sm:h-28 object-contain drop-shadow-md"
              />
            </div>

            {/* Yellow BUDGET WIN Starburst Sticker (bottom right) */}
            <div className="absolute bottom-10 right-14 z-20 rotate-6 transform">
              <div className="relative bg-[#E2F952] border-2 border-black rounded-lg px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black text-black tracking-wider uppercase block text-center">
                  BUDGET<br />WIN
                </span>
              </div>
            </div>

            {/* Hand-drawn note & arrow: "not landfill material" */}
            <div className="absolute -bottom-8 left-24 sm:left-32 z-30 flex items-center gap-1.5 pointer-events-none">
              <svg className="w-6 h-6 text-slate-800 -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12 C10 16, 14 8, 18 10" />
                <path d="M14 6 L18 10 L14 14" />
              </svg>
              <span className="font-handwriting text-lg sm:text-xl font-bold text-slate-800 tracking-wide select-none">
                not landfill material
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
