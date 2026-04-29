# Kanban MVP Plan

## Phase 1: Project Scaffolding

Success criteria:
- [x] `frontend` contains a modern client-rendered Next.js app.
- [x] Root project includes a practical `.gitignore`.
- [x] App scripts support development, linting, unit tests, and integration tests.
- [x] Dependencies stay popular, current, and focused on the MVP.

## Phase 2: Core Kanban Experience

Success criteria:
- [x] Single board opens with dummy data.
- [x] Board has exactly five columns.
- [x] Column names can be renamed inline.
- [x] Cards contain only title and details.
- [x] Users can add cards to any column.
- [x] Users can delete cards.
- [x] Users can drag cards between columns.
- [x] No persistence, user accounts, archive, search, filtering, or extra features are present.

## Phase 3: Professional UI

Success criteria:
- [x] UI uses the required color scheme.
- [x] Layout is responsive and polished on desktop and mobile.
- [x] Controls are clear, compact, and suited to repeat project-management workflows.
- [x] Text fits cleanly inside controls and cards.
- [x] The first screen is the usable board, not a landing page.

## Phase 4: Unit Testing

Success criteria:
- [x] Data helpers and board interactions have focused unit coverage.
- [x] Tests verify adding, deleting, renaming, and moving cards.
- [x] Test setup is simple and documented through scripts.

## Phase 5: Integration Testing

Success criteria:
- [x] Playwright verifies the app loads with five populated columns.
- [x] Playwright verifies adding, deleting, renaming, and drag-and-drop movement.
- [x] Defects found during integration testing are fixed.

## Phase 6: Final Verification

Success criteria:
- [x] Lint passes.
- [x] Unit tests pass.
- [x] Playwright tests pass.
- [x] Development server is running and ready for review.
