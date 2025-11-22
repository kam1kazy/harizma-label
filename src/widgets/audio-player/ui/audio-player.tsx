'use client';

import { useState } from 'react';
import { useAudioPlayer, type Track } from '@/features/audio-player/lib/useAudioPlayer';
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiVolume2 } from 'react-icons/fi';
import { IconButton } from '@/shared/ui/icon-button';
import { WaveVisualizer } from './wave-visualizer';

export interface AudioPlayerProps {
  tracks: Track[];
}

export function AudioPlayer({ tracks }: AudioPlayerProps) {
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);

  const handleAudioData = (data: Uint8Array) => {
    setAudioData(data);
  };

  const {
    audioRef,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
  } = useAudioPlayer({ tracks, onAudioData: handleAudioData });

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) return null;

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-8 sm:px-10 lg:px-16">
      <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-6">
        {/* Информация о треке */}
        <div className="mb-6 flex items-center gap-4">
          {currentTrack.cover && (
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-white">{currentTrack.title}</h3>
            <p className="truncate text-sm text-white/70">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-white/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div
            className="relative h-1 w-full cursor-pointer rounded-full bg-white/10"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              seek(percentage * duration);
            }}
          >
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Элементы управления */}
        <div className="flex items-center justify-center gap-4">
          <IconButton
            variant="filled"
            onClick={prevTrack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Предыдущий трек"
          >
            <FiSkipBack size={20} />
          </IconButton>

          <IconButton
            variant="filled"
            onClick={togglePlayPause}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition hover:bg-white/90"
            aria-label={isPlaying ? 'Пауза' : 'Воспроизведение'}
          >
            {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
          </IconButton>

          <IconButton
            variant="filled"
            onClick={nextTrack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Следующий трек"
          >
            <FiSkipForward size={20} />
          </IconButton>
        </div>

        {/* Громкость */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <FiVolume2 className="text-white/70" size={18} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
          />
          <span className="w-10 text-xs text-white/60">{Math.round(volume * 100)}%</span>
        </div>

        {/* Визуализация волн */}
        <div className="mt-8 h-[200px] w-full overflow-hidden rounded-lg">
          <WaveVisualizer audioData={audioData} isPlaying={isPlaying} height={200} />
        </div>

        <audio ref={audioRef} preload="metadata" />
      </div>
    </div>
  );
}

