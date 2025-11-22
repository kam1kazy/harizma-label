'use client';

import { useEffect, useRef } from 'react';

interface WaveVisualizerProps {
  audioData: Uint8Array | null;
  isPlaying: boolean;
  width?: number;
  height?: number;
}

export function WaveVisualizer({
  audioData,
  isPlaying,
  width = 800,
  height = 200,
}: WaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || width;
      canvas.height = rect.height || height;
    };

    updateCanvasSize();

    const draw = () => {
      // Обновляем размер canvas при необходимости
      if (canvas.width !== (canvas.getBoundingClientRect().width || width) ||
          canvas.height !== (canvas.getBoundingClientRect().height || height)) {
        updateCanvasSize();
      }
      if (!ctx) return;

      // Очищаем canvas
      ctx.fillStyle = 'rgba(5, 5, 5, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isPlaying || !audioData || audioData.length === 0) {
        // Рисуем статичную линию, когда нет звука
        ctx.strokeStyle = 'rgba(162, 70, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      timeRef.current += 0.016; // Примерно 60 FPS

      const centerY = canvas.height / 2;
      const dataLength = audioData.length;

      // Рисуем центральную линию
      ctx.strokeStyle = 'rgba(0, 150, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();

      // Рисуем основные волны (сплошные линии)
      const waveCount = 3;
      for (let waveIndex = 0; waveIndex < waveCount; waveIndex++) {
        ctx.strokeStyle = `rgba(0, 150, 255, ${0.9 - waveIndex * 0.2})`;
        ctx.lineWidth = 2 - waveIndex * 0.3;
        ctx.beginPath();

        for (let i = 0; i < dataLength; i++) {
          const x = (i / dataLength) * canvas.width;
          const amplitude = (audioData[i] / 255) * (canvas.height * 0.4);
          const frequency = 1 + waveIndex * 0.5;
          const phase = timeRef.current * 0.5 + waveIndex * Math.PI * 0.3;
          const y =
            centerY +
            Math.sin((i / dataLength) * Math.PI * frequency * 2 + phase) * amplitude * (1 - waveIndex * 0.2);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      // Рисуем пунктирные линии (вторичные волны)
      const dottedWaveCount = 2;
      for (let waveIndex = 0; waveIndex < dottedWaveCount; waveIndex++) {
        ctx.strokeStyle = `rgba(0, 150, 255, ${0.4 - waveIndex * 0.15})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();

        const offset = (waveIndex + 1) * 30;
        for (let i = 0; i < dataLength; i++) {
          const x = (i / dataLength) * canvas.width;
          const amplitude = (audioData[i] / 255) * (canvas.height * 0.3);
          const frequency = 0.8 + waveIndex * 0.3;
          const phase = timeRef.current * 0.3 + waveIndex * Math.PI * 0.5;
          const y =
            centerY +
            (waveIndex % 2 === 0 ? 1 : -1) * offset +
            Math.sin((i / dataLength) * Math.PI * frequency * 2 + phase) * amplitude * 0.6;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioData, isPlaying, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}

