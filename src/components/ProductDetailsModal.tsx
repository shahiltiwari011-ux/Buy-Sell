import React from 'react';
import type { Product } from '../types';
import { X, MapPin, ShieldCheck, Heart, ArrowLeft, MessageSquare, Sparkles } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (productId: string) => void;
  onContactSeller: (product: Product) => void;
  onDirectMessage: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  isSaved,
  onClose,
  onToggleSave,
  onContactSeller,
  onDirectMessage
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white hover:bg-slate-100 border-2 border-black flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image with pastel background */}
          <div 
            className="relative flex items-center justify-center p-8 min-h-[320px] md:min-h-[460px] border-b-2 md:border-b-0 md:border-r-2 border-black"
            style={{ backgroundColor: product.imageBgColor || '#F1F5F9' }}
          >
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full max-h-[340px] object-contain drop-shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Badges on Top-Left */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {product.badge && (
                <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-black shadow-xs ${
                  product.badge === 'STEAL' ? 'bg-[#E2F952] text-black' :
                  product.badge === 'BARELY USED' ? 'bg-[#FECDD3] text-black' :
                  'bg-[#FB7185] text-white'
                }`}>
                  {product.badge}
                </span>
              )}
              {product.isUserCreated && (
                <span className="bg-[#E2F952] text-black text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-black shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Your Drop
                </span>
              )}
            </div>

            {/* Save Heart Button on Top-Right of image */}
            <button
              onClick={() => onToggleSave(product.id)}
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-800 border-2 border-black flex items-center justify-center shadow-xs cursor-pointer"
              title={isSaved ? "Saved" : "Save Item"}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Right Column: Specs & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Back breadcrumb */}
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-black mb-3 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to all drops
              </button>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-4xl font-black text-slate-900 tracking-tight">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                  Campus Price
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-3">
                {product.title}
              </h2>

              {/* Category & Condition tags */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-300">
                  {product.category}
                </span>
                <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-300">
                  {product.condition}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  About this item
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed bg-[#FCFBF7] p-3.5 rounded-2xl border-2 border-black/10">
                  {product.description}
                </p>
              </div>

              {/* Seller details box */}
              <div className="bg-slate-50 border-2 border-black rounded-2xl p-3.5 mb-6">
                <div className="flex items-center gap-3">
                  {product.sellerAvatar ? (
                    <img
                      src={product.sellerAvatar}
                      alt={product.sellerName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-black"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#E2F952] border-2 border-black text-xs font-bold flex items-center justify-center">
                      {product.sellerName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1">
                      {product.sellerName}
                      <ShieldCheck className="w-4 h-4 text-emerald-600" title="Campus verified student" />
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{product.sellerLocation || 'On campus'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => onDirectMessage(product)}
                className="w-full py-3 px-4 rounded-2xl font-black text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Message on campusloop
              </button>

              <button
                onClick={() => onContactSeller(product)}
                className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-slate-700 hover:text-black bg-white hover:bg-slate-50 border-2 border-black transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>WhatsApp, Email & Phone Options</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
