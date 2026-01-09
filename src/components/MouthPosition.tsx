interface MouthPositionProps {
  category: string;
  phoneme: string;
  isAnimating: boolean;
}

export function MouthPosition({ category, phoneme, isAnimating }: MouthPositionProps) {
  const getMouthShape = () => {
    const baseStyle = "w-32 h-32 rounded-full border-4 border-slate-400 flex items-center justify-center relative transition-all duration-300";

    switch (category) {
      case 'Short Vowels':
        return `${baseStyle} bg-gradient-to-b from-pink-100 to-pink-50 ${isAnimating ? 'scale-110' : 'scale-100'}`;
      case 'Long Vowels':
        return `${baseStyle} bg-gradient-to-b from-blue-100 to-blue-50 ${isAnimating ? 'scale-105' : 'scale-100'}`;
      case 'Diphthongs':
        return `${baseStyle} bg-gradient-to-b from-purple-100 to-purple-50 ${isAnimating ? 'scale-110 -skew-x-3' : 'scale-100'}`;
      case 'Consonants - Stops & Fricatives':
        return `${baseStyle} bg-gradient-to-b from-orange-100 to-orange-50 ${isAnimating ? 'scale-95' : 'scale-100'}`;
      case 'Nasals & Liquids':
        return `${baseStyle} bg-gradient-to-b from-green-100 to-green-50 ${isAnimating ? 'scale-105' : 'scale-100'}`;
      default:
        return baseStyle;
    }
  };

  const getTonguePosition = () => {
    const positions: Record<string, string> = {
      'Short Vowels': 'h-6 w-12 bg-red-400 rounded-full absolute bottom-6',
      'Long Vowels': 'h-7 w-14 bg-red-400 rounded-full absolute bottom-5',
      'Diphthongs': 'h-5 w-10 bg-red-400 rounded-full absolute bottom-8 transform origin-bottom',
      'Consonants - Stops & Fricatives': 'h-4 w-8 bg-red-500 rounded-full absolute bottom-10',
      'Nasals & Liquids': 'h-6 w-9 bg-red-400 rounded-full absolute bottom-7',
    };

    return positions[category] || '';
  };

  const getTongueAnimation = () => {
    if (!isAnimating) return '';

    const animations: Record<string, string> = {
      'Short Vowels': 'animate-bounce',
      'Long Vowels': 'animate-pulse',
      'Diphthongs': 'animate-spin',
      'Consonants - Stops & Fricatives': 'animate-ping',
      'Nasals & Liquids': 'animate-pulse',
    };

    return animations[category] || '';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={getMouthShape()}>
        <div className={`${getTonguePosition()} ${getTongueAnimation()}`} />
        <span className="text-3xl absolute top-2">👄</span>
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-600 font-medium">Mouth Position</p>
        <p className="text-lg font-semibold text-slate-900">{phoneme}</p>
        <p className="text-xs text-slate-500 mt-1">{category}</p>
      </div>

      <div className="w-full max-w-xs space-y-2">
        {category === 'Short Vowels' && (
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
            <p className="font-semibold mb-1">Open mouth slightly</p>
            <p>Tongue in center, relaxed position</p>
          </div>
        )}
        {category === 'Long Vowels' && (
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
            <p className="font-semibold mb-1">Open mouth more widely</p>
            <p>Sustain the vowel sound longer</p>
          </div>
        )}
        {category === 'Diphthongs' && (
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
            <p className="font-semibold mb-1">Moving mouth position</p>
            <p>Transition between two vowel sounds</p>
          </div>
        )}
        {category === 'Consonants - Stops & Fricatives' && (
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
            <p className="font-semibold mb-1">Position mouth precisely</p>
            <p>Create airflow blockage or friction</p>
          </div>
        )}
        {category === 'Nasals & Liquids' && (
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
            <p className="font-semibold mb-1">Soft mouth position</p>
            <p>Air flows through nose or over sides of tongue</p>
          </div>
        )}
      </div>
    </div>
  );
}
