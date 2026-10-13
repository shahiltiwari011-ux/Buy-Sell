import React, { useState, useEffect, useMemo } from 'react';
import type { 
  RoommateListing, 
  RoommateTab, 
  RoommateFiltersState 
} from '../../types';
import { roommateService } from '../../services/roommateService';
import { RoommateCard } from './RoommateCard';
import { PostAvailabilityForm } from './PostAvailabilityForm';
import { ContactRoommateModal } from './ContactRoommateModal';
import { ReportModal } from './ReportModal';
import { BlockConfirmModal } from './BlockConfirmModal';
import { 
  Users, 
  Building, 
  PlusCircle, 
  Filter, 
  X, 
  Search, 
  SearchX, 
  RotateCcw, 
  AlertCircle, 
  ShieldCheck,
  UserX,
  Sparkles
} from 'lucide-react';

interface RoommateFinderSectionProps {
  onDirectMessage: (name: string, college: string, text: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const INITIAL_FILTERS: RoommateFiltersState = {
  college: '',
  location: '',
  minBudget: '',
  maxBudget: '',
  moveInBefore: '',
  roomType: '',
  genderPreference: ''
};

export const RoommateFinderSection: React.FC<RoommateFinderSectionProps> = ({
  onDirectMessage,
  onShowToast
}) => {
  // Tab State
  const [activeTab, setActiveTab] = useState<RoommateTab>('find-roommate');

  // Listings & Filter Data State
  const [listings, setListings] = useState<RoommateListing[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<RoommateFiltersState>(INITIAL_FILTERS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Status states
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Action States
  const [contactingListing, setContactingListing] = useState<RoommateListing | null>(null);
  const [reportingListing, setReportingListing] = useState<RoommateListing | null>(null);
  const [blockingListing, setBlockingListing] = useState<RoommateListing | null>(null);
  const [editingListing, setEditingListing] = useState<RoommateListing | null>(null);
  const [deletingListing, setDeletingListing] = useState<RoommateListing | null>(null);
  const [showBlockedManager, setShowBlockedManager] = useState(false);

  const isDemo = roommateService.isDemoMode();

  // Load initial listings & blocked users
  const loadListings = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await roommateService.getListings();
      setListings(data);
      setBlockedUserIds(roommateService.getBlockedUserIds());
    } catch (err: unknown) {
      console.error('Error fetching roommate listings:', err);
      setErrorMessage('Could not load roommate listings. Please check your connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  // Filter listings based on active tab and filter state
  const filteredListings = useMemo(() => {
    const targetType = activeTab === 'find-roommate' ? 'roommate' : 'room';

    return listings.filter((item) => {
      // Exclude blocked users
      if (blockedUserIds.includes(item.userId)) {
        return false;
      }

      // Filter by tab type (roommate seeking vs room available)
      if (item.listingType !== targetType) {
        return false;
      }

      // College filter
      if (filters.college.trim()) {
        const qCollege = filters.college.toLowerCase().trim();
        if (!item.college.toLowerCase().includes(qCollege)) {
          return false;
        }
      }

      // Location filter
      if (filters.location.trim()) {
        const qLoc = filters.location.toLowerCase().trim();
        if (!item.location.toLowerCase().includes(qLoc)) {
          return false;
        }
      }

      // Min Budget
      if (filters.minBudget.trim()) {
        const min = Number(filters.minBudget);
        if (!isNaN(min) && item.budget < min) {
          return false;
        }
      }

      // Max Budget
      if (filters.maxBudget.trim()) {
        const max = Number(filters.maxBudget);
        if (!isNaN(max) && item.budget > max) {
          return false;
        }
      }

      // Move-in date filter (move-in on or before specified date)
      if (filters.moveInBefore.trim()) {
        if (new Date(item.moveInDate) > new Date(filters.moveInBefore)) {
          return false;
        }
      }

      // Room Type
      if (filters.roomType.trim() && filters.roomType !== 'All') {
        if (item.roomType !== filters.roomType) {
          return false;
        }
      }

      // Gender Preference
      if (filters.genderPreference.trim() && filters.genderPreference !== 'All') {
        if (item.genderPreference !== filters.genderPreference && item.genderPreference !== 'Any') {
          return false;
        }
      }

      return true;
    });
  }, [listings, blockedUserIds, activeTab, filters]);

  // Counts for tab badges
  const roommateCount = useMemo(() => {
    return listings.filter((l) => l.listingType === 'roommate' && !blockedUserIds.includes(l.userId)).length;
  }, [listings, blockedUserIds]);

  const roomCount = useMemo(() => {
    return listings.filter((l) => l.listingType === 'room' && !blockedUserIds.includes(l.userId)).length;
  }, [listings, blockedUserIds]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.college) count++;
    if (filters.location) count++;
    if (filters.minBudget) count++;
    if (filters.maxBudget) count++;
    if (filters.moveInBefore) count++;
    if (filters.roomType && filters.roomType !== 'All') count++;
    if (filters.genderPreference && filters.genderPreference !== 'All') count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Handlers for Save / Edit / Delete
  const handleSaveListing = async (
    listingData: Omit<RoommateListing, 'id' | 'createdAt' | 'isUserCreated' | 'userId'>
  ) => {
    try {
      if (editingListing) {
        const updated = await roommateService.updateListing(editingListing.id, listingData);
        setListings((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setEditingListing(null);
        onShowToast(`Listing for ${updated.name} updated successfully!`, 'success');
        // Switch to the relevant tab
        setActiveTab(updated.listingType === 'roommate' ? 'find-roommate' : 'find-room');
      } else {
        const created = await roommateService.createListing(listingData);
        setListings((prev) => [created, ...prev]);
        onShowToast(`🎉 Your listing is live on CampusLoop!`, 'success');
        // Switch to the relevant tab
        setActiveTab(created.listingType === 'roommate' ? 'find-roommate' : 'find-room');
      }
    } catch (err: unknown) {
      console.error('Error saving listing:', err);
      const msg = err instanceof Error ? err.message : 'Could not save listing.';
      onShowToast(msg, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingListing) return;
    try {
      await roommateService.deleteListing(deletingListing.id);
      setListings((prev) => prev.filter((item) => item.id !== deletingListing.id));
      onShowToast('Listing deleted successfully.', 'info');
    } catch (err: unknown) {
      console.error('Error deleting listing:', err);
      const msg = err instanceof Error ? err.message : 'Failed to delete listing.';
      onShowToast(msg, 'error');
    } finally {
      setDeletingListing(null);
    }
  };

  // Handler for Contact
  const handleDirectMessage = (listing: RoommateListing, message: string) => {
    onDirectMessage(listing.name, listing.college, message);
    onShowToast(`In-app message sent to ${listing.name}! Check your Messages tab.`, 'success');
  };

  // Handler for Safety Report
  const handleSubmitReport = async (listing: RoommateListing, reason: string, details: string) => {
    try {
      await roommateService.reportListing({
        listingId: listing.id,
        listingName: listing.name,
        reason,
        details
      });
      onShowToast(`Listing for ${listing.name} reported. Thank you for keeping campus safe.`, 'info');
    } catch (err) {
      console.error('Error reporting listing:', err);
      onShowToast('Failed to submit report.', 'error');
    }
  };

  // Handler for Blocking User
  const handleConfirmBlock = async (userId: string, userName: string) => {
    try {
      const updated = await roommateService.blockUser(userId);
      setBlockedUserIds(updated);
      onShowToast(`${userName} has been blocked. Their listings are now hidden.`, 'info');
    } catch (err) {
      console.error('Error blocking user:', err);
      onShowToast('Failed to block user.', 'error');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const updated = await roommateService.unblockUser(userId);
      setBlockedUserIds(updated);
      onShowToast('User unblocked.', 'info');
    } catch (err) {
      console.error('Error unblocking user:', err);
    }
  };

  const handleResetDemoData = async () => {
    const res = await roommateService.resetDemoData();
    setListings(res);
    setBlockedUserIds([]);
    setFilters(INITIAL_FILTERS);
    onShowToast('Roommate listings restored to initial demo data!', 'info');
  };

  return (
    <section id="roommate-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* 1. Header & Hero Catchphrase */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E2F952] border border-black rounded-full text-xs font-black uppercase tracking-wider mb-2.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              CAMPUS HOUSING HUB
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Find your ideal <span className="bg-[#E2F952] px-2 py-0.5 rounded-sm inline-block">roommate.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-bold mt-2">
              Verified college classmates. Zero brokerage fees. Clean & safe co-living.
            </p>
          </div>

          {/* Quick Action: Post Availability Button */}
          <div className="flex items-center gap-3 shrink-0">
            {activeTab !== 'post-availability' && (
              <button
                id="btn-post-availability-header"
                onClick={() => {
                  setEditingListing(null);
                  setActiveTab('post-availability');
                }}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Post Availability</span>
              </button>
            )}

            <button
              onClick={handleResetDemoData}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-black bg-slate-100 hover:bg-slate-200 rounded-xl border border-black/20 transition-colors cursor-pointer"
              title="Reset sample roommate listings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Backend Status Banner (Requirement 10: Clearly Labeled Demo Mode) */}
        <div className="mt-4 p-3 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold bg-[#FCFBF7] border-black/20">
          <div className="flex items-center gap-2">
            {isDemo ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="font-black text-slate-900">DEMO MODE:</span>
                <span className="text-slate-600 font-medium">
                  Listings & actions are stored locally in your browser. (Supabase credentials not configured in env; multi-user sync is disabled).
                </span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                <span className="font-black text-slate-900">SUPABASE BACKEND:</span>
                <span className="text-slate-600 font-medium">
                  Connected to PostgreSQL database with Row Level Security.
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-semibold shrink-0">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Phone Numbers Protected
            </span>
            {blockedUserIds.length > 0 && (
              <button
                onClick={() => setShowBlockedManager(true)}
                className="text-amber-800 underline hover:text-amber-950 flex items-center gap-1 cursor-pointer"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>{blockedUserIds.length} Blocked</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs (Requirement 3: Find a Roommate, Find a Room, Post Availability) */}
      <div className="flex items-center gap-2 sm:gap-3 border-b-2 border-slate-200 pb-4 mb-6 overflow-x-auto">
        <button
          id="tab-find-roommate"
          onClick={() => {
            setEditingListing(null);
            setActiveTab('find-roommate');
          }}
          className={`px-4 sm:px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'find-roommate'
              ? 'border-black bg-black text-white shadow-[3px_3px_0px_0px_rgba(226,249,82,1)]'
              : 'border-slate-200 bg-white hover:border-black text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Find a Roommate</span>
          <span className={`text-[11px] font-black px-2 py-0.2 rounded-full border ${
            activeTab === 'find-roommate' ? 'bg-[#E2F952] text-black border-black/20' : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}>
            {roommateCount}
          </span>
        </button>

        <button
          id="tab-find-room"
          onClick={() => {
            setEditingListing(null);
            setActiveTab('find-room');
          }}
          className={`px-4 sm:px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'find-room'
              ? 'border-black bg-black text-white shadow-[3px_3px_0px_0px_rgba(226,249,82,1)]'
              : 'border-slate-200 bg-white hover:border-black text-slate-700'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Find a Room</span>
          <span className={`text-[11px] font-black px-2 py-0.2 rounded-full border ${
            activeTab === 'find-room' ? 'bg-[#E2F952] text-black border-black/20' : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}>
            {roomCount}
          </span>
        </button>

        <button
          id="tab-post-availability"
          onClick={() => {
            setEditingListing(null);
            setActiveTab('post-availability');
          }}
          className={`px-4 sm:px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'post-availability'
              ? 'border-black bg-[#E2F952] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              : 'border-slate-200 bg-white hover:border-black text-slate-700'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Availability</span>
        </button>
      </div>

      {/* TAB 3: POST AVAILABILITY (FORM) */}
      {activeTab === 'post-availability' ? (
        <PostAvailabilityForm
          initialData={editingListing}
          isEditing={Boolean(editingListing)}
          onSave={handleSaveListing}
          onCancel={() => {
            setEditingListing(null);
            setActiveTab('find-roommate');
          }}
        />
      ) : (
        /* TABS 1 & 2: LISTINGS FEED WITH FILTERS */
        <div>
          
          {/* 3. Search & Filters Bar (Requirement 5: College, Location, Min/Max Budget, Move-in Date) */}
          <div className="bg-white rounded-2xl border-2 border-black p-4 sm:p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6">
            
            {/* Primary Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* College Filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="filter-college-input"
                  type="text"
                  value={filters.college}
                  onChange={(e) => setFilters({ ...filters, college: e.target.value })}
                  placeholder="Filter by College..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-black text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Location Filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="filter-location-input"
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  placeholder="Location (e.g. North Campus)..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-black text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Min & Max Budget Filter */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="font-bold text-slate-400 text-xs absolute left-3 top-3">₹</span>
                  <input
                    id="filter-min-budget-input"
                    type="number"
                    value={filters.minBudget}
                    onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
                    placeholder="Min Rent"
                    className="w-full pl-6 pr-2 py-2.5 rounded-xl border-2 border-slate-200 focus:border-black text-xs font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <span className="font-bold text-slate-400 text-xs absolute left-3 top-3">₹</span>
                  <input
                    id="filter-max-budget-input"
                    type="number"
                    value={filters.maxBudget}
                    onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                    placeholder="Max Rent"
                    className="w-full pl-6 pr-2 py-2.5 rounded-xl border-2 border-slate-200 focus:border-black text-xs font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggle Advanced Filters & Clear */}
              <div className="flex items-center gap-2">
                <button
                  id="toggle-advanced-filters-btn"
                  type="button"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    showAdvancedFilters || activeFiltersCount > 0
                      ? 'border-black bg-slate-100 text-slate-900 font-black'
                      : 'border-slate-200 hover:border-slate-400 text-slate-700'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{showAdvancedFilters ? 'Less Filters' : 'More Filters'}</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#E2F952] text-black text-[10px] px-1.5 py-0.2 rounded-full border border-black/20 font-black">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {activeFiltersCount > 0 && (
                  <button
                    id="clear-filters-btn"
                    type="button"
                    onClick={handleResetFilters}
                    className="p-2.5 rounded-xl border-2 border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Clear all filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

            {/* Advanced Filters Expandable Row */}
            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-100">
                
                {/* Move-in Date Filter */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Move-in On or Before
                  </label>
                  <input
                    type="date"
                    value={filters.moveInBefore}
                    onChange={(e) => setFilters({ ...filters, moveInBefore: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-black text-xs font-bold text-slate-900 bg-white focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Room Type
                  </label>
                  <select
                    value={filters.roomType}
                    onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-black text-xs font-bold text-slate-900 bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="">All Room Types</option>
                    <option value="Private Room">Private Room</option>
                    <option value="Shared Room">Shared Room</option>
                    <option value="Entire Apartment">Entire Apartment</option>
                  </select>
                </div>

                {/* Gender Preference */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Gender Preference
                  </label>
                  <select
                    value={filters.genderPreference}
                    onChange={(e) => setFilters({ ...filters, genderPreference: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-black text-xs font-bold text-slate-900 bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="">Any Gender Preference</option>
                    <option value="Female only">Female only</option>
                    <option value="Male only">Male only</option>
                    <option value="Non-binary">Non-binary friendly</option>
                  </select>
                </div>

              </div>
            )}

            {/* Active Filters Summary Chips */}
            {activeFiltersCount > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-bold text-[11px]">Active Filters:</span>
                {filters.college && (
                  <span className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                    College: {filters.college}
                    <button onClick={() => setFilters({ ...filters, college: '' })} className="hover:text-black">✕</button>
                  </span>
                )}
                {filters.location && (
                  <span className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                    Location: {filters.location}
                    <button onClick={() => setFilters({ ...filters, location: '' })} className="hover:text-black">✕</button>
                  </span>
                )}
                {(filters.minBudget || filters.maxBudget) && (
                  <span className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                    Budget: ₹{filters.minBudget || '0'} - ₹{filters.maxBudget || '∞'}
                    <button onClick={() => setFilters({ ...filters, minBudget: '', maxBudget: '' })} className="hover:text-black">✕</button>
                  </span>
                )}
                {filters.moveInBefore && (
                  <span className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                    Move-in by: {filters.moveInBefore}
                    <button onClick={() => setFilters({ ...filters, moveInBefore: '' })} className="hover:text-black">✕</button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-black text-rose-600 hover:underline ml-1 cursor-pointer"
                >
                  Reset All
                </button>
              </div>
            )}

          </div>

          {/* 4. Content Area: Loading, Error, Empty, or Cards Grid (Requirement 11) */}

          {/* LOADING STATE */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl border-2 border-black/20 p-5 space-y-4 animate-pulse shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-100 rounded-xl"></div>
                  <div className="h-16 bg-slate-100 rounded-xl"></div>
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            /* ERROR STATE */
            <div className="bg-rose-50 border-2 border-black rounded-3xl p-8 text-center max-w-md mx-auto my-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-12 h-12 rounded-2xl bg-rose-200 border-2 border-black flex items-center justify-center mx-auto mb-3 text-rose-700">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Failed to load listings</h3>
              <p className="text-xs text-slate-600 font-medium mb-4">{errorMessage}</p>
              <button
                onClick={loadListings}
                className="px-4 py-2 bg-black text-white font-black text-xs rounded-xl border-2 border-black hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : filteredListings.length > 0 ? (
            /* LISTINGS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <RoommateCard
                  key={listing.id}
                  listing={listing}
                  isOwner={listing.userId === roommateService.getCurrentUserId() || Boolean(listing.isUserCreated)}
                  onContact={(l) => setContactingListing(l)}
                  onEdit={(l) => {
                    setEditingListing(l);
                    setActiveTab('post-availability');
                  }}
                  onDelete={(l) => setDeletingListing(l)}
                  onReport={(l) => setReportingListing(l)}
                  onBlock={(l) => setBlockingListing(l)}
                />
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="bg-white rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-10 text-center max-w-md mx-auto my-10">
              <div className="w-16 h-16 rounded-2xl bg-[#E2F952] border-2 border-black flex items-center justify-center mx-auto mb-4 text-black">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No listings found</h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 font-medium leading-relaxed">
                {activeFiltersCount > 0
                  ? "We couldn't find any roommate profiles matching your current filters. Try clearing some criteria or expanding your budget range."
                  : activeTab === 'find-roommate'
                  ? "No roommates currently listed. Be the first student to post your roommate availability!"
                  : "No rooms currently listed. Be the first to post your room availability!"}
              </p>
              <div className="flex items-center justify-center gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white border-2 border-black hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingListing(null);
                    setActiveTab('post-availability');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-[#E2F952] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                >
                  Post Availability ↗
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 5. Modals & Dialogs */}
      
      {/* Contact Modal (Requirement 7: Phone privacy protection) */}
      <ContactRoommateModal
        listing={contactingListing}
        isOpen={Boolean(contactingListing)}
        onClose={() => setContactingListing(null)}
        onSendDirectMessage={handleDirectMessage}
      />

      {/* Report Modal (Requirement 8: User safety reporting) */}
      <ReportModal
        listing={reportingListing}
        isOpen={Boolean(reportingListing)}
        onClose={() => setReportingListing(null)}
        onSubmitReport={handleSubmitReport}
      />

      {/* Block Confirm Modal (Requirement 8: User blocking) */}
      <BlockConfirmModal
        listing={blockingListing}
        isOpen={Boolean(blockingListing)}
        onClose={() => setBlockingListing(null)}
        onConfirmBlock={handleConfirmBlock}
      />

      {/* Delete Confirmation Modal (Requirement 6: Delete own listing) */}
      {deletingListing && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="relative w-full max-w-sm bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black text-slate-900 mb-2">Delete this listing?</h3>
            <p className="text-xs text-slate-600 mb-5 font-medium leading-relaxed">
              Are you sure you want to delete your availability listing for <span className="font-bold text-slate-900">{deletingListing.location}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingListing(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-black hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-rose-500 hover:bg-rose-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blocked Users Manager Drawer / Modal */}
      {showBlockedManager && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-900">Blocked Students</h3>
              <button
                onClick={() => setShowBlockedManager(false)}
                className="w-8 h-8 rounded-full border-2 border-black hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4 font-medium">
              Listings from these student IDs are hidden from your feed. You can unblock them anytime.
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {blockedUserIds.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  <span className="text-slate-800 truncate max-w-[200px]">Student ID: {id}</span>
                  <button
                    onClick={() => handleUnblockUser(id)}
                    className="text-xs text-rose-600 hover:underline font-black cursor-pointer"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
