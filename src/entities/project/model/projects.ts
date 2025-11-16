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
    title: 'Neon Dreams',
    category: 'motion',
    cover: '',
    editor: 'Emily Moon',
    director: 'Json Marino',
    description:
      'Ночная история, полная неонового света, городского драмы и хрупких мелодий, созданных вручную.',
  },
  {
    id: 'star-dust',
    title: 'Star Dust',
    category: 'motion',
    cover: '',
    editor: 'Alex Wills',
    director: 'Ivy Harada',
    description:
      'Экспедиция в пустыню, где каждая песчинка сверкает, как новый такт электронной симфонии.',
  },
  {
    id: 'creative-era',
    title: 'Creative Era',
    category: 'design',
    cover: '',
    editor: 'Maya Stone',
    director: 'Leo Alvarez',
    description:
      'Серия концептуальных портретов о людях, которые создают будущее визуального искусства.',
  },
  {
    id: 'electric-rain',
    title: 'Electric Rain',
    category: 'audio',
    cover: '',
    editor: 'Sora Gale',
    director: 'Nick Devon',
    description: 'Хроника студийных ночей, где ритм дождя превращается в пульс техно-сетов.',
  },
  {
    id: 'hold-tight',
    title: 'Hold Tight',
    category: 'design',
    cover: '',
    editor: 'Lia Price',
    director: 'Tomás Vega',
    description: 'Монохромная серия про прикосновения, материал и честность в каждом кадре.',
  },
];
