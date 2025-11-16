'use client';

import type { Project } from '@/entities/project';
import { IconButton } from '@/shared/ui/icon-button';
import { useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ProjectCard } from './project-card';

type CarouselProps = {
  projects: Project[];
  activeIndex: number;
  onChange: (index: number) => void;
};

export function ProjectsCarousel({ projects, activeIndex, onChange }: CarouselProps) {
  const hasProjects = projects.length > 0;
  const safeIndex = hasProjects
    ? ((activeIndex % projects.length) + projects.length) % projects.length
    : 0;

  const ordered = useMemo(() => {
    if (!hasProjects) return [];
    if (projects.length <= 3) {
      return projects.map((project, index) => ({
        project,
        isActive: index === safeIndex,
      }));
    }
    const len = projects.length;
    const prevIndex = (safeIndex - 1 + len) % len;
    const nextIndex = (safeIndex + 1) % len;
    return [
      { project: projects[prevIndex], isActive: false },
      { project: projects[safeIndex], isActive: true },
      { project: projects[nextIndex], isActive: false },
    ];
  }, [projects, safeIndex, hasProjects]);

  const next = () => {
    if (!hasProjects) return;
    onChange((safeIndex + 1) % projects.length);
  };
  const prev = () => {
    if (!hasProjects) return;
    onChange((safeIndex - 1 + projects.length) % projects.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-3">
        <IconButton onClick={prev} disabled={!hasProjects}>
          <FiChevronLeft size={18} />
        </IconButton>
        <IconButton onClick={next} disabled={!hasProjects}>
          <FiChevronRight size={18} />
        </IconButton>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {ordered.map(({ project, isActive }) => (
          <ProjectCard key={project.id} project={project} active={isActive} />
        ))}
      </div>
    </div>
  );
}
