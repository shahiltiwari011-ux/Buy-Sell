-- ==============================================================================
-- CAMPUSLOOP ROOMMATE FINDER - SUPABASE MIGRATION
-- Migration: 20261013_roommate_finder.sql
-- Description: Creates tables, indexes, and Row Level Security (RLS) policies
--              for the Roommate Finder feature (Find a Roommate, Find a Room,
--              Post Availability, Safety Reports & User Blocking).
-- ==============================================================================

-- 1. Roommate Listings Table
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

-- Performance Indexes for Search & Filter Queries
CREATE INDEX IF NOT EXISTS idx_roommate_listings_type ON public.roommate_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_roommate_listings_college ON public.roommate_listings(college);
CREATE INDEX IF NOT EXISTS idx_roommate_listings_location ON public.roommate_listings(location);
CREATE INDEX IF NOT EXISTS idx_roommate_listings_budget ON public.roommate_listings(budget);
CREATE INDEX IF NOT EXISTS idx_roommate_listings_move_in ON public.roommate_listings(move_in_date);
CREATE INDEX IF NOT EXISTS idx_roommate_listings_user_id ON public.roommate_listings(user_id);

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_roommate_listings_updated_at ON public.roommate_listings;
CREATE TRIGGER set_roommate_listings_updated_at
    BEFORE UPDATE ON public.roommate_listings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2. User Safety: Reports Table
CREATE TABLE IF NOT EXISTS public.roommate_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.roommate_listings(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_roommate_reports_listing_id ON public.roommate_reports(listing_id);

-- 3. User Safety: Blocked Users Table
CREATE TABLE IF NOT EXISTS public.roommate_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    blocked_user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_block UNIQUE(user_id, blocked_user_id)
);

CREATE INDEX IF NOT EXISTS idx_roommate_blocks_user ON public.roommate_blocks(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Security: Users must only edit or delete their own listings.
-- Phone numbers are never stored directly in public profile schemas.
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.roommate_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_blocks ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone (including anonymous students) can read all active listings
DROP POLICY IF EXISTS "Anyone can view roommate listings" ON public.roommate_listings;
CREATE POLICY "Anyone can view roommate listings"
    ON public.roommate_listings
    FOR SELECT
    USING (true);

-- Policy 2: Authenticated students can create listings
DROP POLICY IF EXISTS "Authenticated users can create roommate listings" ON public.roommate_listings;
CREATE POLICY "Authenticated users can create roommate listings"
    ON public.roommate_listings
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy 3: Students can ONLY update their own listings
DROP POLICY IF EXISTS "Users can only update their own listings" ON public.roommate_listings;
CREATE POLICY "Users can only update their own listings"
    ON public.roommate_listings
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Students can ONLY delete their own listings
DROP POLICY IF EXISTS "Users can only delete their own listings" ON public.roommate_listings;
CREATE POLICY "Users can only delete their own listings"
    ON public.roommate_listings
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy 5: Authenticated users can submit safety reports
DROP POLICY IF EXISTS "Authenticated users can report listings" ON public.roommate_reports;
CREATE POLICY "Authenticated users can report listings"
    ON public.roommate_reports
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = reporter_id);

-- Policy 6: Users can manage their own blocks
DROP POLICY IF EXISTS "Users can view their own blocks" ON public.roommate_blocks;
CREATE POLICY "Users can view their own blocks"
    ON public.roommate_blocks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own blocks" ON public.roommate_blocks;
CREATE POLICY "Users can insert their own blocks"
    ON public.roommate_blocks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their own blocks" ON public.roommate_blocks;
CREATE POLICY "Users can remove their own blocks"
    ON public.roommate_blocks
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
