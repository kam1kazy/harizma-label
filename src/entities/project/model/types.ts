export type ProjectCategory = 'motion' | 'audio' | 'design';

export type Project = {
  id: string;
  title: string; // track title
  category: ProjectCategory;
  cover: string;
  artist: string;
  audio?: string; // optional audio preview/source
  description: string;
};

export type ProjectDictionary = {
  all: Project[];
  byCategory: Record<ProjectCategory, Project[]>;
};
