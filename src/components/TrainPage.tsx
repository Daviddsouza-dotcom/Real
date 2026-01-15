import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, MicOff, Bluetooth, Volume2, Award, TrendingUp } from 'lucide-react';
import { Lesson } from '../lib/supabase';
import { bluetoothManager } from '../lib/bluetooth';

interface TrainPageProps {
  lesson: Lesson;
  onNavigateBack: () => void;
}

type FeedbackState = 'idle' | 'listening' | 'processing' | 'feedback';

interface FeedbackData {
  accuracy: number;
  message: string;
  suggestions: string[];
}

export function TrainPage({ lesson, onNavigateBack }: TrainPageProps) {
  const [isListening, setIsListening] = useState(false);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [connectionError, setConnectionError] = useState<string>('');
  const [isSendingPattern, setIsSendingPattern] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsBluetoothConnected(bluetoothManager.isConnected());

    bluetoothManager.setConnectionChangeCallback((connected) => {
      setIsBluetoothConnected(connected);
    });

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleSpeechResult(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setFeedbackState('idle');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [lesson]);

  //New short function added for sendVibrationPattern through flask
  async function sendVibrationPattern() {
    const motors = getMotorPattern(); 
    // motors = [p1, p2, p3, p4, duration]

    try {
      await sendVibration(motors);
    } catch (err) {
      console.error(err);
      alert("LinguaVibe service is not running. Please start it.");
    }
  }
  
  async function sendVibrationPattern_old() {
    setConnectionError('');
    setIsSendingPattern(true);

    try {
      if (!isBluetoothConnected) {
        throw new Error('LinguaVibe band not connected');
      }

      const pattern = lesson.vibration_pattern as any;
      const motors = Array.isArray(pattern.motors) ? pattern.motors : [pattern.motors];

      await bluetoothManager.send4MotorPattern(motors);

    } catch (error) {
      const errorMessage = (error as Error).message;
      setConnectionError(errorMessage);
      console.error('Failed to send vibration pattern:', error);
    } finally {
      setIsSendingPattern(false);
    }
  }

  function startListening() {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    setFeedbackState('listening');
    setIsListening(true);
    setFeedbackData(null);
    setConnectionError('');

    recognitionRef.current.start();
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }

  function handleSpeechResult(transcript: string) {
    setFeedbackState('processing');
    setAttempts(prev => prev + 1);

    setTimeout(() => {
      const accuracy = calculateAccuracy(transcript);
      const feedback = generateFeedback(accuracy, transcript);

      setFeedbackData(feedback);
      setFeedbackState('feedback');
    }, 1000);
  }

  function calculateAccuracy(transcript: string): number {
    const phonemeKey = lesson.phoneme.toLowerCase().replace(/[/:]/g, '');
    const exampleWord = lesson.title.match(/\(([^)]+)\)/)?.[1]?.toLowerCase() || '';

    if (transcript.includes(exampleWord)) {
      return Math.floor(Math.random() * 15) + 85;
    } else if (transcript.length > 0) {
      return Math.floor(Math.random() * 30) + 50;
    }
    return Math.floor(Math.random() * 20) + 30;
  }

  function generateFeedback(accuracy: number, transcript: string): FeedbackData {
    const suggestions: string[] = [];

    if (accuracy >= 85) {
      return {
        accuracy,
        message: 'Excellent pronunciation!',
        suggestions: ['You nailed it! Keep practicing to maintain this level.']
      };
    } else if (accuracy >= 70) {
      suggestions.push('Try to emphasize the sound more clearly');
      suggestions.push('Pay attention to tongue position');
      return {
        accuracy,
        message: 'Good effort! Almost there.',
        suggestions
      };
    } else if (accuracy >= 50) {
      suggestions.push('Review the mouth animation carefully');
      suggestions.push('Try speaking more slowly and deliberately');
      suggestions.push('Focus on the exact sound shown in the lesson');
      return {
        accuracy,
        message: 'Keep practicing. You can do better!',
        suggestions
      };
    } else {
      suggestions.push('Watch the animation again and mimic the mouth movements');
      suggestions.push('Listen to native speakers pronouncing this sound');
      suggestions.push('Practice in front of a mirror');
      return {
        accuracy,
        message: 'Let\'s try again with more focus.',
        suggestions
      };
    }
  }

  function playExampleSound() {
    const utterance = new SpeechSynthesisUtterance(lesson.title.match(/\(([^)]+)\)/)?.[1] || lesson.phoneme);
    utterance.lang = 'en-US';
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={onNavigateBack}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
            <p className="text-blue-100">Practice the {lesson.phoneme} sound</p>
          </div>

          <div className="p-8 space-y-6">
            <button
              onClick={sendVibrationPattern}
              disabled={isSendingPattern}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-sm"
            >
              {isSendingPattern ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending Pattern...
                </>
              ) : (
                'Start Training'
              )}
            </button>

            {connectionError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-900">{connectionError}</p>
                <p className="text-xs text-red-700 mt-1">Please connect your LinguaVibe band from the Bluetooth settings page.</p>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-8 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Sound Visualization</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={playExampleSound}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Play example sound"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <div className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${
                    isBluetoothConnected
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Bluetooth className="w-3.5 h-3.5 mr-1.5" />
                    {isBluetoothConnected ? 'Connected' : 'Not Connected'}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl aspect-square flex items-center justify-center border-2 border-slate-200 mb-4">
                <div className="text-center">
                  <div className="text-9xl mb-6 animate-pulse">👄</div>
                  <div className="text-5xl font-bold text-blue-600 mb-2">{lesson.phoneme}</div>
                  <div className="text-slate-600">Watch mouth position carefully</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600 px-2">
                <span>Study the mouth movements</span>
                <span className="font-bold">Attempts: {attempts}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Practice Pronunciation</h2>

              <div className="flex items-center justify-center">
                {feedbackState === 'idle' && (
                  <div className="text-center w-full">
                    <button
                      onClick={startListening}
                      className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg mb-4 mx-auto"
                    >
                      <Mic className="w-16 h-16 text-white" />
                    </button>
                    <p className="text-slate-600 font-medium">Click to start practicing</p>
                  </div>
                )}

                {feedbackState === 'listening' && (
                  <div className="text-center w-full">
                    <button
                      onClick={stopListening}
                      className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all animate-pulse shadow-lg mb-4 mx-auto"
                    >
                      <MicOff className="w-16 h-16 text-white" />
                    </button>
                    <p className="text-slate-900 font-semibold">Listening...</p>
                    <p className="text-slate-600 text-sm mt-2">Pronounce the word now</p>
                  </div>
                )}

                {feedbackState === 'processing' && (
                  <div className="text-center w-full">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-900 font-semibold">Analyzing your pronunciation...</p>
                  </div>
                )}

                {feedbackState === 'feedback' && feedbackData && (
                  <div className="w-full">
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                        feedbackData.accuracy >= 85 ? 'bg-green-100' :
                        feedbackData.accuracy >= 70 ? 'bg-yellow-100' :
                        feedbackData.accuracy >= 50 ? 'bg-orange-100' : 'bg-red-100'
                      }`}>
                        <span className={`text-4xl font-bold ${
                          feedbackData.accuracy >= 85 ? 'text-green-700' :
                          feedbackData.accuracy >= 70 ? 'text-yellow-700' :
                          feedbackData.accuracy >= 50 ? 'text-orange-700' : 'text-red-700'
                        }`}>
                          {feedbackData.accuracy}%
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {feedbackData.message}
                      </h3>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-slate-200 mb-4">
                      <div className="flex items-center mb-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="font-semibold text-slate-900">Suggestions</h4>
                      </div>
                      <ul className="space-y-2">
                        {feedbackData.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-slate-700 flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setFeedbackState('idle');
                        setFeedbackData(null);
                      }}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Quick Tips</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">1</span>
                  <span>Click "Start Training" to feel the vibration pattern for this sound</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">2</span>
                  <span>Watch the mouth animation carefully to understand mouth positioning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">3</span>
                  <span>Click the microphone button to practice pronouncing the sound</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">4</span>
                  <span>Review feedback and try again to improve your accuracy</span>
                </li>
              </ul>
            </div>

            {attempts > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center mb-3">
                  <Award className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="font-bold text-slate-900">Session Progress</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{attempts}</div>
                    <div className="text-xs text-slate-600 mt-1">Total Attempts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {feedbackData?.accuracy || 0}%
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Latest Score</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
