-- Supabase Database Schema for Make or Break Habit Tracker
-- Run this SQL in your Supabase SQL Editor

-- Drop existing table if it has wrong column types (uncomment if needed)
-- DROP TABLE IF EXISTS habits CASCADE;

-- Habits table
-- Uses composite primary key (id, user_id) to allow same habit ID across different users
-- IMPORTANT: id must be TEXT, not UUID, to match local app IDs
CREATE TABLE IF NOT EXISTS habits (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  icon TEXT NOT NULL,
  name TEXT NOT NULL,
  goal_amount INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id, user_id)
);

-- If table already exists with wrong type, alter it (run this if you get UUID errors)
-- ALTER TABLE habits ALTER COLUMN id TYPE TEXT;
-- ALTER TABLE habits ALTER COLUMN user_id TYPE TEXT;

-- Daily progress table
CREATE TABLE IF NOT EXISTS daily_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  habit_id TEXT NOT NULL,
  current_amount INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date, habit_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON daily_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_progress_habit_id ON daily_progress(habit_id);

-- Enable Row Level Security (RLS) - optional, for future auth
-- ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;

-- Policy examples (uncomment if using RLS):
-- CREATE POLICY "Users can view their own habits" ON habits
--   FOR SELECT USING (auth.uid()::text = user_id);
-- 
-- CREATE POLICY "Users can insert their own habits" ON habits
--   FOR INSERT WITH CHECK (auth.uid()::text = user_id);
-- 
-- CREATE POLICY "Users can update their own habits" ON habits
--   FOR UPDATE USING (auth.uid()::text = user_id);
