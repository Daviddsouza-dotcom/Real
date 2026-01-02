/*
  # Create "Learn Phonemes" Course with 44 Lessons

  1. New Course
    - `Learn Phonemes` course (44 lessons)
    - Each lesson corresponds to one of the 44 English phonemes
    - Vibration patterns are populated from phoneme_vibrations table
    - Integrated with existing training system
  
  2. Schema
    - Uses existing courses and lessons tables
    - Each lesson has vibration_pattern populated with the phoneme pattern
*/

DO $$
DECLARE
  v_language_id uuid;
  v_course_id uuid;
  v_phoneme_row RECORD;
  v_order_index integer := 0;
BEGIN
  -- Get or create English language
  SELECT id INTO v_language_id FROM languages WHERE code = 'en' LIMIT 1;
  
  IF v_language_id IS NULL THEN
    INSERT INTO languages (name, code, is_active) VALUES ('English', 'en', true)
    RETURNING id INTO v_language_id;
  END IF;

  -- Check if "Learn Phonemes" course exists
  SELECT id INTO v_course_id FROM courses 
  WHERE language_id = v_language_id AND title = 'Learn Phonemes' LIMIT 1;

  IF v_course_id IS NULL THEN
    -- Create the "Learn Phonemes" course
    INSERT INTO courses (language_id, title, description, order_index)
    VALUES (
      v_language_id,
      'Learn Phonemes',
      'Master 44 English phonemes with haptic feedback and pronunciation training',
      999
    )
    RETURNING id INTO v_course_id;
  ELSE
    -- Delete existing lessons for this course
    DELETE FROM lessons WHERE course_id = v_course_id;
  END IF;

  -- Insert lessons for each phoneme
  FOR v_phoneme_row IN 
    SELECT * FROM phoneme_vibrations ORDER BY lesson_number
  LOOP
    v_order_index := v_order_index + 1;
    
    INSERT INTO lessons (
      course_id,
      title,
      phoneme,
      animation_url,
      vibration_pattern,
      order_index
    ) VALUES (
      v_course_id,
      v_phoneme_row.example_word || ' (' || v_phoneme_row.phoneme || ')',
      v_phoneme_row.phoneme,
      'https://via.placeholder.com/400x400?text=' || REPLACE(v_phoneme_row.phoneme, '/', '%2F'),
      jsonb_build_object(
        'motors', jsonb_build_array(
          jsonb_build_object(
            'M1', CASE WHEN v_phoneme_row.vibration_pattern LIKE '%M1%' THEN CASE WHEN v_phoneme_row.vibration_pattern LIKE '%M1(L)%' THEN 255 ELSE 150 END ELSE 0 END,
            'M2', CASE WHEN v_phoneme_row.vibration_pattern LIKE '%M2%' THEN CASE WHEN v_phoneme_row.vibration_pattern LIKE '%M2(L)%' THEN 255 ELSE 150 END ELSE 0 END,
            'M3', CASE WHEN v_phoneme_row.vibration_pattern LIKE '%M3%' THEN CASE WHEN v_phoneme_row.vibration_pattern LIKE '%M3(L)%' THEN 255 ELSE 150 END ELSE 0 END,
            'M4', CASE WHEN v_phoneme_row.vibration_pattern LIKE '%M4%' THEN CASE WHEN v_phoneme_row.vibration_pattern LIKE '%M4(L)%' THEN 255 ELSE 150 END ELSE 0 END,
            'duration', CASE WHEN v_phoneme_row.vibration_pattern LIKE '%L%' THEN 400 ELSE 200 END
          )
        ),
        'notes', v_phoneme_row.category,
        'pattern_code', v_phoneme_row.vibration_pattern
      ),
      v_order_index
    );
  END LOOP;

END $$;