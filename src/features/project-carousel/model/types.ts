import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import type { ReactNode } from 'react';

export type UsePrevNextButtons = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export type LazyImageProps = {
  src: string;
  alt: string;
  inView: boolean;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
};

export type CarouselRenderArgs<TItem> = {
  item: TItem;
  index: number;
  inView: boolean;
};

export type CarouselProps<TItem> = {
  items: TItem[];
  options?: EmblaOptionsType;
  renderSlide?: (args: CarouselRenderArgs<TItem>) => ReactNode;
  showArrows?: boolean;
  className?: string;
  onInit?: (api: EmblaCarouselType) => void;
  imageSize?: { width: number; height: number };
};
