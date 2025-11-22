'use client';

import { PageAnchors } from '@/features/page-anchors';
import { IconButton } from '@/shared/ui/icon-button';
import { SocialLinks } from '@/shared/ui/social-links';
import { FiMenu } from 'react-icons/fi';

export function HeroSection() {
  return (
    <section className="px-6 pb-16 pt-12 text-white sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-12">
        <header className="relative flex min-h-[70px] items-center justify-center">
          <span className="text-[26px] font-semibold uppercase tracking-[1em] text-white">
            Harizma
          </span>
          <IconButton
            variant="filled"
            className="absolute right-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition hover:bg-white/90"
          >
            <FiMenu size={20} />
          </IconButton>
        </header>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <PageAnchors
            items={[
              { href: '#artists', label: 'Artists' },
              { href: '#releases', label: 'Releases' },
              { href: '#contacts', label: 'Contacts' },
            ]}
          />
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
