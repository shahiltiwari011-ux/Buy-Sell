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
