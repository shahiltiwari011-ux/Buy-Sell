import React, { useState } from 'react';
import type { Product } from '../types';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  ArrowLeft, 
  MessageSquare, 
  Sparkles,
  CheckCircle,
  RotateCcw,
  Trash2,
  Flag,
  AlertCircle
} from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (productId: string) => void;
  onContactSeller: (product: Product) => void;
  onDirectMessage: (product: Product) => void;
  onToggleSold?: (productId: string, isSold: boolean) => void;
  onDeleteProduct?: (productId: string) => void;
  onReportProduct?: (productId: string, reason: string, details: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  isSaved,
  onClose,
  onToggleSave,
  onContactSeller,
  onDirectMessage,
  onToggleSold,
  onDeleteProduct,
  onReportProduct,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Misleading or False Information');
  const [reportDetails, setReportDetails] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  if (!isOpen || !product) return null;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onReportProduct) {
      setIsReporting(true);
      onReportProduct(product.id, reportReason, reportDetails);
      setIsReporting(false);
      setShowReportModal(false);
      setReportDetails('');
    }
  };

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
              className={`w-full h-full max-h-[340px] object-contain drop-shadow-md transition-all ${
                product.isSold ? 'grayscale-[60%] opacity-75' : ''
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Badges on Top-Left */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {product.isSold && (
                <span className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-black shadow-xs">
                  SOLD
                </span>
              )}
              {product.badge && !product.isSold && (
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
              {/* Back breadcrumb & Report button */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-black cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to all drops
                </button>

                {!product.isUserCreated && (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Report this listing"
                  >
                    <Flag className="w-3 h-3" />
                    <span>Report</span>
                  </button>
                )}
              </div>

              {/* Sold Banner */}
              {product.isSold && (
                <div className="mb-3 p-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>This item has been marked as sold.</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className={`text-4xl font-black tracking-tight ${product.isSold ? 'line-through text-slate-400' : 'text-slate-900'}`}>
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
                      <span title="Campus verified student" className="inline-flex items-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </span>
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
              {/* Owner Controls */}
              {product.isUserCreated ? (
                <div className="space-y-2">
                  <button
                    onClick={() => onToggleSold?.(product.id, !product.isSold)}
                    className="w-full py-2.5 px-4 rounded-2xl font-black text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {product.isSold ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        Mark as Available
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Mark as Sold
                      </>
                    )}
                  </button>

                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-2 p-2 bg-rose-50 border-2 border-rose-300 rounded-2xl">
                      <span className="text-xs font-bold text-rose-800 flex-1 pl-2">Delete this listing?</span>
                      <button
                        onClick={() => {
                          onDeleteProduct?.(product.id);
                          setShowDeleteConfirm(false);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-black border border-black hover:bg-rose-700 cursor-pointer"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full py-2 px-4 rounded-2xl font-bold text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Listing
                    </button>
                  )}
                </div>
              ) : (
                /* Buyer Controls */
                <>
                  <button
                    onClick={() => onDirectMessage(product)}
                    className="w-full py-3 px-4 rounded-2xl font-black text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {product.isSold ? 'Inquire Anyway' : 'Message on campusloop'}
                  </button>

                  <button
                    onClick={() => onContactSeller(product)}
                    className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-slate-700 hover:text-black bg-white hover:bg-slate-50 border-2 border-black transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>WhatsApp, Email & Phone Options</span>
                  </button>
                </>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Flag className="w-5 h-5 text-rose-600" />
                Report Listing
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-7 h-7 rounded-full border border-black flex items-center justify-center hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-black text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#E2F952]"
                >
                  <option value="Misleading or False Information">Misleading or False Information</option>
                  <option value="Prohibited or Inappropriate Item">Prohibited or Inappropriate Item</option>
                  <option value="Scam or Suspicious Activity">Scam or Suspicious Activity</option>
                  <option value="Harassment or Offensive Content">Harassment or Offensive Content</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Details (Optional)</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={3}
                  placeholder="Provide any additional details..."
                  className="w-full p-2.5 rounded-xl border-2 border-black text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E2F952]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReporting}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 text-white border-2 border-black hover:bg-rose-700"
                >
                  {isReporting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
