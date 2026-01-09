import { useEffect, useRef } from 'react';

interface SoundVisualizationProps {
  isActive: boolean;
  frequency?: number;
}

export function SoundVisualization({ isActive, frequency = 500 }: SoundVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const dataRef = useRef<number[]>(Array(64).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = 'rgb(15, 23, 42)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const bars = 64;
      const barWidth = (canvas.width / bars) * 0.8;
      const barGap = (canvas.width / bars) * 0.2;

      if (isActive) {
        for (let i = 0; i < bars; i++) {
          const randomHeight = Math.random() * canvas.height * 0.7;
          dataRef.current[i] = dataRef.current[i] * 0.85 + randomHeight * 0.15;

          const hue = (i / bars * 120) + (frequency % 360);
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

          ctx.fillRect(
            i * (barWidth + barGap) + barGap / 2,
            canvas.height - dataRef.current[i],
            barWidth,
            dataRef.current[i]
          );
        }
      } else {
        for (let i = 0; i < bars; i++) {
          dataRef.current[i] *= 0.92;

          const hue = (i / bars * 120) + 200;
          ctx.fillStyle = `hsl(${hue}, 70%, 45%)`;

          ctx.fillRect(
            i * (barWidth + barGap) + barGap / 2,
            canvas.height - dataRef.current[i],
            barWidth,
            dataRef.current[i]
          );
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, frequency]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      className="w-full max-w-md rounded-lg shadow-lg"
    />
  );
}
