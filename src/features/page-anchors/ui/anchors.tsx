import clsx from 'clsx';

import type { PageAnchorsProps } from '../model/types';

export function PageAnchors({ items, className }: PageAnchorsProps) {
  return (
    <nav className={clsx('flex flex-wrap items-center gap-9', className)}>
      {items.map((item, index) => (
        <a
          key={item.href}
          href={item.href}
          className={clsx(
            'relative text-sm uppercase tracking-[0.45em] text-white/80 transition hover:text-white',
            index < items.length - 1 &&
              "after:absolute after:left-full after:top-1/2 after:block after:h-2 after:w-2 after:-translate-y-1/2 after:translate-x-3 after:rounded-full after:bg-white after:content-['']"
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
