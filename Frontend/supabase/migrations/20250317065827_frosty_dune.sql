/*
  # Add title column to messages table

  1. Changes
    - Add `title` column to `messages` table
      - Nullable text column to store chat titles
      - Can be updated by users to rename their chat sessions

  2. Notes
    - Uses safe column addition with IF NOT EXISTS check
    - Maintains existing data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'title'
  ) THEN
    ALTER TABLE messages ADD COLUMN title text;
  END IF;
END $$;