import type { Product, MessageThread } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Psychology textbooks',
    price: 240,
    category: 'Books',
    condition: 'Like New',
    badge: 'STEAL',
    badgeType: 'yellow',
    description: 'Intro to Clinical & Cognitive Psychology (3rd & 4th Ed). Super clean pages with barely any highlight marks. Perfect for psych 101/102. Can meet near campus library.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    imageBgColor: '#DCEEE2',
    sellerName: 'Maya',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    sellerEmail: 'maya.psych25@campus.edu',
    sellerPhone: '+91 98765 43210',
    sellerLocation: 'On campus',
    createdAt: '2026-10-12T14:30:00.000Z',
    isUserCreated: false
  },
  {
    id: 'prod-2',
    title: 'Sony headphones',
    price: 850,
    category: 'Tech',
    condition: 'Barely Used',
    badge: 'BARELY USED',
    badgeType: 'pink',
    description: 'Sony WH-CH720N Wireless Noise Canceling headphones in matte black. 35h battery life, incredible for campus study sessions and gym. Comes with original USB-C cable and pouch.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    imageBgColor: '#FEE5DF',
    sellerName: 'Daniel',
    sellerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80',
    sellerEmail: 'daniel.eng24@campus.edu',
    sellerPhone: '+91 98123 45678',
    sellerLocation: 'On campus',
    createdAt: '2026-10-12T13:15:00.000Z',
    isUserCreated: false
  },
  {
    id: 'prod-3',
    title: 'city bike',
    price: 1800,
    category: 'Bikes',
    condition: 'Good Condition',
    badge: undefined,
    description: 'Sage green single-speed city commuter bike with brown leather saddle and front rack. Brakes and chain recently serviced at the campus bike co-op. Rides super smooth across quad.',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    imageBgColor: '#FEF9C3',
    sellerName: 'Priya',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
    sellerEmail: 'priya.des25@campus.edu',
    sellerPhone: '+91 99001 22334',
    sellerLocation: 'On campus',
    createdAt: '2026-10-12T11:45:00.000Z',
    isUserCreated: false
  },
  {
    id: 'prod-4',
    title: 'desk & chair',
    price: 650,
    category: 'Room',
    condition: 'Good Condition',
    badge: undefined,
    description: 'Compact wooden dorm study desk with matching ergonomic forest green chair. Sturdy, fits in tight dorm rooms, no wobbles. Can help carry down from North Hall.',
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    imageBgColor: '#EFECE6',
    sellerName: 'Ethan',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    sellerEmail: 'ethan.arch24@campus.edu',
    sellerPhone: '+91 97112 33445',
    sellerLocation: 'On campus',
    createdAt: '2026-10-12T10:30:00.000Z',
    isUserCreated: false
  },
  {
    id: 'prod-5',
    title: 'Denim jacket',
    price: 400,
    category: 'Fits',
    condition: 'Like New',
    badge: undefined,
    description: 'Classic light-wash vintage denim jacket (Size Medium unisex). 100% heavyweight cotton, great layering piece for chilly morning lecture halls. Freshly laundered.',
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    imageBgColor: '#F5EFE6',
    sellerName: 'Alex',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    sellerEmail: 'alex.bio26@campus.edu',
    sellerPhone: '+91 98450 98765',
    sellerLocation: 'On campus',
    createdAt: '2026-10-12T09:00:00.000Z',
    isUserCreated: false
  },
  {
    id: 'prod-6',
    title: 'Desk lamp',
    price: 180,
    category: 'Room',
    condition: 'Like New',
    badge: undefined,
    description: 'Sage green adjustable architect desk lamp with heavy solid base and warm LED bulb included. Great focused light for late-night studying without waking roommates.',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    imageBgColor: '#F6EADB',
    sellerName: 'Sam',
    sellerAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&h=120&q=80',
    sellerEmail: 'sam.cs25@campus.edu',
    sellerPhone: '+91 98711 00224',
    sellerLocation: 'On campus',
    createdAt: '2026-10-12T08:15:00.000Z',
    isUserCreated: false
  },
  {
    id: 'prod-7',
    title: 'Canon camera',
    price: 3500,
    category: 'Tech',
    condition: 'Barely Used',
    badge: 'MAIN CHARACTER',
    badgeType: 'hotpink',
    description: 'Canon EOS Rebel DSLR with 18-55mm IS II lens, battery charger, and 64GB high speed SD card. Taken on two campus film club shoots. Flawless sensor and lens glass.',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    imageBgColor: '#F5EFEB',
    sellerName: 'Jo',
    sellerAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&h=120&q=80',
    sellerEmail: 'jo.media25@campus.edu',
    sellerPhone: '+91 98334 45566',
    sellerLocation: 'On campus',
    createdAt: '2026-10-12T07:45:00.000Z',
    isUserCreated: false
  },
  {
    id: 'prod-8',
    title: 'Backpack',
    price: 700,
    category: 'Fits',
    condition: 'Like New',
    badge: undefined,
    description: 'Forest green canvas daypack with padded 15" laptop sleeve and brass hardware. Water-resistant wax finish, leather patch. Super comfortable straps for carrying heavy binders.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    imageBgColor: '#EAE7DF',
    sellerName: 'Noor',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    sellerEmail: 'noor.econ25@campus.edu',
    sellerPhone: '+1 (555) 901-2345',
    sellerLocation: 'On campus',
    createdAt: '2026-10-12T06:30:00.000Z',
    isUserCreated: false
  }
];

export const INITIAL_THREADS: MessageThread[] = [
  {
    id: 'thread-1',
    productId: 'prod-1',
    productTitle: 'Psychology textbooks',
    sellerName: 'Maya',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    lastMessage: 'Hey! Yes, I can meet at the campus cafe at 3 PM today.',
    time: '12m ago',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Hi Maya, are the psychology textbooks still available? Would love to pick them up today.',
        time: '10:42 AM'
      },
      {
        id: 'm2',
        sender: 'seller',
        text: 'Hey! Yes, I can meet at the campus cafe at 3 PM today.',
        time: '10:45 AM'
      }
    ]
  },
  {
    id: 'thread-2',
    productId: 'prod-2',
    productTitle: 'Sony headphones',
    sellerName: 'Daniel',
    sellerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80',
    lastMessage: 'Sounds good, let me know when you are outside the science building!',
    time: '2h ago',
    unreadCount: 0,
    messages: [
      {
        id: 'm3',
        sender: 'user',
        text: 'Hey Daniel! Does the headphone come with the charger?',
        time: 'Yesterday'
      },
      {
        id: 'm4',
        sender: 'seller',
        text: 'Yup! Original USB-C cable and audio jack are included.',
        time: 'Yesterday'
      },
      {
        id: 'm5',
        sender: 'seller',
        text: 'Sounds good, let me know when you are outside the science building!',
        time: 'Yesterday'
      }
    ]
  }
];

export const PRESET_IMAGE_OPTIONS = [
  {
    label: 'Psychology Books',
    category: 'Books',
    badge: 'STEAL',
    badgeType: 'yellow' as const,
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    bgColor: '#DCEEE2'
  },
  {
    label: 'Sony Headphones',
    category: 'Tech',
    badge: 'BARELY USED',
    badgeType: 'pink' as const,
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    bgColor: '#FEE5DF'
  },
  {
    label: 'City Bike',
    category: 'Bikes',
    badge: undefined,
    badgeType: undefined,
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    bgColor: '#FEF9C3'
  },
  {
    label: 'Desk & Chair',
    category: 'Room',
    badge: undefined,
    badgeType: undefined,
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    bgColor: '#EFECE6'
  },
  {
    label: 'Denim Jacket',
    category: 'Fits',
    badge: undefined,
    badgeType: undefined,
    url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    bgColor: '#F5EFE6'
  },
  {
    label: 'Canon DSLR',
    category: 'Tech',
    badge: 'MAIN CHARACTER',
    badgeType: 'hotpink' as const,
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    bgColor: '#F5EFEB'
  }
];
