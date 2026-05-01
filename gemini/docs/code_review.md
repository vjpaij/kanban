# Code Review: Kanban Board MVP

## Overview

This is a Next.js 16 client-rendered Kanban application using React 19, @dnd-kit for drag-and-drop, and Vitest/Playwright for testing. The codebase is well-structured for an MVP.

---

## Strengths

### Architecture
- Clean separation of concerns: context for state, components for UI, CSS for styling
- Proper use of React Context for global state management
- Dynamic import with `ssr: false` for client-only KanbanBoard component (line 6, page.tsx)

### TypeScript
- Proper typing with exported types: `Card`, `Column`, `KanbanState`, `KanbanContextType`
- Interface definitions for component props

### Testing
- Unit tests for KanbanContext (Vitest)
- E2E tests covering core functionality (Playwright)
- Good test coverage of add, delete, rename operations

### CSS/Design
- CSS variables for consistent theming
- Glassmorphism aesthetic with backdrop-filter effects
- Smooth animations and hover states
- Custom scrollbar styling

---

## Issues & Recommendations

### 1. ESLint Issue (High Priority)

**File:** `e2e/kanban.spec.ts:10`

The test expects `h1` to contain "Kanban MVP" but the actual header in `layout.tsx` renders "KanbanPro". This test will fail.

```typescript
// Current (test)
await expect(page.locator('h1')).toContainText('Kanban MVP');

// Actual (layout.tsx line 24)
<h1>Kanban<span className="accent">Pro</span></h1>
```

---

### 2. Unused Import

**File:** `KanbanBoard.tsx:42-48`

`handleDragOver` is defined but does nothing. Either implement it or remove it.

```typescript
const handleDragOver = (event: DragOverEvent) => {
  const { over } = event;
  if (!over) return;
  // Empty - logic handled in dragEnd
};
```

---

### 3. ID Generation

**File:** `KanbanContext.tsx:62-63`

Using `Date.now()` + random for IDs is acceptable for MVP but has collision risk. Consider using `crypto.randomUUID()` for better uniqueness.

```typescript
// Current
id: `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`

// Recommended
id: crypto.randomUUID()
```

---

### 4. Missing Keyboard Accessibility

**File:** `KanbanColumn.tsx:52-73`, `KanbanCard.tsx:42-63`

- Column title is clickable for editing but not keyboard-accessible (no `role="button"`, no `tabIndex`)
- Delete button has good `aria-label` but could benefit from keyboard shortcuts

---

### 5. Unused State Reset on Cancel

**File:** `KanbanColumn.tsx:102`

When cancelling card addition, `newCardDetails` is not reset (only `newCardTitle` is cleared on submit). Should reset on cancel:

```typescript
<button type="button" className="btn-cancel" onClick={() => {
  setIsAddingCard(false);
  setNewCardTitle("");
  setNewCardDetails("");
}}>Cancel</button>
```

---

### 6. Missing Error Boundary

No error boundary wrapping the KanbanBoard. If DnD context throws, the entire app crashes.

---

### 7. CSS Organization

`Kanban.css` is large (283 lines). Consider splitting into:
- `KanbanColumn.css`
- `KanbanCard.css`
- Or use CSS modules

---

### 8. No Input Validation

- Empty card titles can be submitted (handled by trim check on submit, but UX could be better)
- No character limits on title/details fields

---

## Test Results Summary

| Test | Status |
|------|--------|
| Initial columns & dummy data | FAIL (header text mismatch) |
| Add new card | Should pass |
| Delete card | Should pass |
| Rename column | Should pass |

---

## Conclusion

The codebase is clean, well-organized, and meets MVP requirements. Main issues are:
1. E2E test needs update for header text
2. Minor cleanup (unused code)
3. Optional enhancements for accessibility and robustness

Overall: **Good quality for MVP** - ready for production with minor fixes.