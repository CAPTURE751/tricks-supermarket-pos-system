
-- First, let's completely clean up all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Create a security definer function to safely check user permissions
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new policies with unique names
CREATE POLICY "profile_select_policy" ON profiles
  FOR SELECT USING (id = public.get_current_user_id());

CREATE POLICY "profile_insert_policy" ON profiles
  FOR INSERT WITH CHECK (id = public.get_current_user_id());

CREATE POLICY "profile_update_policy" ON profiles
  FOR UPDATE USING (id = public.get_current_user_id());

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
