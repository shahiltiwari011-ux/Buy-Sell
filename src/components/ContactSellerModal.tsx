import React, { useState } from 'react';
import type { Product } from '../types';
import { X, MessageCircle, Mail, Phone, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface ContactSellerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSellerModal: React.FC<ContactSellerModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const defaultMessage = `Hi ${product.sellerName}, I saw your drop for "${product.title}" (₹${product.price.toLocaleString('en-IN')}) on campusloop. Are you free to meet on campus today?`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(defaultMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const cleanPhone = product.sellerPhone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;
  const mailSubject = `campusloop Inquiry: ${product.title}`;
  const mailtoUrl = `mailto:${product.sellerEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-7 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-slate-100 border-2 border-black text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#E2F952] border-2 border-black flex items-center justify-center text-black">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 leading-tight">Connect with {product.sellerName}</h3>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified campus seller • {product.sellerLocation || 'On campus'}
            </p>
          </div>
        </div>

        {/* Product summary snippet */}
        <div 
          className="flex items-center gap-3 p-3 rounded-2xl border-2 border-black mb-5"
          style={{ backgroundColor: product.imageBgColor || '#F1F5F9' }}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-12 h-12 rounded-xl object-contain bg-white/70 p-1 border border-black/20 shrink-0"
          />
          <div className="overflow-hidden">
            <div className="font-bold text-xs text-slate-900 truncate">{product.title}</div>
            <div className="text-xs font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Pre-formatted message */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700">Pre-composed campus pickup text</label>
            <button
              onClick={handleCopyMessage}
              className="inline-flex items-center gap-1 text-[11px] font-black text-black hover:underline cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3 bg-[#FCFBF7] text-slate-800 text-xs rounded-xl border-2 border-black/15 font-mono leading-relaxed">
            "{defaultMessage}"
          </div>
        </div>

        {/* Direct Contact triggers */}
        <div className="space-y-2.5 mb-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">💬</span>
              <span>Open in WhatsApp</span>
            </div>
            <div className="flex items-center gap-1 text-black text-xs font-bold">
              <span>{product.sellerPhone}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          <a
            href={mailtoUrl}
            className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-slate-900 bg-white hover:bg-slate-50 border-2 border-black transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-slate-700" />
              <span>Send Student Email</span>
            </div>
            <span className="text-xs font-medium text-slate-500 truncate max-w-[180px]">{product.sellerEmail}</span>
          </a>

          <a
            href={`tel:${product.sellerPhone}`}
            className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 border-2 border-black/30 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-600" />
              <span>Call Seller</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">{product.sellerPhone}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
