import Image from 'next/image';
import { useCallback, useState } from 'react';
import type { LazyImageProps } from '../model/types';

const PLACEHOLDER_SRC = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

export const LazyImage: React.FC<LazyImageProps> = (props) => {
  const { src, alt, inView, width, height, className, imgClassName } = props;
  const [hasLoaded, setHasLoaded] = useState(false);

  const setLoaded = useCallback(() => {
    if (inView) setHasLoaded(true);
  }, [inView]);

  return (
    <div
      className={`embla__lazy-load${hasLoaded ? ' embla__lazy-load--has-loaded' : ''} ${className ?? ''}`}
    >
      {!hasLoaded && <span className="embla__lazy-load__spinner" />}
      <Image
        className={`embla__slide__img embla__lazy-load__img ${imgClassName ?? ''}`}
        onLoad={setLoaded}
        src={inView ? src : PLACEHOLDER_SRC}
        alt={alt}
        data-src={src}
        width={width}
        height={height}
      />
    </div>
  );
};
