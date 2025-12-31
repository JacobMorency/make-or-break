-- Fix UUID Type Issue
-- Run this if you're getting "invalid input syntax for type uuid" errors
-- This changes the id and user_id columns from UUID to TEXT

-- First, drop the primary key constraint
ALTER TABLE habits DROP CONSTRAINT IF EXISTS habits_pkey;

-- Change column types to TEXT
ALTER TABLE habits ALTER COLUMN id TYPE TEXT;
ALTER TABLE habits ALTER COLUMN user_id TYPE TEXT;

-- Recreate the primary key
ALTER TABLE habits ADD PRIMARY KEY (id, user_id);

-- Verify the change
-- You can check by running: SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'habits';
