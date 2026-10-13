-- ==============================================================================
-- CAMPUSLOOP DEVELOPMENT SEED DATA
-- Note: Intended for local development and test environments only.
-- Do not run in production.
-- ==============================================================================

-- 1. Sample Marketplace Products
INSERT INTO public.marketplace_products (
    title, price, category, condition, badge, badge_type, description, 
    image_url, image_bg_color, seller_name, seller_email, seller_phone, seller_location, is_sold
) VALUES
(
    'Psychology textbooks', 24.00, 'Books', 'Good Condition', 'STEAL', 'yellow',
    'Intro to Cognitive Psychology + Social Psychology combo. Clean pages, no highlighting, saved me all semester!',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    '#DCEEE2', 'Maya', 'maya.campus@edu', '+1 (555) 234-5678', 'North Campus Library', false
),
(
    'Sony WH-CH520 headphones', 85.00, 'Tech', 'Barely Used', 'BARELY USED', 'pink',
    'Great battery life (50hr). Only used for study sessions in the quiet room. Comes with original charging cable.',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    '#FEE5DF', 'Daniel', 'daniel.k@campus.edu', '+1 (555) 345-6789', 'Dorm Quad 4', false
),
(
    'Single-speed city bike', 120.00, 'Bikes', 'Good Condition', NULL, NULL,
    'Fast campus commuter with basket and U-lock included. Tuned last week at the local coop, rides super smooth.',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    '#FEF9C3', 'Priya', 'priya.m@campus.edu', '+1 (555) 456-7890', 'Science Block rack', false
),
(
    'Minimalist desk & chair', 65.00, 'Room', 'Good Condition', NULL, NULL,
    'Sturdy IKEA desk + ergonomic study chair. Perfect for small dorm setups. Can help carry down to your car!',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    '#EFECE6', 'Ethan', 'ethan.w@campus.edu', '+1 (555) 567-8901', 'South Hall 2B', false
),
(
    'Vintage washed denim jacket', 40.00, 'Fits', 'Like New', NULL, NULL,
    'Oversized vintage Levi fit, size M. Thick cotton denim, classic campus layer for chilly lecture halls.',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    '#F5EFE6', 'Alex', 'alex.c@campus.edu', '+1 (555) 678-9012', 'Student Union', false
),
(
    'Warm amber desk lamp', 18.00, 'Room', 'Like New', NULL, NULL,
    'Matte black finish with 3 brightness levels. Warm eye-friendly light for late night cramming without waking roommates.',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    '#FEE5DF', 'Sam', 'sam.r@campus.edu', '+1 (555) 789-0123', 'Engineering Lawn', false
),
(
    'Canon EOS Rebel T7 Kit', 300.00, 'Tech', 'Like New', 'MAIN CHARACTER', 'hotpink',
    'Includes 18-55mm lens, 64GB fast SD card, camera strap, and battery charger. Ideal for design & film majors.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    '#F5EFEB', 'Jo', 'jo.photo@campus.edu', '+1 (555) 890-1234', 'Fine Arts Studio', false
),
(
    'Waterproof campus backpack', 70.00, 'Fits', 'Barely Used', NULL, NULL,
    'Padded laptop compartment fits up to 16in MacBook. Water bottle side sleeve, weatherproof zips.',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    '#EFECE6', 'Noor', 'noor.h@campus.edu', '+1 (555) 901-2345', 'Campus Center', false
)
ON CONFLICT DO NOTHING;

-- 2. Sample Roommate Listings
INSERT INTO public.roommate_listings (
    listing_type, name, avatar, college, location, budget, move_in_date,
    room_type, gender_preference, lifestyle_tags, cleanliness, sleep_schedule,
    bio, amenities, room_images, contact_email
) VALUES
(
    'roommate', 'Ananya Sharma',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'Delhi University (North Campus)', 'Kamla Nagar / Hudson Lane', 11500, '2026-11-01',
    'Shared Room', 'Female only',
    ARRAY['Early Bird', 'Studious / Quiet', 'Veg Friendly', 'No Smoking'],
    'Very Neat', 'Early Bird',
    '2nd year Economics Honours student at SRCC. Looking for a quiet, organized female roommate who values hygiene and study hours.',
    ARRAY['High-speed WiFi', 'AC', 'Attached Washroom', 'Kitchen Access', 'RO Water Filter'],
    ARRAY[]::TEXT[], 'ananya.s@campus.edu'
),
(
    'room', 'Kabir Verma',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    'IIT Delhi / Hauz Khas', 'Green Park Extension (3 min to Metro)', 16000, '2026-10-25',
    'Private Room', 'Any',
    ARRAY['Night Owl', 'Gym Enthusiast', 'Creative Vibes'],
    'Moderate', 'Night Owl',
    '1 private bedroom with attached balcony available in a sunlit 3BHK. Gated society with 24x7 security, cook maid setup already in place.',
    ARRAY['Split AC', 'Furnished Bed & Desk', 'Power Backup', 'Washing Machine', 'Cook Maid Setup', 'Parking Available'],
    ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    'kabir.v@campus.edu'
),
(
    'roommate', 'Rohan Mehta',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'Delhi University (South Campus)', 'Satya Niketan / Moti Bagh', 9000, '2026-11-15',
    'Shared Room', 'Male only',
    ARRAY['Night Owl', 'Pet Friendly', 'Weekend Baker'],
    'Moderate', 'Night Owl',
    'Final year B.Com student at Venkateswara College. Friendly, love making espresso and chilling on weekends.',
    ARRAY['High-speed WiFi', 'Kitchen Access', 'RO Water Filter'],
    ARRAY[]::TEXT[], 'rohan.m@campus.edu'
),
(
    'room', 'Meera Iyer',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    'National Institute of Design (NID)', 'Lajpat Nagar IV (Near Ring Road)', 14500, '2026-11-05',
    'Private Room', 'Female only',
    ARRAY['Plant Parent', 'Creative Vibes', 'Music Friendly'],
    'Very Neat', 'Flexible',
    'Bright private room with huge bookshelf and natural sunlight. Looking for an art/design student or working intern.',
    ARRAY['High-speed WiFi', 'Split AC', 'Washing Machine', 'Private Balcony', 'Kitchen Access'],
    ARRAY['https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80'],
    'meera.i@campus.edu'
)
ON CONFLICT DO NOTHING;
