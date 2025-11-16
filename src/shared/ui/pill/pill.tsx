import clsx from 'clsx';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type PillProps = PropsWithChildren<{
  active?: boolean;
}> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function Pill({ active, className, children, ...rest }: PillProps) {
  return (
    <button
      type="button"
      className={clsx(
        'relative overflow-hidden px-0 py-0 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors duration-300',
        className
      )}
      {...rest}
    >
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 origin-left -skew-x-[18deg] scale-x-0 bg-[#a246ff] opacity-0 transition-all duration-300 ease-out',
          active && 'scale-x-100 opacity-100'
        )}
      />
      <span className="relative flex items-center">{children}</span>
    </button>
  );
}
