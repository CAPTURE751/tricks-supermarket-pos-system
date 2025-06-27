
-- Drop the problematic policy that's causing infinite recursion
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

-- Create a simpler policy that allows authenticated users to insert their own profile
-- (This will mainly be used by the trigger when new users sign up)
CREATE POLICY "Allow profile creation for authenticated users" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Also create a policy to allow service role to insert profiles (for admin user creation)
CREATE POLICY "Service role can manage profiles" 
  ON public.profiles 
  FOR ALL 
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');
