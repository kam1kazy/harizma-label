import type { Project, ProjectCategory } from './types';

export const projectCategories: Array<{ value: 'all' | ProjectCategory; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'motion', label: 'Motion' },
  { value: 'audio', label: 'Audio' },
  { value: 'design', label: 'Design' },
];

export const projects: Project[] = [
  {
    id: 'neon-dreams',
    title: 'NEON DREAMS',
    category: 'motion',
    cover: '/promo.jpg',
    artist: 'Emily Moon',
    description:
      'Ночная история, полная неонового света, городского драмы и хрупких мелодий, созданных вручную.',
  },
  {
    id: 'star-dust',
    title: 'STAR DUST',
    category: 'motion',
    cover: '/promo.jpg',
    artist: 'Alex Wills',
    description:
      'Экспедиция в пустыню, где каждая песчинка сверкает, как новый такт электронной симфонии.',
  },
  {
    id: 'creative-era',
    title: 'CREATIVE ERA',
    category: 'design',
    cover: '/promo.jpg',
    artist: 'Maya Stone',
    description:
      'Серия концептуальных портретов о людях, которые создают будущее визуального искусства.',
  },
  {
    id: 'creative-era',
    title: 'CREATIVE ERA',
    category: 'design',
    cover: '/promo.jpg',
    artist: 'Maya Stone',
    description:
      'Серия концептуальных портретов о людях, которые создают будущее визуального искусства.',
  },
  {
    id: 'creative-era',
    title: 'CREATIVE ERA',
    category: 'design',
    cover: '/promo.jpg',
    artist: 'Maya Stone',
    description:
      'Серия концептуальных портретов о людях, которые создают будущее визуального искусства.',
  },
  {
    id: 'creative-era',
    title: 'CREATIVE ERA',
    category: 'design',
    cover: '/promo.jpg',
    artist: 'Maya Stone',
    description:
      'Серия концептуальных портретов о людях, которые создают будущее визуального искусства.',
  },
];
