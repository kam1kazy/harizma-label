import clsx from 'clsx';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ChipProps = PropsWithChildren<{
  active?: boolean;
}> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function Chip({ active, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={clsx(
        'cursor-pointer rounded-full border px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] transition-all',
        active
          ? 'border-[#a246ff] text-[#a246ff]'
          : 'border-white/20 text-white/60 hover:text-white',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
