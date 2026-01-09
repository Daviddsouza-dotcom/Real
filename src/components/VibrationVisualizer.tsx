interface Motor {
  M1?: number;
  M2?: number;
  M3?: number;
  M4?: number;
  duration?: number;
}

interface VibrationVisualizerProps {
  vibrationPattern: string;
  motors?: Motor[];
  isActive: boolean;
}

export function VibrationVisualizer({
  vibrationPattern,
  motors,
  isActive
}: VibrationVisualizerProps) {
  const motorNames = ['M1', 'M2', 'M3', 'M4'];
  const motorColors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];

  const parsePattern = (pattern: string): Record<string, boolean> => {
    const active: Record<string, boolean> = {};
    motorNames.forEach(m => {
      active[m] = pattern.includes(m);
    });
    return active;
  };

  const activeMotors = parsePattern(vibrationPattern);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Haptic Vibration Pattern</h3>
        <p className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded inline-block">
          {vibrationPattern}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {motorNames.map((motor, idx) => (
          <div
            key={motor}
            className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
              activeMotors[motor]
                ? `${motorColors[idx]} text-white shadow-lg ${isActive ? 'scale-110' : 'scale-100'}`
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            <div className="text-sm font-bold">{motor}</div>
            {activeMotors[motor] && isActive && (
              <div className="mt-2 w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {motors && motors.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700">Motor Sequence</p>
          <div className="flex gap-1 flex-wrap">
            {motors.map((motor, idx) => {
              const activeInStep = Object.entries(motor)
                .filter(([key, val]) => key.startsWith('M') && val > 0)
                .map(([key]) => key);

              return (
                <div
                  key={idx}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                    isActive && activeInStep.length > 0
                      ? 'bg-blue-500 text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Step {idx + 1}
                  {motor.duration && <span className="ml-1">({motor.duration}ms)</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-lg">
        <p className="text-xs text-slate-700">
          <span className="font-semibold">Tip:</span> Focus on the vibration sensations across your wrist while repeating the phoneme.
        </p>
      </div>
    </div>
  );
}
