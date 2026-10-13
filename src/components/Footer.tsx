import React from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onResetDemo: () => void;
  onOpenSellModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onResetDemo, onOpenSellModal }) => {
  return (
    <footer className="mt-16 bg-white border-t-2 border-black">
      
      {/* Centered Catchphrase from Design */}
      <div className="py-12 px-4 text-center border-b-2 border-black bg-[#FCFBF7]">
        <p className="font-handwriting text-2xl sm:text-3xl font-bold text-slate-800 tracking-wide select-none">
          good stuff deserves a second semester.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & description */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                <polyline points="21 3 21 9 15 9" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              campusloop
            </span>
            <span className="text-xs text-slate-400 font-medium ml-2">
              © {new Date().getFullYear()} • College Peer Marketplace
            </span>
          </div>

          {/* Guidelines & Safety */}
          <div className="flex items-center gap-6 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Direct On-Campus Handover
            </span>
            <span>Zero Platform Fees</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-black bg-slate-100 hover:bg-slate-200 rounded-xl border border-black/20 transition-colors cursor-pointer"
              title="Reset sample listings to demo state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Demo Drops</span>
            </button>

            <button
              onClick={onOpenSellModal}
              className="px-4 py-1.5 rounded-xl font-black text-xs text-black bg-[#E2F952] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            >
              Sell your stuff ↗
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
