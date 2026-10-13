-- ==============================================================================
-- CAMPUSLOOP FULL SCHEMA & ROW LEVEL SECURITY (RLS) MIGRATION
-- Migration: 20261013_campusloop_init.sql
-- Description: Creates profiles, marketplace_products, marketplace_reports,
--              roommate_listings, roommate_reports, roommate_blocks tables,
--              storage bucket and strict Row Level Security (RLS) policies.
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    college TEXT NOT NULL DEFAULT 'Delhi University',
    student_id_status TEXT NOT NULL DEFAULT 'unverified' CHECK (student_id_status IN ('unverified', 'pending', 'verified')),
    bio TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Auto-create profile on user sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, college, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'college', 'Campus Student'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Marketplace Products Table
CREATE TABLE IF NOT EXISTS public.marketplace_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL CHECK (category IN ('Books', 'Tech', 'Room', 'Bikes', 'Fits', 'Other')),
    condition TEXT NOT NULL CHECK (condition IN ('Like New', 'Barely Used', 'Good Condition', 'Fair Condition')),
    badge TEXT,
    badge_type TEXT,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    image_bg_color TEXT DEFAULT '#F1F5F9',
    seller_name TEXT NOT NULL,
    seller_avatar TEXT,
    seller_email TEXT NOT NULL,
    seller_phone TEXT,
    seller_location TEXT DEFAULT 'On campus',
    is_sold BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.marketplace_products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.marketplace_products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_sold ON public.marketplace_products(is_sold);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.marketplace_products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.marketplace_products(created_at DESC);

ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view marketplace products" ON public.marketplace_products;
CREATE POLICY "Anyone can view marketplace products"
    ON public.marketplace_products FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create products" ON public.marketplace_products;
CREATE POLICY "Authenticated users can create products"
    ON public.marketplace_products FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own products" ON public.marketplace_products;
CREATE POLICY "Users can only update their own products"
    ON public.marketplace_products FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own products" ON public.marketplace_products;
CREATE POLICY "Users can only delete their own products"
    ON public.marketplace_products FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 3. Marketplace Reports Table
CREATE TABLE IF NOT EXISTS public.marketplace_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.marketplace_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can report products" ON public.marketplace_reports;
CREATE POLICY "Authenticated users can report products"
    ON public.marketplace_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = reporter_id);

-- 4. Roommate Listings Table
CREATE TABLE IF NOT EXISTS public.roommate_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_type TEXT NOT NULL CHECK (listing_type IN ('roommate', 'room')),
    name TEXT NOT NULL,
    avatar TEXT,
    college TEXT NOT NULL,
    location TEXT NOT NULL,
    budget NUMERIC(10, 2) NOT NULL CHECK (budget >= 0),
    move_in_date DATE NOT NULL,
    room_type TEXT NOT NULL CHECK (room_type IN ('Private Room', 'Shared Room', 'Entire Apartment')),
    gender_preference TEXT NOT NULL DEFAULT 'Any',
    lifestyle_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    cleanliness TEXT DEFAULT 'Moderate',
    sleep_schedule TEXT DEFAULT 'Flexible',
    bio TEXT NOT NULL,
    amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
    room_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    contact_email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_roommate_listings_type ON public.roommate_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_roommate_listings_college ON public.roommate_listings(college);
CREATE INDEX IF NOT EXISTS idx_roommate_listings_location ON public.roommate_listings(location);
CREATE INDEX IF NOT EXISTS idx_roommate_listings_budget ON public.roommate_listings(budget);
CREATE INDEX IF NOT EXISTS idx_roommate_listings_move_in ON public.roommate_listings(move_in_date);
CREATE INDEX IF NOT EXISTS idx_roommate_listings_user_id ON public.roommate_listings(user_id);

ALTER TABLE public.roommate_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view roommate listings" ON public.roommate_listings;
CREATE POLICY "Anyone can view roommate listings"
    ON public.roommate_listings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create roommate listings" ON public.roommate_listings;
CREATE POLICY "Authenticated users can create roommate listings"
    ON public.roommate_listings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own listings" ON public.roommate_listings;
CREATE POLICY "Users can only update their own listings"
    ON public.roommate_listings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own listings" ON public.roommate_listings;
CREATE POLICY "Users can only delete their own listings"
    ON public.roommate_listings FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 5. Roommate Reports Table
CREATE TABLE IF NOT EXISTS public.roommate_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.roommate_listings(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.roommate_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can report listings" ON public.roommate_reports;
CREATE POLICY "Authenticated users can report listings"
    ON public.roommate_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = reporter_id);

-- 6. Roommate Blocks Table
CREATE TABLE IF NOT EXISTS public.roommate_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    blocked_user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_block UNIQUE(user_id, blocked_user_id)
);

ALTER TABLE public.roommate_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own blocks" ON public.roommate_blocks;
CREATE POLICY "Users can view their own blocks"
    ON public.roommate_blocks FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own blocks" ON public.roommate_blocks;
CREATE POLICY "Users can insert their own blocks"
    ON public.roommate_blocks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their own blocks" ON public.roommate_blocks;
CREATE POLICY "Users can remove their own blocks"
    ON public.roommate_blocks FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 7. Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'campusloop_media',
    'campusloop_media',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage bucket RLS policies
DROP POLICY IF EXISTS "Public can view campusloop media" ON storage.objects;
CREATE POLICY "Public can view campusloop media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'campusloop_media');

DROP POLICY IF EXISTS "Authenticated users can upload campusloop media" ON storage.objects;
CREATE POLICY "Authenticated users can upload campusloop media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'campusloop_media');

DROP POLICY IF EXISTS "Users can delete their own uploaded media" ON storage.objects;
CREATE POLICY "Users can delete their own uploaded media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'campusloop_media' AND (storage.foldername(name))[1] = auth.uid()::text);
