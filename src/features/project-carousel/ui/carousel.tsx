import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Project } from '@/entities/project/model/types';
import type { CarouselProps, CarouselRenderArgs } from '../model/types';
import '../style/embla.css';
import { NextButton, PrevButton } from './arrow-buttons';
import { LazyImage } from './lazy-image';
import { usePrevNextButtons } from './use-prev-next-buttons';

export function Carousel<TItem>(props: CarouselProps<TItem>) {
  const {
    items,
    options,
    renderSlide,
    showArrows = true,
    className,
    onInit,
    imageSize = { width: 450, height: 400 },
  } = props;

  const mergedOptions: EmblaOptionsType = useMemo(
    () =>
      ({
        loop: true,
        align: 'center' as const,
        containScroll: 'trimSnaps' as const,
        slidesToScroll: 1,
        ...(options ?? {}),
      }) as EmblaOptionsType,
    [options]
  );

  const [viewportRef, emblaApi] = useEmblaCarousel(mergedOptions);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);

  const updateSlidesInView = useCallback((api: EmblaCarouselType) => {
    setSlidesInView((prev) => {
      if (prev.length === api.slideNodes().length) {
        api.off('slidesInView', updateSlidesInView);
      }
      const inView = api.slidesInView().filter((i) => !prev.includes(i));
      return prev.concat(inView);
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit?.(emblaApi);
    updateSlidesInView(emblaApi);
    emblaApi.on('slidesInView', updateSlidesInView);
    emblaApi.on('reInit', updateSlidesInView);

    const updateSelected = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    updateSelected();
    emblaApi.on('select', updateSelected).on('reInit', updateSelected);
  }, [emblaApi, onInit, updateSlidesInView]);

  const defaultProjectRenderer = useMemo(() => {
    return (args: CarouselRenderArgs<unknown>) => {
      const item = args.item as unknown as Project;
      const isSelected = selectedIndex === (args.index as number);
      return (
        <div className="embla__slide">
          <div
            className={`embla__slide__wrapper${isSelected ? ' embla__slide__wrapper--selected' : ''}`}
          >
            <LazyImage
              src={item.cover}
              alt={item.title}
              inView={args.inView}
              width={imageSize.width}
              height={imageSize.height}
            />
            <div className="embla__slide__overlay text-center">
              <span className="embla__slide__name">{item.title}</span>
            </div>
          </div>
        </div>
      );
    };
  }, [imageSize.height, imageSize.width, selectedIndex]);

  const renderer =
    (renderSlide as (a: CarouselRenderArgs<TItem>) => ReactNode) ??
    (defaultProjectRenderer as (a: CarouselRenderArgs<TItem>) => ReactNode);

  return (
    <div className={`embla ${className ?? ''}`}>
      <div className="embla__viewport" ref={viewportRef}>
        <div className="embla__container">
          {items.map((item, index) => {
            const inView = slidesInView.indexOf(index) > -1;
            return <>{renderer({ item, index, inView })}</>;
          })}
        </div>
      </div>

      {showArrows && (
        <div className="embla__controls">
          <div className="embla__buttons">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>
        </div>
      )}
    </div>
  );
}

export type ProjectCarouselProps = Omit<CarouselProps<Project>, 'items' | 'renderSlide'> & {
  projects: Project[];
};

export const ProjectCarousel: React.FC<ProjectCarouselProps> = (props) => {
  const { projects, ...rest } = props;
  return <Carousel<Project> items={projects} {...rest} />;
};
