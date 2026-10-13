import React from 'react';
import type { RoommateListing } from '../../types';
import { X, Ban, ShieldAlert } from 'lucide-react';

interface BlockConfirmModalProps {
  listing: RoommateListing | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBlock: (userId: string, userName: string) => void;
}

export const BlockConfirmModal: React.FC<BlockConfirmModalProps> = ({
  listing,
  isOpen,
  onClose,
  onConfirmBlock
}) => {
  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-slate-100 border-2 border-black text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-black flex items-center justify-center text-amber-700 mx-auto mb-3.5">
          <Ban className="w-6 h-6 stroke-[2.5]" />
        </div>

        <h3 className="text-xl font-black text-slate-900 text-center mb-1.5">
          Block {listing.name}?
        </h3>

        <p className="text-xs text-slate-600 text-center leading-relaxed mb-5">
          You will no longer see any listings or messages from <span className="font-bold text-slate-900">{listing.name}</span>. You can manage or unblock them at any time in safety settings.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-5 flex items-center gap-2 text-[11px] text-slate-600">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
          <span>This action immediately removes all their listings from your feed.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-black hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmBlock(listing.userId, listing.name);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl text-xs font-black bg-black hover:bg-slate-800 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Block User</span>
          </button>
        </div>
      </div>
    </div>
  );
};
