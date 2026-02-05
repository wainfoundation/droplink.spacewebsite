-- Add wallet_address field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Add index for wallet_address for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address);

-- Update existing profiles to use pi_wallet_address as wallet_address if available
UPDATE profiles 
SET wallet_address = pi_wallet_address 
WHERE pi_wallet_address IS NOT NULL AND wallet_address IS NULL;

-- Add comment to the column
COMMENT ON COLUMN profiles.wallet_address IS 'User Pi Network wallet address for receiving payments';
