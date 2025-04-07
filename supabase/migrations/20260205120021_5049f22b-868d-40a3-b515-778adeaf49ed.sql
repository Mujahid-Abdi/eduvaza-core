-- Fix user_id column type: Firebase UIDs are strings, not UUIDs
-- First drop existing policies that reference user_id
DROP POLICY IF EXISTS "Users can create own AI results" ON public.ai_results;
DROP POLICY IF EXISTS "Users can delete own AI results" ON public.ai_results;
DROP POLICY IF EXISTS "Users can view own AI results" ON public.ai_results;

-- Change user_id from uuid to text to support Firebase UIDs
ALTER TABLE public.ai_results 
  ALTER COLUMN user_id TYPE text;

-- Recreate RLS policies (note: they won't work with Firebase auth, but we'll handle auth in the edge function)
-- Make the table publicly readable/writable and handle auth in the edge function
CREATE POLICY "Allow all operations on ai_results" 
ON public.ai_results 
FOR ALL 
USING (true) 
WITH CHECK (true);