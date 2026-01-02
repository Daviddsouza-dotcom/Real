export interface MotorSequence {
  M1: number;
  M2: number;
  M3: number;
  M4: number;
  duration: number;
}

export function parseVibrationPattern(patternString: string): MotorSequence[] {
  const sequences: MotorSequence[] = [];

  const parts = patternString.split('→').map(p => p.trim());

  for (const part of parts) {
    const motorMatches = part.match(/M(\d)\(([LS])\)/g) || [];

    if (motorMatches.length === 0) {
      continue;
    }

    const motors: { [key: string]: number } = {
      M1: 0,
      M2: 0,
      M3: 0,
      M4: 0,
    };

    for (const match of motorMatches) {
      const motorNum = match[1];
      const intensity = match[3] === 'L' ? 255 : 150;
      motors[`M${motorNum}`] = intensity;
    }

    const duration = motorMatches.some(m => m.includes('L')) ? 400 : 200;

    sequences.push({
      M1: motors.M1,
      M2: motors.M2,
      M3: motors.M3,
      M4: motors.M4,
      duration,
    });
  }

  if (sequences.length === 0) {
    sequences.push({ M1: 0, M2: 0, M3: 0, M4: 0, duration: 0 });
  }

  return sequences;
}

export function parseComplexPattern(patternString: string): MotorSequence[] {
  const sequences: MotorSequence[] = [];

  const segments = patternString.split(',').map(s => s.trim());

  for (const segment of segments) {
    if (segment === 'pause') {
      sequences.push({ M1: 0, M2: 0, M3: 0, M4: 0, duration: 200 });
      continue;
    }

    const arrowParts = segment.split('→').map(p => p.trim());

    for (const part of arrowParts) {
      const motorMatches = part.match(/M(\d)\(([LS])\)/g) || [];

      if (motorMatches.length === 0) {
        continue;
      }

      const motors: { [key: string]: number } = {
        M1: 0,
        M2: 0,
        M3: 0,
        M4: 0,
      };

      for (const match of motorMatches) {
        const motorNum = match[1];
        const intensity = match[3] === 'L' ? 255 : 150;
        motors[`M${motorNum}`] = intensity;
      }

      const duration = motorMatches.some(m => m.includes('L')) ? 400 : 200;

      sequences.push({
        M1: motors.M1,
        M2: motors.M2,
        M3: motors.M3,
        M4: motors.M4,
        duration,
      });
    }
  }

  if (sequences.length === 0) {
    sequences.push({ M1: 0, M2: 0, M3: 0, M4: 0, duration: 0 });
  }

  return sequences;
}

export async function fetchPhonemeVibrations() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const apiUrl = `${supabaseUrl}/functions/v1/get-phoneme-vibrations`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch phoneme vibrations');
  }

  return response.json();
}

export function groupPhonemesByCategory(phonemes: any[]) {
  const grouped: { [key: string]: any[] } = {};

  for (const phoneme of phonemes) {
    if (!grouped[phoneme.category]) {
      grouped[phoneme.category] = [];
    }
    grouped[phoneme.category].push(phoneme);
  }

  return grouped;
}
