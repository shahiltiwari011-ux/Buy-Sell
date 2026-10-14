import { supabase } from './supabaseClient';
import type { RoommateListing, RoommateReport } from '../types';
import { INITIAL_ROOMMATES } from '../data/initialRoommates';

const STORAGE_KEY_LISTINGS = 'campusloop_roommate_listings_v1';
const STORAGE_KEY_BLOCKS = 'campusloop_roommate_blocks_v1';
const STORAGE_KEY_REPORTS = 'campusloop_roommate_reports_v1';

/** Maps a Supabase row to a RoommateListing */
function mapRow(row: Record<string, unknown>, currentUserId?: string): RoommateListing {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    listingType: row.listing_type as 'roommate' | 'room',
    name: row.name as string,
    avatar: (row.avatar as string) || '',
    college: row.college as string,
    location: row.location as string,
    budget: Number(row.budget),
    moveInDate: row.move_in_date as string,
    roomType: row.room_type as RoommateListing['roomType'],
    genderPreference: row.gender_preference as RoommateListing['genderPreference'],
    lifestyleTags: (row.lifestyle_tags as string[]) || [],
    cleanliness: (row.cleanliness as RoommateListing['cleanliness']) || 'Moderate',
    sleepSchedule: (row.sleep_schedule as RoommateListing['sleepSchedule']) || 'Flexible',
    bio: row.bio as string,
    amenities: (row.amenities as string[]) || [],
    roomImages: (row.room_images as string[]) || [],
    contactEmail: row.contact_email as string,
    createdAt: row.created_at as string,
    isUserCreated: currentUserId ? row.user_id === currentUserId : false,
  };
}

export const roommateService = {
  isConfiguredWithSupabase: (): boolean => {
    return Boolean(supabase);
  },

  isDemoMode: (): boolean => {
    return !Boolean(supabase);
  },

  // --------------------------------------------------------------------------
  // LISTINGS
  // --------------------------------------------------------------------------
  getListings: async (type?: 'roommate' | 'room', currentUserId?: string): Promise<RoommateListing[]> => {
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
          return data.map((row) => mapRow(row, currentUserId));
        }
        // If database is empty, fall through to localStorage for initial data
      } catch (err) {
        console.warn('[Roommate] Supabase query failed, falling back to local storage:', err);
      }
    }

    // LocalStorage fallback (Demo Mode)
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
      console.error('[Roommate] Failed reading listings from local storage:', err);
      return INITIAL_ROOMMATES;
    }
  },

  createListing: async (
    data: Omit<RoommateListing, 'id' | 'createdAt' | 'isUserCreated' | 'userId'>,
    userId?: string
  ): Promise<RoommateListing> => {
    // Supabase path (production)
    if (supabase && userId) {
      try {
        const { data: inserted, error } = await supabase
          .from('roommate_listings')
          .insert({
            user_id: userId,
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
            contact_email: data.contactEmail,
          })
          .select()
          .single();

        if (!error && inserted) {
          return mapRow(inserted, userId);
        }
        if (error) {
          console.warn('[Roommate] Supabase insert failed:', error.message);
          throw new Error(error.message);
        }
      } catch (err) {
        // Re-throw to let caller handle
        throw err;
      }
    }

    // LocalStorage fallback (demo mode)
    const demoUserId = 'demo-user';
    const newListing: RoommateListing = {
      ...data,
      id: `listing-${Date.now()}`,
      userId: userId || demoUserId,
      createdAt: new Date().toISOString(),
      isUserCreated: true,
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY_LISTINGS);
      const current: RoommateListing[] = stored ? JSON.parse(stored) : INITIAL_ROOMMATES;
      const updated = [newListing, ...current];
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    } catch (err) {
      console.error('[Roommate] Failed saving to localStorage:', err);
    }

    return newListing;
  },

  updateListing: async (
    id: string,
    updates: Partial<Omit<RoommateListing, 'id' | 'createdAt' | 'userId' | 'isUserCreated'>>,
    userId?: string
  ): Promise<RoommateListing> => {
    // Supabase path (production)
    if (supabase && userId) {
      try {
        const updatePayload: Record<string, unknown> = {};
        if (updates.listingType !== undefined) updatePayload.listing_type = updates.listingType;
        if (updates.name !== undefined) updatePayload.name = updates.name;
        if (updates.avatar !== undefined) updatePayload.avatar = updates.avatar;
        if (updates.college !== undefined) updatePayload.college = updates.college;
        if (updates.location !== undefined) updatePayload.location = updates.location;
        if (updates.budget !== undefined) updatePayload.budget = updates.budget;
        if (updates.moveInDate !== undefined) updatePayload.move_in_date = updates.moveInDate;
        if (updates.roomType !== undefined) updatePayload.room_type = updates.roomType;
        if (updates.genderPreference !== undefined) updatePayload.gender_preference = updates.genderPreference;
        if (updates.lifestyleTags !== undefined) updatePayload.lifestyle_tags = updates.lifestyleTags;
        if (updates.cleanliness !== undefined) updatePayload.cleanliness = updates.cleanliness;
        if (updates.sleepSchedule !== undefined) updatePayload.sleep_schedule = updates.sleepSchedule;
        if (updates.bio !== undefined) updatePayload.bio = updates.bio;
        if (updates.amenities !== undefined) updatePayload.amenities = updates.amenities;
        if (updates.roomImages !== undefined) updatePayload.room_images = updates.roomImages;
        if (updates.contactEmail !== undefined) updatePayload.contact_email = updates.contactEmail;

        const { data, error } = await supabase
          .from('roommate_listings')
          .update(updatePayload)
          .eq('id', id)
          .eq('user_id', userId) // RLS + client-side owner check
          .select()
          .single();

        if (error) throw new Error(error.message);
        if (data) return mapRow(data, userId);
      } catch (err) {
        throw err;
      }
    }

    // LocalStorage fallback (demo mode)
    const stored = localStorage.getItem(STORAGE_KEY_LISTINGS);
    const current: RoommateListing[] = stored ? JSON.parse(stored) : [];
    let updatedItem: RoommateListing | null = null;

    const updated = current.map((item) => {
      if (item.id === id) {
        if (!item.isUserCreated && item.userId !== (userId || 'demo-user')) {
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
      console.error('[Roommate] Failed updating in localStorage:', err);
    }

    return updatedItem;
  },

  deleteListing: async (id: string, userId?: string): Promise<void> => {
    // Supabase path (production)
    if (supabase && userId) {
      try {
        const { error } = await supabase
          .from('roommate_listings')
          .delete()
          .eq('id', id)
          .eq('user_id', userId); // RLS + client-side owner check
        if (error) throw new Error(error.message);
        return;
      } catch (err) {
        throw err;
      }
    }

    // LocalStorage fallback (demo mode)
    const stored = localStorage.getItem(STORAGE_KEY_LISTINGS);
    const current: RoommateListing[] = stored ? JSON.parse(stored) : [];
    const target = current.find((item) => item.id === id);
    if (target && !target.isUserCreated) {
      throw new Error('Permission denied: You can only delete your own listings.');
    }

    const filtered = current.filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(filtered));
    } catch (err) {
      console.error('[Roommate] Failed deleting from localStorage:', err);
    }
  },

  resetDemoData: async (): Promise<RoommateListing[]> => {
    try {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(INITIAL_ROOMMATES));
      localStorage.removeItem(STORAGE_KEY_BLOCKS);
      localStorage.removeItem(STORAGE_KEY_REPORTS);
    } catch (err) {
      console.error('[Roommate] Failed resetting demo data:', err);
    }
    return INITIAL_ROOMMATES;
  },

  // --------------------------------------------------------------------------
  // USER SAFETY: BLOCKED USERS
  // --------------------------------------------------------------------------
  getBlockedUserIds: async (userId?: string): Promise<string[]> => {
    // Supabase path: query the roommate_blocks table
    if (supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('roommate_blocks')
          .select('blocked_user_id')
          .eq('user_id', userId);
        if (error) throw error;
        return (data || []).map((row) => row.blocked_user_id as string);
      } catch (err) {
        console.warn('[Roommate] Failed fetching blocks from Supabase:', err);
      }
    }

    // LocalStorage fallback
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BLOCKS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  blockUser: async (blockedUserId: string, userId?: string): Promise<string[]> => {
    // Supabase path
    if (supabase && userId) {
      try {
        await supabase.from('roommate_blocks').insert({
          user_id: userId,
          blocked_user_id: blockedUserId,
        });
        return roommateService.getBlockedUserIds(userId);
      } catch (err) {
        console.warn('[Roommate] Supabase block failed:', err);
      }
    }

    // LocalStorage fallback
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BLOCKS);
      const current: string[] = stored ? JSON.parse(stored) : [];
      if (!current.includes(blockedUserId)) {
        const updated = [...current, blockedUserId];
        localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(updated));
        return updated;
      }
      return current;
    } catch (err) {
      console.error('[Roommate] Failed saving blocked user:', err);
      return [];
    }
  },

  unblockUser: async (blockedUserId: string, userId?: string): Promise<string[]> => {
    // Supabase path
    if (supabase && userId) {
      try {
        await supabase
          .from('roommate_blocks')
          .delete()
          .eq('user_id', userId)
          .eq('blocked_user_id', blockedUserId);
        return roommateService.getBlockedUserIds(userId);
      } catch (err) {
        console.warn('[Roommate] Supabase unblock failed:', err);
      }
    }

    // LocalStorage fallback
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BLOCKS);
      const current: string[] = stored ? JSON.parse(stored) : [];
      const updated = current.filter((id) => id !== blockedUserId);
      localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error('[Roommate] Failed unblocking user:', err);
      return [];
    }
  },

  // --------------------------------------------------------------------------
  // USER SAFETY: REPORTING
  // --------------------------------------------------------------------------
  reportListing: async (
    reportData: Omit<RoommateReport, 'id' | 'createdAt'>,
    reporterId?: string
  ): Promise<RoommateReport> => {
    const newReport: RoommateReport = {
      ...reportData,
      id: `report-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Supabase path
    if (supabase && reporterId) {
      try {
        await supabase.from('roommate_reports').insert({
          listing_id: reportData.listingId,
          reporter_id: reporterId,
          reason: reportData.reason,
          details: reportData.details,
        });
        return newReport;
      } catch (err) {
        console.warn('[Roommate] Supabase report submission failed:', err);
      }
    }

    // LocalStorage fallback
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
      const current: RoommateReport[] = stored ? JSON.parse(stored) : [];
      const updated = [newReport, ...current];
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
    } catch (err) {
      console.error('[Roommate] Failed storing report:', err);
    }

    return newReport;
  },
};
