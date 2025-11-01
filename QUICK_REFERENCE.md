# 🚀 Quick Reference Guide

## 📁 Project Structure

```
test-augment-coderabbit/
├── .augment/                  # Documentation and rules
│   ├── rules.md              # Root Augment rules
│   ├── project-plan.md       # Project plan
│   └── getting-started.md    # Developer guide
├── .github/workflows/ci.yml   # CI/CD pipeline
├── docker-compose.yml         # Docker setup
├── client/                    # Next.js frontend
│   └── .augment/rules.md     # Client rules
├── server/                    # NestJS backend
│   └── .augment/rules.md     # Server rules
├── shared/types/              # Shared TypeScript types
└── docs/                      # Documentation
```

## 🔗 Quick Links

| Resource       | URL                                                                    |
| -------------- | ---------------------------------------------------------------------- |
| Linear Project | https://linear.app/tuantm/project/online-caro-game-system-9b939746b664 |
| GitHub Repo    | https://github.com/tuandev1l/caro-testing                              |
| Frontend (dev) | http://localhost:3000                                                  |
| Backend (dev)  | http://localhost:3001                                                  |
| API Docs (dev) | http://localhost:3001/api/docs                                         |

## 🎯 Common Commands

### Setup

```bash
# Clone and setup
git clone https://github.com/tuandev1l/caro-testing.git
cd test-augment-coderabbit

# Docker (easiest)
docker-compose up -d

# Manual setup
cd client && bun install
cd ../server && bun install
```

### Development

```bash
# Start client
cd client && bun run dev

# Start server
cd server && bun run dev

# Start both with Docker
docker-compose up
```

### Testing

```bash
# Client
cd client
bun run test              # Unit tests
bun run test:e2e          # E2E tests
bun run test:coverage     # Coverage

# Server
cd server
bun run test              # Unit tests
bun run test:e2e          # E2E tests
bun run test:coverage     # Coverage
```

### Code Quality

```bash
# Lint
bun run lint

# Type check
bun run type-check

# Format
bun run format

# Build
bun run build
```

## 📝 Git Workflow

### Branch Naming

```bash
feature/ISS-XX-short-description
fix/ISS-XX-bug-description
refactor/ISS-XX-refactor-description
```

### Commit Messages

```bash
feat(ISS-XX): add new feature
fix(ISS-XX): fix bug
refactor(ISS-XX): refactor code
docs(ISS-XX): update docs
test(ISS-XX): add tests
chore(ISS-XX): update tooling
```

### Workflow

```bash
# 1. Create branch
git checkout -b feature/ISS-6-initialize-nextjs

# 2. Make changes and commit
git add .
git commit -m "feat(ISS-6): initialize Next.js"

# 3. Push
git push origin feature/ISS-6-initialize-nextjs

# 4. Create PR on GitHub
# 5. Wait for manual review
# 6. Manual merge after approval
```

## 🎮 Game Constants

```typescript
BOARD_SIZE: 16
WIN_CONDITION: 5
TURN_TIMEOUT: 30000 ms (30s)
CHALLENGE_TIMEOUT: 10000 ms (10s)
STARTING_ELO: 1000
ELO_WIN_POINTS: 3
ELO_DRAW_POINTS: 1
ELO_LOSE_POINTS: 0
```

## 📊 Sprint Overview

| Sprint | Focus        | Issues           |
| ------ | ------------ | ---------------- |
| 1      | Foundation   | ISS-5 to ISS-10  |
| 2      | Auth         | ISS-11 to ISS-14 |
| 3      | Game Board   | ISS-15 to ISS-18 |
| 4      | Multiplayer  | ISS-19 to ISS-22 |
| 5      | Game Flow    | ISS-23 to ISS-25 |
| 6      | Win Logic    | ISS-26 to ISS-28 |
| 7      | Elo System   | ISS-29 to ISS-31 |
| 8      | Reconnection | ISS-32 to ISS-34 |

## 🔧 Environment Variables

### Client (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Server (.env)

```env
NODE_ENV=development
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=caro_game
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
CLIENT_URL=http://localhost:3000
```

## 🐛 Troubleshooting

### Port in use

```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Database issues

```bash
# Check PostgreSQL
pg_isready

# Restart PostgreSQL
sudo service postgresql restart

# Recreate database
dropdb caro_game
createdb caro_game
```

### Redis issues

```bash
# Check Redis
redis-cli ping

# Start Redis
redis-server
```

### Clear Docker

```bash
docker-compose down -v
docker-compose up -d
```

## 📚 Documentation

| Document                     | Description      |
| ---------------------------- | ---------------- |
| README.md                    | Project overview |
| PROJECT_SETUP_COMPLETE.md    | Setup summary    |
| docs/project-plan.md         | 8-sprint plan    |
| docs/linear-tasks-summary.md | Linear tasks     |
| docs/getting-started.md      | Developer guide  |
| .augment/rules               | Root rules       |
| client/.augment/rules        | Client rules     |
| server/.augment/rules        | Server rules     |

## 🎯 Success Criteria

### Technical

- [ ] Test coverage > 80%
- [ ] Lighthouse score > 90
- [ ] API response < 200ms
- [ ] WebSocket latency < 50ms
- [ ] Zero critical vulnerabilities

### Product

- [ ] All 3 game levels implemented
- [ ] Real-time multiplayer working
- [ ] Elo system functional
- [ ] Reconnection handling works
- [ ] User-friendly UI/UX

## 🤝 Team

- **Lead**: Trịnh Minh Tuấn (@tuandev1l)
- **GitHub**: https://github.com/tuandev1l
- **Email**: 86116547+tuandev1l@users.noreply.github.com

## 📞 Support

- Create GitHub issue
- Create Linear task
- Check documentation
- Contact team lead

---

**Quick Start**: `docker-compose up -d` → http://localhost:3000

**First Task**: ISS-6 - Initialize Next.js Client

**Linear**: https://linear.app/tuantm/project/online-caro-game-system-9b939746b664
