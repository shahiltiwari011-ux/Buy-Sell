import { supabase } from './supabaseClient';
import type { RoommateListing, RoommateReport } from '../types';
import { INITIAL_ROOMMATES } from '../data/initialRoommates';

const STORAGE_KEY_LISTINGS = 'campusloop_roommate_listings_v1';
const STORAGE_KEY_BLOCKS = 'campusloop_roommate_blocks_v1';
const STORAGE_KEY_REPORTS = 'campusloop_roommate_reports_v1';

// Current logged in demo student user identity
export const CURRENT_STUDENT_USER_ID = 'current-student-user';
export const CURRENT_STUDENT_NAME = 'You (Student)';

export const roommateService = {
  isConfiguredWithSupabase: (): boolean => {
    return Boolean(supabase);
  },

  isDemoMode: (): boolean => {
    return !Boolean(supabase);
  },

  getCurrentUserId: (): string => {
    return CURRENT_STUDENT_USER_ID;
  },

  // --------------------------------------------------------------------------
  // LISTINGS
  // --------------------------------------------------------------------------
  getListings: async (type?: 'roommate' | 'room'): Promise<RoommateListing[]> => {
    // If Supabase is connected, query the remote PostgreSQL table
    if (supabase) {
      try {
        let query = supabase.from('roommate_listings').select('*').order('created_at', { ascending: false });
        if (type) {
          query = query.eq('listing_type', type);
        }
        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((row) => ({
            id: row.id,
            userId: row.user_id,
            listingType: row.listing_type,
            name: row.name,
            avatar: row.avatar,
            college: row.college,
            location: row.location,
            budget: Number(row.budget),
            moveInDate: row.move_in_date,
            roomType: row.room_type,
            genderPreference: row.gender_preference,
            lifestyleTags: row.lifestyle_tags || [],
            cleanliness: row.cleanliness,
            sleepSchedule: row.sleep_schedule,
            bio: row.bio,
            amenities: row.amenities || [],
            roomImages: row.room_images || [],
            contactEmail: row.contact_email,
            createdAt: row.created_at,
            isUserCreated: row.user_id === CURRENT_STUDENT_USER_ID
          }));
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local storage:', err);
      }
    }

    // LocalStorage fallback (clearly labeled Demo Mode)
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LISTINGS);
      let listings: RoommateListing[];
      if (!stored) {
        localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(INITIAL_ROOMMATES));
        listings = INITIAL_ROOMMATES;
      } else {
        listings = JSON.parse(stored);
        if (!Array.isArray(listings) || listings.length === 0) {
          localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(INITIAL_ROOMMATES));
          listings = INITIAL_ROOMMATES;
        }
      }

      if (type) {
        return listings.filter((l) => l.listingType === type);
      }
      return listings;
    } catch (err) {
      console.error('Failed reading roommate listings from local storage:', err);
      return INITIAL_ROOMMATES;
    }
  },

  createListing: async (
    data: Omit<RoommateListing, 'id' | 'createdAt' | 'isUserCreated' | 'userId'>
  ): Promise<RoommateListing> => {
    const newId = `listing-${Date.now()}`;
    const newListing: RoommateListing = {
      ...data,
      id: newId,
      userId: CURRENT_STUDENT_USER_ID,
      createdAt: new Date().toISOString(),
      isUserCreated: true
    };

    if (supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('roommate_listings')
          .insert({
            user_id: CURRENT_STUDENT_USER_ID,
            listing_type: data.listingType,
            name: data.name,
            avatar: data.avatar,
            college: data.college,
            location: data.location,
            budget: data.budget,
            move_in_date: data.moveInDate,
            room_type: data.roomType,
            gender_preference: data.genderPreference,
            lifestyle_tags: data.lifestyleTags,
            cleanliness: data.cleanliness,
            sleep_schedule: data.sleepSchedule,
            bio: data.bio,
            amenities: data.amenities,
            room_images: data.roomImages || [],
            contact_email: data.contactEmail
          })
          .select()
          .single();

        if (!error && inserted) {
          newListing.id = inserted.id;
        }
      } catch (err) {
        console.warn('Supabase insert failed, saving locally:', err);
      }
    }

    // Always update local storage for demo mode persistence
    const current = await roommateService.getListings();
    const updated = [newListing, ...current];
    try {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed saving to localStorage:', err);
    }

    return newListing;
  },

  updateListing: async (
    id: string,
    updates: Partial<Omit<RoommateListing, 'id' | 'createdAt' | 'userId' | 'isUserCreated'>>
  ): Promise<RoommateListing> => {
    if (supabase) {
      try {
        await supabase
          .from('roommate_listings')
          .update({
            ...(updates.listingType && { listing_type: updates.listingType }),
            ...(updates.name && { name: updates.name }),
            ...(updates.avatar && { avatar: updates.avatar }),
            ...(updates.college && { college: updates.college }),
            ...(updates.location && { location: updates.location }),
            ...(updates.budget !== undefined && { budget: updates.budget }),
            ...(updates.moveInDate && { move_in_date: updates.moveInDate }),
            ...(updates.roomType && { room_type: updates.roomType }),
            ...(updates.genderPreference && { gender_preference: updates.genderPreference }),
            ...(updates.lifestyleTags && { lifestyle_tags: updates.lifestyleTags }),
            ...(updates.cleanliness && { cleanliness: updates.cleanliness }),
            ...(updates.sleepSchedule && { sleep_schedule: updates.sleepSchedule }),
            ...(updates.bio && { bio: updates.bio }),
            ...(updates.amenities && { amenities: updates.amenities }),
            ...(updates.roomImages && { room_images: updates.roomImages }),
            ...(updates.contactEmail && { contact_email: updates.contactEmail })
          })
          .eq('id', id)
          .eq('user_id', CURRENT_STUDENT_USER_ID); // Enforce owner check
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }

    const current = await roommateService.getListings();
    let updatedItem: RoommateListing | null = null;
    const updated = current.map((item) => {
      if (item.id === id) {
        // Enforce that only the creator can edit their listing
        if (item.userId !== CURRENT_STUDENT_USER_ID && !item.isUserCreated) {
          throw new Error('Permission denied: You can only edit your own listings.');
        }
        updatedItem = { ...item, ...updates };
        return updatedItem;
      }
      return item;
    });

    if (!updatedItem) {
      throw new Error('Listing not found');
    }

    try {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed updating in localStorage:', err);
    }

    return updatedItem;
  },

  deleteListing: async (id: string): Promise<void> => {
    if (supabase) {
      try {
        await supabase
          .from('roommate_listings')
          .delete()
          .eq('id', id)
          .eq('user_id', CURRENT_STUDENT_USER_ID); // Enforce owner check
      } catch (err) {
        console.warn('Supabase delete failed:', err);
      }
    }

    const current = await roommateService.getListings();
    // Verify ownership before deleting
    const target = current.find((item) => item.id === id);
    if (target && target.userId !== CURRENT_STUDENT_USER_ID && !target.isUserCreated) {
      throw new Error('Permission denied: You can only delete your own listings.');
    }

    const filtered = current.filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(filtered));
    } catch (err) {
      console.error('Failed deleting from localStorage:', err);
    }
  },

  resetDemoData: async (): Promise<RoommateListing[]> => {
    try {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(INITIAL_ROOMMATES));
      localStorage.removeItem(STORAGE_KEY_BLOCKS);
      localStorage.removeItem(STORAGE_KEY_REPORTS);
    } catch (err) {
      console.error('Failed resetting roommate demo data:', err);
    }
    return INITIAL_ROOMMATES;
  },

  // --------------------------------------------------------------------------
  // USER SAFETY: BLOCKED USERS
  // --------------------------------------------------------------------------
  getBlockedUserIds: (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BLOCKS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  blockUser: async (userId: string): Promise<string[]> => {
    const current = roommateService.getBlockedUserIds();
    if (!current.includes(userId)) {
      const updated = [...current, userId];
      try {
        localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed saving blocked user:', err);
      }
      return updated;
    }
    return current;
  },

  unblockUser: async (userId: string): Promise<string[]> => {
    const current = roommateService.getBlockedUserIds();
    const updated = current.filter((id) => id !== userId);
    try {
      localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed unblocking user:', err);
    }
    return updated;
  },

  // --------------------------------------------------------------------------
  // USER SAFETY: REPORTING
  // --------------------------------------------------------------------------
  getReports: (): RoommateReport[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  reportListing: async (
    reportData: Omit<RoommateReport, 'id' | 'createdAt'>
  ): Promise<RoommateReport> => {
    const newReport: RoommateReport = {
      ...reportData,
      id: `report-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (supabase) {
      try {
        await supabase.from('roommate_reports').insert({
          listing_id: reportData.listingId,
          reporter_id: CURRENT_STUDENT_USER_ID,
          reason: reportData.reason,
          details: reportData.details
        });
      } catch (err) {
        console.warn('Supabase report submission failed:', err);
      }
    }

    const current = roommateService.getReports();
    const updated = [newReport, ...current];
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed storing report:', err);
    }

    return newReport;
  }
};
