import React, { useState } from 'react';
import type { RoommateListing } from '../../types';
import { 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Flag, 
  Ban, 
  MessageSquare,
  Home,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface RoommateCardProps {
  listing: RoommateListing;
  isOwner: boolean;
  onContact: (listing: RoommateListing) => void;
  onEdit: (listing: RoommateListing) => void;
  onDelete: (listing: RoommateListing) => void;
  onReport: (listing: RoommateListing) => void;
  onBlock: (listing: RoommateListing) => void;
}

export const RoommateCard: React.FC<RoommateCardProps> = ({
  listing,
  isOwner,
  onContact,
  onEdit,
  onDelete,
  onReport,
  onBlock
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSafetyMenu, setShowSafetyMenu] = useState(false);

  // Format move-in date nicely (e.g. Nov 1, 2026)
  const formattedDate = (() => {
    try {
      const d = new Date(listing.moveInDate);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return listing.moveInDate;
    }
  })();

  return (
    <div className="group bg-white rounded-2xl border-2 border-black overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
      
      {/* Top Banner / Room Image (if available) or Pastel Header */}
      {listing.roomImages && listing.roomImages.length > 0 ? (
        <div className="relative aspect-video w-full overflow-hidden border-b-2 border-black bg-slate-100">
          <img
            src={listing.roomImages[0]}
            alt={`Room in ${listing.location}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {/* Badge: Room Available */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#E2F952] text-black font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md border border-black shadow-xs flex items-center gap-1">
              <Home className="w-3 h-3" />
              ROOM AVAILABLE
            </span>
          </div>

          {/* Owner badge */}
          {isOwner && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-white text-black font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md border border-black shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                YOUR LISTING
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-[#FCFBF7] border-b-2 border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="bg-black text-white font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md shadow-xs">
              {listing.listingType === 'roommate' ? 'ROOMMATE SEEKING' : 'ROOM AVAILABLE'}
            </span>
            <span className="bg-slate-100 text-slate-800 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md border border-black/15">
              {listing.roomType}
            </span>
          </div>

          {isOwner && (
            <span className="bg-[#E2F952] text-black font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md border border-black shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              YOUR LISTING
            </span>
          )}
        </div>
      )}

      {/* Main Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Profile Info Header */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={listing.avatar}
                  alt={listing.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-slate-100"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#E2F952] border border-black rounded-full p-0.5" title="Verified Campus Student">
                  <ShieldCheck className="w-3 h-3 text-black" />
                </div>
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight flex items-center gap-1.5">
                  <span>{listing.name}</span>
                </h3>
                <div className="flex items-center gap-1 text-slate-600 font-medium text-xs mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate max-w-[190px]" title={listing.college}>{listing.college}</span>
                </div>
              </div>
            </div>

            {/* Budget Display */}
            <div className="text-right shrink-0">
              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                ₹{listing.budget.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                per month
              </div>
            </div>
          </div>

          {/* Location & Move-in Meta Bar */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate" title={listing.location}>{listing.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-bold justify-end">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Badges: Room Type, Gender Preference, Cleanliness */}
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-lg">
              {listing.roomType}
            </span>
            <span className="bg-[#FEE5DF] border border-black/15 text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-lg">
              {listing.genderPreference}
            </span>
            <span className="bg-[#DCEEE2] border border-black/15 text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-lg">
              {listing.cleanliness}
            </span>
            <span className="bg-[#FEF9C3] border border-black/15 text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-lg">
              {listing.sleepSchedule}
            </span>
          </div>

          {/* Lifestyle Tags */}
          {listing.lifestyleTags && listing.lifestyleTags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {listing.lifestyleTags.slice(0, isExpanded ? undefined : 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200/80"
                >
                  #{tag}
                </span>
              ))}
              {!isExpanded && listing.lifestyleTags.length > 3 && (
                <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                  +{listing.lifestyleTags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Amenities (if room listing) */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {listing.amenities.slice(0, isExpanded ? undefined : 2).map((amenity, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-200"
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {amenity}
                </span>
              ))}
              {!isExpanded && listing.amenities.length > 2 && (
                <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                  +{listing.amenities.length - 2} more amenities
                </span>
              )}
            </div>
          )}

          {/* Short Introduction / Bio */}
          <div className="mt-3 text-xs text-slate-600 leading-relaxed font-medium">
            <p className={isExpanded ? '' : 'line-clamp-2'}>
              "{listing.bio}"
            </p>
            {listing.bio.length > 100 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[11px] font-bold text-black hover:underline mt-1 inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>

        {/* Card Footer: Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          
          {/* Owner Actions vs Standard Actions */}
          {isOwner ? (
            <div className="flex items-center gap-2 w-full">
              <button
                type="button"
                onClick={() => onEdit(listing)}
                className="flex-1 py-2 px-3 rounded-xl font-black text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 border-2 border-black/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Listing</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(listing)}
                className="py-2 px-3 rounded-xl font-black text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Delete your listing"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Primary Contact Button (Protects phone numbers, opens in-app / relay message) */}
              <button
                type="button"
                onClick={() => onContact(listing)}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Contact {listing.name.split(' ')[0]}</span>
              </button>

              {/* Safety Options: Flag / Block */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSafetyMenu(!showSafetyMenu)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-black text-slate-500 hover:text-black transition-colors cursor-pointer"
                  title="Safety & reporting options"
                >
                  <Flag className="w-4 h-4" />
                </button>

                {showSafetyMenu && (
                  <div 
                    className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowSafetyMenu(false);
                        onReport(listing);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-rose-50 text-rose-700 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5 shrink-0" />
                      <span>Report Listing</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSafetyMenu(false);
                        onBlock(listing);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-100 text-slate-800 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                      <span>Block Student</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
};
