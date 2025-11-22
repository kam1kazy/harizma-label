'use client';

import { useRef, useEffect } from 'react';
import { useCurvedSlider } from '@/features/curved-slider/lib/useCurvedSlider';
import type { Slide, CurvedSliderOptions } from '@/entities/carousel';

interface CurvedSliderProps {
  images: Slide[];
  options?: CurvedSliderOptions;
  className?: string;
}

export const CurvedSlider: React.FC<CurvedSliderProps> = ({ images, options = {}, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useCurvedSlider({
    containerRef,
    images: images.map((slide) => slide.src),
    options,
  });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = 'var(--min-height, 100vh)';
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`curved-slider ${className} mt-[-14.375rem]`}
      style={{ position: 'relative', overflow: 'hidden' }}
    />
  );
};
