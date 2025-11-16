import clsx from 'clsx';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type IconButtonProps = PropsWithChildren<{
  variant?: 'ghost' | 'filled';
}> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ variant = 'ghost', className, children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        {
          'border-white/20 text-white/80 hover:border-white/60 hover:text-white':
            variant === 'ghost',
          'border-[#a246ff] bg-[#a246ff] shadow-[0_0_20px_rgba(162,70,255,0.4)]':
            variant === 'filled',
        },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
