'use client';

import clsx from 'clsx';

import type { ProjectCategory } from '@/entities/project';
import { Pill } from '@/shared/ui/pill';

const tabs: Array<{ value: 'all' | ProjectCategory; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'motion', label: 'Motion' },
  { value: 'audio', label: 'Audio' },
  { value: 'design', label: 'Design' },
];

type FilterTabsProps = {
  value: 'all' | ProjectCategory;
  onChange: (value: 'all' | ProjectCategory) => void;
};

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab, index) => (
        <div
          key={tab.value}
          className={clsx(
            'relative inline-flex',
            index < tabs.length - 1 &&
              "after:absolute after:left-full after:top-1/2 after:block after:h-2 after:w-2 after:-translate-y-1/2 after:translate-x-3 after:rounded-full after:bg-white after:content-['']"
          )}
        >
          <Pill active={value === tab.value} onClick={() => onChange(tab.value)}>
            {tab.label}
          </Pill>
        </div>
      ))}
    </div>
  );
}
