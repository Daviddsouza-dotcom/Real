/*
  # Create Phoneme Vibrations Table

  1. New Tables
    - `phoneme_vibrations`
      - `id` (uuid, primary key)
      - `lesson_number` (integer, unique identifier for lesson order)
      - `phoneme` (text, the IPA phoneme)
      - `example_word` (text, English example)
      - `category` (text, classification: short vowels, long vowels, diphthongs, consonants, etc.)
      - `vibration_pattern` (text, the motor vibration sequence like "M2(S)", "M1(L) → M2(S)", etc.)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `phoneme_vibrations` table
    - Add policy for all authenticated users to read phoneme data (public learning content)
*/

CREATE TABLE IF NOT EXISTS phoneme_vibrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_number integer UNIQUE NOT NULL,
  phoneme text NOT NULL,
  example_word text NOT NULL,
  category text NOT NULL,
  vibration_pattern text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phoneme_vibrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read phoneme data"
  ON phoneme_vibrations
  FOR SELECT
  TO authenticated
  USING (true);
