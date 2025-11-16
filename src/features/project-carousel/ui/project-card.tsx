import type { Project } from '@/entities/project';
import clsx from 'clsx';
import Image from 'next/image';

type ProjectCardProps = {
  project: Project;
  active?: boolean;
};

export function ProjectCard({ project, active }: ProjectCardProps) {
  return (
    <div
      className={clsx(
        'relative h-[520px] min-w-[260px] flex-1 cursor-pointer overflow-hidden rounded-[28px] border bg-black transition-all duration-500',
        active
          ? 'scale-100 border-white shadow-[0_20px_40px_rgba(0,0,0,0.65)]'
          : 'border-white/15 scale-95 opacity-80'
      )}
    >
      <Image
        src={project.cover}
        alt={project.title}
        fill
        sizes="(min-width: 1024px) 33vw, 90vw"
        className={clsx(
          'object-cover transition-transform duration-700',
          active ? 'scale-105' : 'scale-100'
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-8 text-left">
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">{project.category}</p>
        <h3 className="text-3xl font-semibold uppercase tracking-[0.2em] text-white">
          {project.title}
        </h3>
        <div className="text-sm text-white/70">
          Editor — {project.editor}
          <br />
          Director — {project.director}
        </div>
      </div>
      {active ? (
        <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a246ff] px-8 py-2 text-xs font-semibold uppercase tracking-[0.5em] text-[#a246ff]">
          Play
        </button>
      ) : (
        <div className="pointer-events-none absolute right-6 top-6 rounded-full border border-white/30 px-5 py-2 text-[10px] uppercase tracking-[0.4em] text-white/60">
          Hold+Drag
        </div>
      )}
    </div>
  );
}
