# Augment Rules - Caro Game Project (Root)

## Project Overview
This is a full-stack Caro (Gomoku) game system with:
- Frontend: Next.js (TypeScript, SEO optimized, responsive)
- Backend: NestJS (TypeScript, WebSocket, Redis)
- Real-time multiplayer gameplay
- Elo ranking system
- Automated CI/CD with GitHub and Linear integration

## General Development Rules

### Code Quality Standards
- **TypeScript First**: All code must be written in TypeScript with strict type checking
- **No `any` types**: Use proper type definitions or `unknown` with type guards
- **Functional Components**: Use React functional components with hooks (no class components)
- **Async/Await**: Prefer async/await over promises chains
- **Error Handling**: Always implement proper error handling with try-catch blocks
- **Logging**: Use structured logging (Winston for backend, console with proper levels for frontend)

### Architecture Principles
- **Separation of Concerns**: Keep business logic separate from presentation and data layers
- **DRY (Don't Repeat Yourself)**: Extract reusable logic into utilities, hooks, or services
- **SOLID Principles**: Follow SOLID design principles, especially Single Responsibility
- **Microservice Ready**: Design with potential microservice extraction in mind
- **API First**: Design APIs before implementation

### File Organization
```
test-augment-coderabbit/
├── client/                 # Next.js frontend
├── server/                 # NestJS backend
├── shared/                 # Shared types and utilities
├── .augment/              # Augment configuration
├── .github/               # GitHub workflows and templates
└── docs/                  # Project documentation
```

### Naming Conventions
- **Files**: kebab-case (e.g., `game-board.tsx`, `user-service.ts`)
- **Components**: PascalCase (e.g., `GameBoard`, `PlayerCard`)
- **Functions/Variables**: camelCase (e.g., `handleMove`, `currentPlayer`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `BOARD_SIZE`, `WIN_CONDITION`)
- **Interfaces/Types**: PascalCase with descriptive names (e.g., `IGameState`, `PlayerMove`)
- **Enums**: PascalCase for enum name, UPPER_SNAKE_CASE for values

### Git Workflow
- **Branch Naming**:
  - Features: `feature/<feature-name>` (e.g., `feature/game-board-ui`)
  - Fixes: `fix/<bug-name>` (e.g., `fix/timer-countdown`)
  - Hotfixes: `hotfix/<issue-name>`
  - Refactor: `refactor/<component-name>`
- **Commit Messages**: Follow Conventional Commits
  - `feat: add game board component`
  - `fix: resolve timer countdown issue`
  - `refactor: optimize win condition check`
  - `docs: update API documentation`
  - `test: add unit tests for game logic`
- **PR Requirements**:
  - Must pass all CI checks
  - Must be reviewed by CodeRabbitAI
  - All CodeRabbit comments must be resolved
  - Must be linked to Linear task/issue
  - Auto-merge when all checks pass and approved

### Testing Requirements
- **Unit Tests**: Minimum 80% code coverage
- **Integration Tests**: For all API endpoints and WebSocket events
- **E2E Tests**: For critical user flows (game creation, gameplay, win conditions)
- **Test Files**: Co-locate with source files using `.test.ts` or `.spec.ts` suffix
- **Test Framework**: Jest for unit/integration, Playwright for E2E

### Performance Standards
- **Frontend**:
  - Lighthouse score > 90 for all metrics
  - First Contentful Paint < 1.5s
  - Time to Interactive < 3s
  - Use Next.js Image optimization
  - Implement code splitting and lazy loading
- **Backend**:
  - API response time < 200ms (p95)
  - WebSocket latency < 50ms
  - Redis caching for frequently accessed data
  - Database query optimization with indexes

### Security Requirements
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Validate all user inputs on both client and server
- **XSS Protection**: Sanitize all user-generated content
- **CSRF Protection**: Implement CSRF tokens for state-changing operations
- **Rate Limiting**: Implement rate limiting on all API endpoints
- **Environment Variables**: Never commit secrets, use .env files

### Accessibility (a11y)
- **WCAG 2.1 Level AA**: Minimum compliance level
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus indicators for all interactive elements

### Documentation
- **Code Comments**: Use JSDoc for functions and complex logic
- **README**: Each major directory should have a README.md
- **API Documentation**: OpenAPI/Swagger for all REST endpoints
- **Architecture Decisions**: Document in ADR (Architecture Decision Records) format
- **Inline Comments**: Explain "why" not "what" (code should be self-explanatory)

### Package Management
- **Use Bun**: Use `bun` for package management in all JavaScript/TypeScript projects
- **Lock Files**: Always commit lock files (bun.lockb)
- **Dependency Updates**: Regular security updates, review breaking changes
- **Minimal Dependencies**: Avoid unnecessary dependencies

### Code Review Checklist
Before submitting PR, ensure:
- [ ] Code follows project conventions and style guide
- [ ] All tests pass locally
- [ ] No console.log or debugging code
- [ ] No commented-out code
- [ ] Types are properly defined (no `any`)
- [ ] Error handling is implemented
- [ ] Performance considerations addressed
- [ ] Security best practices followed
- [ ] Accessibility requirements met
- [ ] Documentation updated
- [ ] Linear task linked in PR description

### Linear Integration
- **Epic**: Major feature sets (e.g., "Game Core Functionality")
- **Sprint**: 2-week iterations following Agile methodology
- **Story**: User-facing features (e.g., "As a player, I want to see my ranking")
- **Task**: Technical implementation work
- **Issue**: Bugs or technical debt
- **Status Flow**: Todo → In Progress → In Review → Done
- **PR Linking**: Always link GitHub PR to Linear task using task ID in branch name

### Automation Rules
- **Auto-create branches**: From Linear tasks with proper naming
- **Auto-create PRs**: When branch is pushed with commits
- **Auto-review**: CodeRabbitAI reviews all PRs automatically
- **Auto-fix**: Apply CodeRabbit suggestions when safe
- **Auto-merge**: Merge PR when all checks pass and approved
- **Auto-deploy**: Deploy to staging on merge to develop, production on merge to main

### Environment Setup
- **Node Version**: Use Node.js 20+ (LTS)
- **Package Manager**: Bun (latest stable)
- **IDE**: VSCode with recommended extensions
- **Required Extensions**:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense
  - GitLens
  - Error Lens

### Error Handling Patterns
```typescript
// Backend (NestJS)
try {
  const result = await this.gameService.makeMove(moveData);
  return { success: true, data: result };
} catch (error) {
  this.logger.error('Failed to make move', error);
  throw new HttpException(
    'Failed to process move',
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}

// Frontend (Next.js)
try {
  const response = await fetch('/api/game/move', { method: 'POST', body: JSON.stringify(move) });
  if (!response.ok) throw new Error('Move failed');
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Move error:', error);
  toast.error('Failed to make move. Please try again.');
  return null;
}
```

### State Management
- **Frontend**: Use React Context + useReducer for global state, React Query for server state
- **Backend**: Redis for session/game state, PostgreSQL for persistent data
- **WebSocket**: Socket.io for real-time game state synchronization

### Monitoring & Observability
- **Logging**: Structured JSON logs with correlation IDs
- **Metrics**: Track game metrics (active games, moves per second, etc.)
- **Alerts**: Set up alerts for critical errors and performance degradation
- **Tracing**: Implement distributed tracing for debugging

## Game-Specific Rules

### Game Constants
```typescript
export const GAME_CONFIG = {
  BOARD_SIZE: 16,
  WIN_CONDITION: 5,
  TURN_TIMEOUT: 30000, // 30 seconds in ms
  CHALLENGE_TIMEOUT: 10000, // 10 seconds in ms
  STARTING_ELO: 1000,
  ELO_WIN_POINTS: 3,
  ELO_DRAW_POINTS: 1,
  ELO_LOSE_POINTS: 0,
} as const;
```

### Game State Management
- Store game state in Redis with TTL
- Persist completed games to database
- Handle reconnection gracefully
- Validate all moves on server-side

### Real-time Communication
- Use Socket.io for WebSocket communication
- Implement room-based architecture
- Handle disconnections and reconnections
- Emit events for all game state changes

### Win Condition Logic
- Check horizontal, vertical, and diagonal lines
- Implement two-end block detection for intermediate level
- Validate on server-side only (client displays result)
- Store game result with winner, loser, and final board state

## Priority Order for Implementation
1. **Sprint 1**: Project setup, basic game board, player movement
2. **Sprint 2**: Real-time multiplayer, room management, challenge system
3. **Sprint 3**: Win condition logic, timer, game completion
4. **Sprint 4**: Elo system, rankings, player profiles
5. **Sprint 5**: Two-end block detection, draw/surrender features
6. **Sprint 6**: Reconnection handling, game state persistence
7. **Sprint 7**: UI/UX polish, animations, notifications
8. **Sprint 8**: Testing, bug fixes, performance optimization

