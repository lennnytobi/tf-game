-- ============================================
-- Create Settings Table for Quiz Visibility Control
-- ============================================

-- Create settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert quiz_enabled setting (default: false = hidden)
INSERT INTO app_settings (key, value, description) 
VALUES ('quiz_enabled', 'false', 'Controls whether quiz questions are visible to teams')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read settings (they need to check if quiz is enabled)
DROP POLICY IF EXISTS "Allow public to read settings" ON app_settings;
CREATE POLICY "Allow public to read settings" 
ON app_settings 
FOR SELECT 
TO PUBLIC
USING (true);

-- Note: Only admins with service role key can update settings via API
-- This prevents anyone from bypassing the admin toggle

-- ============================================
-- DONE! Quiz is now HIDDEN by default
-- Use the admin toggle to enable it when ready
-- ============================================

