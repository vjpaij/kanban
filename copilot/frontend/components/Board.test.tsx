import React from 'react';
import { render, screen } from '@testing-library/react';
import Board from '@/components/Board';
import { initialColumns } from '@/lib/data';

describe('Board', () => {
  it('renders five columns and the add card form', () => {
    render(<Board initialColumns={initialColumns} />);

    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('Planned')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getAllByText('Add card')[0]).toBeInTheDocument();
  });
});
