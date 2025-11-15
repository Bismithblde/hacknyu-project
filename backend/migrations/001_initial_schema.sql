-- Supabase Migration: Initial Schema
-- This migration creates the core tables for the civic hazard platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
-- Stores user profiles with gamification data
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  points INTEGER DEFAULT 0 NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  trust_score INTEGER DEFAULT 60 NOT NULL CHECK (trust_score >= 0 AND trust_score <= 100),
  level TEXT DEFAULT 'Scout' NOT NULL,
  badges TEXT[] DEFAULT '{}' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Pins table
-- Stores hazard reports with location and verification data
CREATE TABLE IF NOT EXISTS pins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  category TEXT NOT NULL CHECK (category IN ('pothole', 'flooding', 'streetlight', 'sanitation', 'infrastructure', 'other')),
  recommended_agency TEXT NOT NULL,
  location_lat DOUBLE PRECISION NOT NULL CHECK (location_lat >= -90 AND location_lat <= 90),
  location_lng DOUBLE PRECISION NOT NULL CHECK (location_lng >= -180 AND location_lng <= 180),
  location_address TEXT NOT NULL,
  photo_url TEXT,
  status TEXT DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'escalated', 'resolved')),
  ai_confidence DOUBLE PRECISION DEFAULT 0.6 NOT NULL CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  hashed_image TEXT,
  attachments TEXT[] DEFAULT '{}' NOT NULL,
  verification_upvotes INTEGER DEFAULT 0 NOT NULL,
  verification_downvotes INTEGER DEFAULT 0 NOT NULL,
  verification_score INTEGER DEFAULT 0 NOT NULL,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Verifications table
-- Stores user votes on pin validity
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pin_id UUID NOT NULL REFERENCES pins(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('valid', 'invalid')),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(pin_id, user_id) -- Prevent duplicate votes
);

-- Confirmations table
-- Stores official reports and confirmations uploaded by users
CREATE TABLE IF NOT EXISTS confirmations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pin_id UUID NOT NULL REFERENCES pins(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url TEXT,
  extracted_text TEXT,
  is_valid BOOLEAN DEFAULT false NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('official-report', 'confirmation')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pins_user_id ON pins(user_id);
CREATE INDEX IF NOT EXISTS idx_pins_status ON pins(status);
CREATE INDEX IF NOT EXISTS idx_pins_category ON pins(category);
CREATE INDEX IF NOT EXISTS idx_pins_severity ON pins(severity);
CREATE INDEX IF NOT EXISTS idx_pins_created_at ON pins(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pins_location ON pins USING GIST (point(location_lng, location_lat));

CREATE INDEX IF NOT EXISTS idx_verifications_pin_id ON verifications(pin_id);
CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_created_at ON verifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_confirmations_pin_id ON confirmations(pin_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_user_id ON confirmations(user_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_report_type ON confirmations(report_type);
CREATE INDEX IF NOT EXISTS idx_confirmations_created_at ON confirmations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pins_updated_at
  BEFORE UPDATE ON pins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all users (for leaderboard, stats, etc.)
CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Policy: Anyone can read pins (public data)
CREATE POLICY "Pins are viewable by everyone"
  ON pins FOR SELECT
  USING (true);

-- Policy: Authenticated users can create pins
CREATE POLICY "Authenticated users can create pins"
  ON pins FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can update their own pins
CREATE POLICY "Users can update own pins"
  ON pins FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Policy: Anyone can read verifications
CREATE POLICY "Verifications are viewable by everyone"
  ON verifications FOR SELECT
  USING (true);

-- Policy: Authenticated users can create verifications
CREATE POLICY "Authenticated users can create verifications"
  ON verifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Anyone can read confirmations
CREATE POLICY "Confirmations are viewable by everyone"
  ON confirmations FOR SELECT
  USING (true);

-- Policy: Authenticated users can create confirmations
CREATE POLICY "Authenticated users can create confirmations"
  ON confirmations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Comments for documentation
COMMENT ON TABLE users IS 'User profiles with gamification data (points, XP, level, badges)';
COMMENT ON TABLE pins IS 'Hazard reports with location, verification stats, and AI analysis';
COMMENT ON TABLE verifications IS 'User votes on pin validity (valid/invalid)';
COMMENT ON TABLE confirmations IS 'Official reports and confirmations uploaded by users';

COMMENT ON COLUMN users.trust_score IS 'Trust score from 0-100 based on user activity and verification accuracy';
COMMENT ON COLUMN pins.verification_score IS 'Calculated as upvotes - downvotes';
COMMENT ON COLUMN confirmations.is_valid IS 'Whether the confirmation contains valid agency markers (311, case#, agency)';

