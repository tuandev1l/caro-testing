# 🎮 Caro Game - Online Gomoku Platform

A full-stack, real-time multiplayer Caro (Gomoku) game with Elo ranking system, built with modern web technologies.

## 🌟 Features

### 🟢 Basic Level

- **16x16 Game Board**: Classic Gomoku gameplay
- **Real-time Multiplayer**: WebSocket-based instant gameplay
- **Room System**: Create and join game rooms (max 2 players)
- **Challenge Mechanism**: 10-second countdown before game starts
- **Turn Timer**: 30-second timer per move with auto-lose on timeout
- **Win Detection**: Automatic detection of 5 consecutive pieces

### 🟡 Intermediate Level

- **Two-End Block Detection**: Advanced win condition validation
- **Draw System**: Propose and accept draw offers
- **Surrender Option**: Give up when the game is lost
- **Elo Rating System**: Starting at 1000, +3 for win, +1 for draw
- **Player Rankings**: Leaderboard sorted by Elo rating
- **Statistics**: Win rate, total games, wins/losses/draws

### 🔴 Advanced Level

- **Reconnection Handling**: Resume games after network disconnection
- **State Persistence**: Game state stored in Redis
- **Network Resilience**: Automatic reconnection with exponential backoff
- **Error Recovery**: Comprehensive error handling and retry mechanisms

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Next.js 14+   │ ◄─────► │   NestJS 10+    │
│   (Frontend)    │ WebSocket│   (Backend)     │
│                 │         │                 │
│  - TypeScript   │         │  - TypeScript   │
│  - Tailwind CSS │         │  - Socket.io    │
│  - shadcn/ui    │         │  - TypeORM      │
│  - React Query  │         │  - JWT Auth     │
└─────────────────┘         └─────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
            │  PostgreSQL  │ │   Redis    │ │  Socket.io │
            │  (Database)  │ │  (Cache)   │ │ (Real-time)│
            └──────────────┘ └────────────┘ └────────────┘
```

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + React Query
- **Real-time**: Socket.io Client
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library + Playwright

### Backend

- **Framework**: NestJS 10+
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL + TypeORM
- **Cache**: Redis (ioredis)
- **WebSocket**: Socket.io
- **Authentication**: JWT
- **Validation**: class-validator
- **Testing**: Jest + Supertest

### DevOps

- **Package Manager**: Bun
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Project Management**: Linear
- **Containerization**: Docker + Docker Compose

## 📦 Installation

### Prerequisites

- Node.js 20+ (LTS)
- Bun (latest stable)
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/tuandev1l/caro-testing.git
cd test-augment-coderabbit

# Start all services with Docker Compose
docker-compose up -d

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:3001
# - API Docs: http://localhost:3001/api/docs
```

### Manual Setup

#### 1. Install Dependencies

```bash
# Install client dependencies
cd client
bun install

# Install server dependencies
cd ../server
bun install
```

#### 2. Environment Configuration

**Client (.env.local)**:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Server (.env)**:

```env
NODE_ENV=development
PORT=3001

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=caro_game

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=7d

# Client
CLIENT_URL=http://localhost:3000
```

#### 3. Database Setup

```bash
# Create database
createdb caro_game

# Run migrations
cd server
bun run migration:run

# Seed database (optional)
bun run seed
```

#### 4. Start Development Servers

```bash
# Terminal 1 - Start backend
cd server
bun run dev

# Terminal 2 - Start frontend
cd client
bun run dev
```

## 🧪 Testing

### Run All Tests

```bash
# Client tests
cd client
bun run test              # Unit tests
bun run test:e2e          # E2E tests
bun run test:coverage     # Coverage report

# Server tests
cd server
bun run test              # Unit tests
bun run test:e2e          # E2E tests
bun run test:coverage     # Coverage report
```

### Test Coverage Requirements

- Minimum 80% code coverage
- All critical paths must have tests
- E2E tests for user flows

## 📚 Documentation

- **Project Plan**: [.augment/project-plan.md](.augment/project-plan.md)
- **Linear Tasks**: [.augment/linear-tasks-summary.md](.augment/linear-tasks-summary.md)
- **Getting Started**: [.augment/getting-started.md](.augment/getting-started.md)
- **Augment Rules**: [.augment/rules.md](.augment/rules.md)
- **Client Rules**: [client/.augment/rules.md](client/.augment/rules.md)
- **Server Rules**: [server/.augment/rules.md](server/.augment/rules.md)
- **API Documentation**: http://localhost:3001/api/docs (when server is running)

## 🔄 Development Workflow

### 1. Pick a Task from Linear

- Browse tasks at: https://linear.app/tuantm/project/online-caro-game-system-9b939746b664
- Move task to "In Progress"

### 2. Create Feature Branch

```bash
git checkout -b feature/ISS-XX-short-description
```

### 3. Develop & Test

- Follow coding standards in `.augment/rules`
- Write tests for new features
- Ensure all tests pass locally

### 4. Commit Changes

```bash
git add .
git commit -m "feat(ISS-XX): Add feature description"
```

### 5. Push & Create PR

```bash
git push origin feature/ISS-XX-short-description
```

- Create PR on GitHub
- Wait for manual review and approval

### 6. Merge

- All checks must pass
- Manual approval required
- Auto-merge when approved
- Linear task auto-updates to "Done"

## 🎯 Game Rules

### Basic Rules

1. Two players take turns placing pieces (X and O)
2. First player to get 5 consecutive pieces wins
3. Consecutive pieces can be horizontal, vertical, or diagonal
4. Each player has 30 seconds per turn
5. Timeout results in automatic loss

### Challenge System

1. Both players must press "Challenge" to start
2. If both press → game starts immediately
3. If one doesn't press → 10-second countdown, then auto-start

### Elo System

- Starting Elo: 1000
- Win: +3 points
- Draw: +1 point
- Loss: 0 points

### Two-End Block (Intermediate)

Patterns like `XOOOOOX` or `OXXXXXO` are NOT considered wins (both ends blocked).

## 🏆 Project Milestones

- [x] Sprint 1: Foundation & Infrastructure (Week 1-2)
- [ ] Sprint 2: Authentication & User Management (Week 3-4)
- [ ] Sprint 3: Game Board & Basic Gameplay (Week 5-6)
- [ ] Sprint 4: Real-time Multiplayer & Room System (Week 7-8)
- [ ] Sprint 5: Challenge System & Game Flow (Week 9-10)
- [ ] Sprint 6: Win Condition & Game Logic (Week 11-12)
- [ ] Sprint 7: Elo System & Rankings (Week 13-14)
- [ ] Sprint 8: Reconnection & State Persistence (Week 15-16)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/ISS-XX-amazing-feature`)
3. Commit your changes (`git commit -m 'feat(ISS-XX): Add amazing feature'`)
4. Push to the branch (`git push origin feature/ISS-XX-amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(ISS-XX):` New feature
- `fix(ISS-XX):` Bug fix
- `refactor(ISS-XX):` Code refactoring
- `docs(ISS-XX):` Documentation changes
- `test(ISS-XX):` Test changes
- `chore(ISS-XX):` Build/tooling changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: Trịnh Minh Tuấn (@tuandev1l)
- **GitHub**: https://github.com/tuandev1l
- **Linear**: https://linear.app/tuantm

## 🔗 Links

- **GitHub Repository**: https://github.com/tuandev1l/caro-testing
- **Linear Project**: https://linear.app/tuantm/project/online-caro-game-system-9b939746b664
- **Production URL**: TBD
- **Staging URL**: TBD

## 📞 Support

For issues and questions:

- Create an issue on GitHub
- Create a task in Linear
- Contact the team lead

---

**Built with ❤️ using Next.js, NestJS, and modern web technologies**
