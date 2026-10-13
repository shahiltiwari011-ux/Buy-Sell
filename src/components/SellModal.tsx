import React, { useState, useRef } from 'react';
import type { Category, Condition, Product } from '../types';
import { PRESET_IMAGE_OPTIONS } from '../data/initialProducts';
import { X, Upload, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (product: Omit<Product, 'id' | 'createdAt' | 'isUserCreated'>) => void;
}

const PASTEL_COLORS = [
  { label: 'Mint', hex: '#DCEEE2' },
  { label: 'Blush', hex: '#FEE5DF' },
  { label: 'Yellow', hex: '#FEF9C3' },
  { label: 'Oat', hex: '#EFECE6' },
  { label: 'Sand', hex: '#F5EFE6' },
  { label: 'Ivory', hex: '#F5EFEB' },
];

export const SellModal: React.FC<SellModalProps> = ({
  isOpen,
  onClose,
  onPublish
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Exclude<Category, 'All'>>('Books');
  const [condition, setCondition] = useState<Condition>('Like New');
  const [badge, setBadge] = useState<string>('STEAL');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGE_OPTIONS[0].url);
  const [imageBgColor, setImageBgColor] = useState(PRESET_IMAGE_OPTIONS[0].bgColor);
  const [sellerName, setSellerName] = useState('Maya');
  const [sellerEmail, setSellerEmail] = useState('maya.campus@edu');
  const [sellerPhone, setSellerPhone] = useState('+1 (555) 234-5678');
  const [sellerLocation, setSellerLocation] = useState('On campus');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Title is required';
    }
    if (!price) {
      errs.price = 'Price is required';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      errs.price = 'Enter a valid price';
    }
    if (!description.trim()) {
      errs.description = 'Description is required';
    }
    if (!imageUrl) {
      errs.imageUrl = 'Please select or upload a photo';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onPublish({
        title: title.trim(),
        price: Number(price),
        category,
        condition,
        badge: badge === 'NONE' ? undefined : badge,
        badgeType: badge === 'STEAL' ? 'yellow' : badge === 'BARELY USED' ? 'pink' : badge === 'MAIN CHARACTER' ? 'hotpink' : undefined,
        description: description.trim(),
        imageUrl,
        imageBgColor,
        sellerName: sellerName.trim() || 'Student',
        sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        sellerEmail: sellerEmail.trim() || 'student@campus.edu',
        sellerPhone: sellerPhone.trim() || '+1 (555) 000-0000',
        sellerLocation: sellerLocation.trim() || 'On campus',
      });
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setErrors(prev => {
          const next = { ...prev };
          delete next.imageUrl;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFillDemo = () => {
    setTitle('Calculus & Linear Algebra Notes');
    setPrice('250');
    setCategory('Books');
    setCondition('Like New');
    setBadge('STEAL');
    setDescription('Clean organized lecture notes & formula sheets for first semester. Spiral-bound with practice exam solutions.');
    setImageUrl(PRESET_IMAGE_OPTIONS[0].url);
    setImageBgColor('#DCEEE2');
    setSellerLocation('On campus');
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b-2 border-black bg-[#FCFBF7]">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Sell your stuff</h3>
            <p className="text-xs text-slate-500 font-medium">Post a new drop for classmates</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-black bg-[#E2F952] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo Drop</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border-2 border-black flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto bg-white">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
              Item Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="sell-drop-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Psychology textbooks, Sony headphones, City bike"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-black text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-50"
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<Category, 'All'>)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black text-sm font-medium bg-white text-slate-900 focus:outline-none"
              >
                <option value="Books">Books</option>
                <option value="Tech">Tech</option>
                <option value="Room">Room</option>
                <option value="Bikes">Bikes</option>
                <option value="Fits">Fits</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                Badge Sticker
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black text-sm font-medium bg-white text-slate-900 focus:outline-none"
              >
                <option value="STEAL">STEAL (Yellow)</option>
                <option value="BARELY USED">BARELY USED (Pink)</option>
                <option value="MAIN CHARACTER">MAIN CHARACTER (Hot Pink)</option>
                <option value="NONE">None</option>
              </select>
            </div>
          </div>

          {/* Price & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                Price (₹ INR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  id="sell-drop-price"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
                  }}
                  placeholder="250"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border-2 border-black text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-50"
                />
              </div>
              {errors.price && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                Location
              </label>
              <input
                type="text"
                value={sellerLocation}
                onChange={(e) => setSellerLocation(e.target.value)}
                placeholder="On campus"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-black text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              placeholder="Tell buyers why you love this and where you can meet on campus..."
              className="w-full px-4 py-2.5 rounded-xl border-2 border-black text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-50"
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.description}</p>}
          </div>

          {/* Background color & Photo selection */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
              Card Background Color
            </label>
            <div className="flex items-center gap-2 mb-3">
              {PASTEL_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setImageBgColor(c.hex)}
                  className={`w-7 h-7 rounded-full border-2 border-black transition-transform cursor-pointer ${
                    imageBgColor === c.hex ? 'scale-125 ring-2 ring-black' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>

            {/* Photo preview & upload */}
            <div 
              className="p-3 rounded-2xl border-2 border-black flex items-center gap-4"
              style={{ backgroundColor: imageBgColor }}
            >
              <div className="w-20 h-20 rounded-xl bg-white/70 border border-black/20 flex items-center justify-center overflow-hidden shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-contain p-1" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800 mb-1.5">Upload product photo or pick a sample</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border-2 border-black shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-2 grid grid-cols-6 gap-2">
              {PRESET_IMAGE_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setImageUrl(opt.url);
                    setImageBgColor(opt.bgColor);
                    if (opt.badge) setBadge(opt.badge);
                  }}
                  className={`p-1 rounded-xl border-2 border-black cursor-pointer transition-all ${
                    imageUrl === opt.url ? 'ring-2 ring-black scale-105' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: opt.bgColor }}
                  title={opt.label}
                >
                  <img src={opt.url} alt={opt.label} className="w-full h-8 object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-black cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="publish-drop-btn"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-2xl font-black text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? 'Posting Drop...' : 'Post Drop Now'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
