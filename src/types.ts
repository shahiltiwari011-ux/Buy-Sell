export type Category = 
  | 'All'
  | 'Books'
  | 'Tech'
  | 'Room'
  | 'Bikes'
  | 'Fits'
  | 'Other';

export type Condition = 'Like New' | 'Barely Used' | 'Good Condition' | 'Fair Condition';

export interface Product {
  id: string;
  title: string;
  price: number;
  category: Exclude<Category, 'All'>;
  condition: Condition;
  badge?: string; // 'STEAL' | 'BARELY USED' | 'MAIN CHARACTER'
  badgeType?: 'yellow' | 'pink' | 'hotpink';
  description: string;
  imageUrl: string;
  imageBgColor?: string; // pastel container background color
  sellerName: string;
  sellerAvatar?: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerLocation: string; // e.g. "On campus"
  createdAt: string;
  isUserCreated?: boolean;
  isSold?: boolean;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

export interface MessageThread {
  id: string;
  productId?: string;
  productTitle?: string;
  sellerName: string;
  sellerAvatar?: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  messages: {
    id: string;
    sender: 'user' | 'seller';
    text: string;
    time: string;
  }[];
}

// ==========================================
// Roommate Finder Feature Types
// ==========================================

export type RoommateTab = 'find-roommate' | 'find-room' | 'post-availability';

export type RoomType = 'Private Room' | 'Shared Room' | 'Entire Apartment';

export type GenderPreference = 'Any' | 'Female only' | 'Male only' | 'Non-binary';

export type Cleanliness = 'Very Neat' | 'Moderate' | 'Relaxed';

export type SleepSchedule = 'Early Bird' | 'Night Owl' | 'Flexible';

export interface RoommateListing {
  id: string;
  userId: string;
  listingType: 'roommate' | 'room';
  name: string;
  avatar: string;
  college: string;
  location: string;
  budget: number; // Monthly budget or rent in ₹
  moveInDate: string; // YYYY-MM-DD
  roomType: RoomType;
  genderPreference: GenderPreference;
  lifestyleTags: string[];
  cleanliness: Cleanliness;
  sleepSchedule: SleepSchedule;
  bio: string;
  amenities: string[];
  roomImages?: string[];
  contactEmail: string; // Protected email relay (no public phone numbers!)
  createdAt: string;
  isUserCreated?: boolean;
}

export interface RoommateFiltersState {
  college: string;
  location: string;
  minBudget: string;
  maxBudget: string;
  moveInBefore: string;
  roomType: string;
  genderPreference: string;
}

export interface RoommateReport {
  id: string;
  listingId: string;
  listingName: string;
  reason: string;
  details: string;
  createdAt: string;
}

