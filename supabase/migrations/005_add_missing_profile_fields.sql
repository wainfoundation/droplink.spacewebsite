-- Add missing fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS youtube TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tiktok TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT false;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_profiles_setup_completed ON profiles(setup_completed);

-- Add comments to the columns
COMMENT ON COLUMN profiles.wallet_address IS 'User Pi Network wallet address for receiving payments';
COMMENT ON COLUMN profiles.website IS 'User website URL';
COMMENT ON COLUMN profiles.twitter IS 'User Twitter handle or URL';
COMMENT ON COLUMN profiles.instagram IS 'User Instagram handle or URL';
COMMENT ON COLUMN profiles.youtube IS 'User YouTube channel or URL';
COMMENT ON COLUMN profiles.tiktok IS 'User TikTok handle or URL';
COMMENT ON COLUMN profiles.github IS 'User GitHub username or URL';
COMMENT ON COLUMN profiles.email IS 'User email address';
COMMENT ON COLUMN profiles.whatsapp IS 'User WhatsApp number';
COMMENT ON COLUMN profiles.setup_completed IS 'Whether user has completed the setup wizard';
