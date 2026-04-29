import type { Column } from '@/lib/types';

export const initialColumns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    cards: [
      { id: 'card-1', title: 'Project kickoff', details: 'Align on scope and milestones with the team.' },
      { id: 'card-2', title: 'Design system audit', details: 'Review existing patterns before building cards.' },
    ],
  },
  {
    id: 'planned',
    title: 'Planned',
    cards: [
      { id: 'card-3', title: 'Define columns', details: 'Finalize the five fixed columns for the board.' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [
      { id: 'card-4', title: 'Implement drag and drop', details: 'Set up DnD using dnd-kit for card movement.' },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    cards: [
      { id: 'card-5', title: 'UI polish', details: 'Refine spacing, shadows, and interaction states.' },
    ],
  },
  {
    id: 'complete',
    title: 'Complete',
    cards: [
      { id: 'card-6', title: 'Dummy data seed', details: 'Load sample cards on first render.' },
    ],
  },
];
