/*
  # Populate Phoneme Vibrations Data

  Inserts all 44 English phonemes with their vibration sequences for the LinguaVibe band.
*/

INSERT INTO phoneme_vibrations (lesson_number, phoneme, example_word, category, vibration_pattern) VALUES
-- Short Vowels (12)
(1, '/ɪ/', 'bit', 'Short Vowels', 'M2(S)'),
(2, '/e/', 'bed', 'Short Vowels', 'M2–M3(S)'),
(3, '/æ/', 'cat', 'Short Vowels', 'M3(S)'),
(4, '/ʌ/', 'cup', 'Short Vowels', 'M3–M4(S)'),
(5, '/ɒ/', 'hot', 'Short Vowels', 'M4(S)'),
(6, '/ʊ/', 'book', 'Short Vowels', 'M4(L)'),
(7, '/ə/', 'about', 'Short Vowels', 'M2(L)'),
(8, '/i/', 'sit', 'Short Vowels', 'M1–M2(S)'),
(9, '/ɛ/', 'red', 'Short Vowels', 'M2(S), M3(S)'),
(10, '/ɑ/', 'father', 'Short Vowels', 'M3(L)'),
(11, '/ɔ/', 'law', 'Short Vowels', 'M4(S), M3(S)'),
(12, '/u/', 'full', 'Short Vowels', 'M4–M3(L)'),

-- Long Vowels (8)
(13, '/iː/', 'see', 'Long Vowels', 'M1(L)'),
(14, '/ɑː/', 'car', 'Long Vowels', 'M3(L), pause, M3(L)'),
(15, '/ɔː/', 'call', 'Long Vowels', 'M4(L), M3(L)'),
(16, '/uː/', 'blue', 'Long Vowels', 'M4(L), M4(S)'),
(17, '/ɜː/', 'bird', 'Long Vowels', 'M2(L), M3(L)'),
(18, '/eɪ/', 'day', 'Long Vowels', 'M2(S) → M3(L)'),
(19, '/oʊ/', 'go', 'Long Vowels', 'M3(S) → M4(L)'),
(20, '/aɪ/', 'time', 'Long Vowels', 'M2(S) → M4(S)'),

-- Diphthongs (8)
(21, '/aʊ/', 'now', 'Diphthongs', 'M3(S) → M4(L)'),
(22, '/ɔɪ/', 'boy', 'Diphthongs', 'M4(S) → M2(S)'),
(23, '/ɪə/', 'ear', 'Diphthongs', 'M1(S) → M2(L)'),
(24, '/eə/', 'air', 'Diphthongs', 'M2(S) → M3(L)'),
(25, '/ʊə/', 'tour', 'Diphthongs', 'M4(S) → M3(L)'),
(26, '/əʊ/', 'home', 'Diphthongs', 'M2(L) → M4(S)'),
(27, '/aɪə/', 'fire', 'Diphthongs', 'M2(S) → M3(S) → M4(L)'),
(28, '/aʊə/', 'power', 'Diphthongs', 'M3(S) → M4(S) → M2(L)'),

-- Consonants - Stops & Fricatives (10)
(29, '/p/', 'pen', 'Consonants - Stops & Fricatives', 'M1(S)'),
(30, '/b/', 'bat', 'Consonants - Stops & Fricatives', 'M1(L)'),
(31, '/t/', 'tea', 'Consonants - Stops & Fricatives', 'M2(S)'),
(32, '/d/', 'dog', 'Consonants - Stops & Fricatives', 'M2(L)'),
(33, '/k/', 'cat', 'Consonants - Stops & Fricatives', 'M3(S)'),
(34, '/g/', 'go', 'Consonants - Stops & Fricatives', 'M3(L)'),
(35, '/f/', 'fan', 'Consonants - Stops & Fricatives', 'M1(S), M1(S)'),
(36, '/v/', 'van', 'Consonants - Stops & Fricatives', 'M1(L), M1(S)'),
(37, '/s/', 'sun', 'Consonants - Stops & Fricatives', 'M2(S), M2(S)'),
(38, '/z/', 'zoo', 'Consonants - Stops & Fricatives', 'M2(L), M2(S)'),

-- Nasals, Liquids, Others (6)
(39, '/m/', 'man', 'Nasals & Liquids', 'M1–M2(L)'),
(40, '/n/', 'no', 'Nasals & Liquids', 'M2–M3(L)'),
(41, '/ŋ/', 'sing', 'Nasals & Liquids', 'M3–M4(L)'),
(42, '/l/', 'leg', 'Nasals & Liquids', 'M2(L), M3(S)'),
(43, '/r/', 'red', 'Nasals & Liquids', 'M3(L), M2(S)'),
(44, '/w/', 'we', 'Nasals & Liquids', 'M1(S) → M4(S)');
