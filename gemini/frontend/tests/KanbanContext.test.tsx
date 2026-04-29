import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { expect, test } from 'vitest';
import { KanbanProvider, useKanban } from '../src/context/KanbanContext';

// Test component to access context
function TestComponent() {
  const { columns, cards, renameColumn, addCard, deleteCard, moveCard } = useKanban();

  return (
    <div>
      <div data-testid="col-count">{columns.length}</div>
      <div data-testid="card-count">{cards.length}</div>
      <div data-testid="first-col-title">{columns[0]?.title}</div>
      
      <button onClick={() => renameColumn(columns[0].id, 'New Title')}>Rename</button>
      <button onClick={() => addCard(columns[0].id, 'New Card', 'Details')}>Add</button>
      <button onClick={() => deleteCard(cards[0].id)}>Delete</button>
      <button onClick={() => moveCard(cards[0].id, columns[1].id)}>Move</button>
    </div>
  );
}

test('KanbanContext provides default state and actions', () => {
  render(
    <KanbanProvider>
      <TestComponent />
    </KanbanProvider>
  );

  // Initial state (5 columns, 4 cards)
  expect(screen.getByTestId('col-count').textContent).toBe('5');
  expect(screen.getByTestId('card-count').textContent).toBe('4');
  expect(screen.getByTestId('first-col-title').textContent).toBe('To Do');

  // Test Rename
  act(() => {
    screen.getByText('Rename').click();
  });
  expect(screen.getByTestId('first-col-title').textContent).toBe('New Title');

  // Test Add Card
  act(() => {
    screen.getByText('Add').click();
  });
  expect(screen.getByTestId('card-count').textContent).toBe('5');

  // Test Delete Card
  act(() => {
    screen.getByText('Delete').click();
  });
  expect(screen.getByTestId('card-count').textContent).toBe('4');
});
