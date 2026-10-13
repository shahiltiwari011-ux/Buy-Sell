import React from 'react';
import type { Product } from '../types';
import { Heart, MapPin, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isSaved: boolean;
  onSelect: (product: Product) => void;
  onToggleSave: (productId: string, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSaved,
  onSelect,
  onToggleSave
}) => {
  const renderBadge = () => {
    if (product.badge) {
      if (product.badge === 'STEAL') {
        return (
          <span className="bg-[#E2F952] text-black font-black text-[10px] sm:text-[11px] tracking-wider uppercase px-2 py-0.5 rounded-md border border-black shadow-xs">
            {product.badge}
          </span>
        );
      }
      if (product.badge === 'BARELY USED') {
        return (
          <span className="bg-[#FECDD3] text-black font-black text-[10px] sm:text-[11px] tracking-wider uppercase px-2 py-0.5 rounded-md border border-black/20 shadow-xs">
            {product.badge}
          </span>
        );
      }
      if (product.badge === 'MAIN CHARACTER') {
        return (
          <span className="bg-[#FB7185] text-white font-black text-[10px] sm:text-[11px] tracking-wider uppercase px-2 py-0.5 rounded-md border border-black/20 shadow-xs">
            {product.badge}
          </span>
        );
      }
      return (
        <span className="bg-slate-900 text-white font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md shadow-xs">
          {product.badge}
        </span>
      );
    }

    if (product.isUserCreated) {
      return (
        <span className="bg-[#E2F952] text-black font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md border border-black flex items-center gap-1 shadow-xs">
          <Sparkles className="w-2.5 h-2.5" />
          YOUR DROP
        </span>
      );
    }

    return null;
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border-2 border-black overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col cursor-pointer"
    >
      {/* Image Container with pastel background */}
      <div 
        className="relative aspect-square w-full flex items-center justify-center p-4 overflow-hidden border-b-2 border-black"
        style={{ backgroundColor: product.imageBgColor || '#F1F5F9' }}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top-Left Badge (STEAL / BARELY USED / MAIN CHARACTER) */}
        <div className="absolute top-3 left-3 z-10">
          {renderBadge()}
        </div>

        {/* Top-Right Heart / Save Toggle Button */}
        <button
          onClick={(e) => onToggleSave(product.id, e)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-xs border border-black/15 transition-transform active:scale-90 cursor-pointer"
          title={isSaved ? "Remove from Saved" : "Save this item"}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'text-rose-500 fill-rose-500' : 'text-slate-800'
            }`} 
          />
        </button>
      </div>

      {/* Card Details Footer */}
      <div className="p-3.5 sm:p-4 bg-white flex flex-col justify-between flex-1 gap-2">
        {/* Row 1: Title and Price */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate group-hover:underline">
            {product.title}
          </h3>
          <span className="font-black text-slate-900 text-base sm:text-lg shrink-0">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Row 2: Location and Seller */}
        <div className="flex items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{product.sellerLocation || 'On campus'}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {product.sellerAvatar ? (
              <img
                src={product.sellerAvatar}
                alt={product.sellerName}
                className="w-5 h-5 rounded-full object-cover border border-slate-300"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#E2F952] border border-black text-[10px] font-bold flex items-center justify-center">
                {product.sellerName.charAt(0)}
              </div>
            )}
            <span className="font-semibold text-slate-800">{product.sellerName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
