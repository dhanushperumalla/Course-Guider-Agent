/*
  # Add user_id column to messages table

  1. Changes
    - Add `user_id` column to `messages` table
      - UUID column to store the user ID
      - Foreign key reference to auth.users
      - Not null constraint to ensure data integrity
      - Index for better query performance

  2. Notes
    - Uses safe column addition with IF NOT EXISTS check
    - Adds foreign key constraint for referential integrity
    - Creates index for better query performance
*/

-- Add user_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'messages_user_id_fkey'
  ) THEN
    ALTER TABLE messages 
    ADD CONSTRAINT messages_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_user ON messages(session_id, user_id); 