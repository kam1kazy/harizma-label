export type ProjectCategory = 'motion' | 'audio' | 'design';

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  cover: string;
  editor: string;
  director: string;
  audio?: string;
  description: string;
};

export type ProjectDictionary = {
  all: Project[];
  byCategory: Record<ProjectCategory, Project[]>;
};
