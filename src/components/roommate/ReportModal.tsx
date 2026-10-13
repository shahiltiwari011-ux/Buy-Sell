import React, { useState } from 'react';
import type { RoommateListing } from '../../types';
import { X, Flag, AlertTriangle, Check } from 'lucide-react';

interface ReportModalProps {
  listing: RoommateListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (listing: RoommateListing, reason: string, details: string) => void;
}

const REPORT_REASONS = [
  'Suspected scam or fraudulent listing',
  'Harassment, abusive, or discriminatory behavior',
  'Inaccurate or misleading rent/photos',
  'Commercial landlord or broker (not a university student)',
  'Inappropriate or offensive content',
  'Duplicate or spam listing'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSubmitReport
}) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(listing, selectedReason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-7 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-slate-100 border-2 border-black text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 border-2 border-black flex items-center justify-center text-rose-600">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 leading-tight">Report Listing</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Reviewing profile for <span className="font-bold text-slate-800">{listing.name}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          CampusLoop is committed to a safe, trusted student community. Reports are reviewed by safety moderators within 24 hours.
        </p>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-black flex items-center justify-center mx-auto text-emerald-700">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Report Submitted</h4>
            <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto">
              Thank you for keeping campus housing safe. Our team has flagged this listing for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                Reason for Report
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 cursor-pointer transition-colors text-xs font-medium ${
                      selectedReason === reason
                        ? 'border-black bg-rose-50 text-slate-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="report_reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-black w-3.5 h-3.5"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Additional Context (Optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Share any specifics, links, or details..."
                className="w-full p-2.5 bg-slate-50 border-2 border-slate-200 focus:border-black rounded-xl text-xs font-medium text-slate-800 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-black hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-rose-500 hover:bg-rose-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
