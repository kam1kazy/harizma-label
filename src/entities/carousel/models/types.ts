export interface Slide {
  id: string;
  title: string;
  category: string;
  artist: string;
  description: string;
  src: string;
  alt?: string; // Опционально для доступности
}

export interface CurvedSliderOptions {
  speed?: number; // Скорость анимации (default: 30)
  gap?: number;   // Зазор между слайдами в % (default: 10)
  curve?: number; // Интенсивность кривизны (default: 12)
  direction?: number; // Направление: -1 (вперед), 1 (назад) (default: -1)
  autoPlay?: boolean; // Автоматическая анимация при старте (default: false)
}
