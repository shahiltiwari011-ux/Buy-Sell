import React, { useState } from 'react';
import type { RoommateListing } from '../../types';
import { X, ShieldCheck, Mail, MessageSquare, Copy, Check, Lock, GraduationCap, MapPin } from 'lucide-react';

interface ContactRoommateModalProps {
  listing: RoommateListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSendDirectMessage: (listing: RoommateListing, message: string) => void;
}

export const ContactRoommateModal: React.FC<ContactRoommateModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSendDirectMessage
}) => {
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !listing) return null;

  const defaultIntro = listing.listingType === 'roommate'
    ? `Hi ${listing.name}! I saw your roommate profile for ${listing.location} (budget ₹${listing.budget.toLocaleString('en-IN')}/mo) on CampusLoop. I'm also looking for a flatmate near ${listing.college}. Would you be free to connect and chat?`
    : `Hi ${listing.name}! I saw your available ${listing.roomType} in ${listing.location} (₹${listing.budget.toLocaleString('en-IN')}/mo) on CampusLoop. I'm a student at ${listing.college} looking to move in around ${listing.moveInDate}. Is it still available to view?`;

  const messageToSend = customMessage.trim() || defaultIntro;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageToSend);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendInApp = () => {
    onSendDirectMessage(listing, messageToSend);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1200);
  };

  const mailSubject = `CampusLoop Roommate Inquiry: ${listing.location}`;
  const mailtoUrl = `mailto:${listing.contactEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(messageToSend)}`;

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
        <div className="flex items-center gap-3.5 mb-5">
          <div className="relative">
            <img
              src={listing.avatar}
              alt={listing.name}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#E2F952] border border-black rounded-full p-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 leading-tight">Connect with {listing.name}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium mt-0.5">
              <span className="flex items-center gap-1 truncate max-w-[200px]">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {listing.college}
              </span>
            </div>
          </div>
        </div>

        {/* Privacy Protection Notice */}
        <div className="bg-[#FEFCE8] border-2 border-[#CA8A04]/40 rounded-2xl p-3 mb-5 flex items-start gap-2.5 text-xs text-amber-900">
          <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="font-medium leading-relaxed">
            <span className="font-black text-amber-950">Campus Privacy Shield:</span> Personal phone numbers are kept private and never exposed publicly. Communicate safely via verified student in-app messaging or university email relay.
          </div>
        </div>

        {/* Listing Mini Card */}
        <div className="bg-slate-50 rounded-2xl border-2 border-black/15 p-3.5 mb-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              {listing.listingType === 'roommate' ? 'Roommate Seeking' : 'Room Available'} • {listing.roomType}
            </div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {listing.location}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Budget / Rent</div>
            <div className="text-base font-black text-slate-900">₹{listing.budget.toLocaleString('en-IN')}<span className="text-xs font-semibold text-slate-500">/mo</span></div>
          </div>
        </div>

        {/* Message Input / Template */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700">
              Your Message
            </label>
            <button
              onClick={handleCopy}
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
          <textarea
            rows={3}
            value={customMessage || defaultIntro}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full p-3 bg-white text-slate-800 text-xs sm:text-sm rounded-xl border-2 border-black/20 focus:border-black focus:outline-none transition-colors font-medium leading-relaxed resize-none"
            placeholder="Type your message to this student..."
          />
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleSendInApp}
            disabled={isSent}
            className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isSent ? 'bg-emerald-400' : 'bg-[#E2F952] hover:bg-[#d5ee40]'
            }`}
          >
            {isSent ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Message Sent to CampusLoop Inbox!</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                <span>Send In-App Campus Message</span>
              </>
            )}
          </button>

          <a
            href={mailtoUrl}
            className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-slate-800 bg-white hover:bg-slate-50 border-2 border-black transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-700" />
              <span>Contact via Verified Student Email Relay</span>
            </div>
            <span className="text-xs font-semibold text-slate-500 truncate max-w-[170px]">
              {listing.contactEmail}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
