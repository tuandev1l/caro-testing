# Getting Started with Caro Game Development

This guide will help you get started with developing the Caro Game project.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20+ (LTS recommended)
- **Bun**: Latest stable version
- **PostgreSQL**: Version 15+
- **Redis**: Version 7+
- **Git**: Latest version
- **Docker & Docker Compose**: (Optional, for containerized development)
- **VSCode**: Recommended IDE with extensions

### Recommended VSCode Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "redhat.vscode-yaml"
  ]
}
```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended for Beginners)

This is the easiest way to get started. Docker will handle all dependencies.

```bash
# 1. Clone the repository
git clone https://github.com/tuandev1l/caro-testing.git
cd test-augment-coderabbit

# 2. Create environment files
cp client/.env.example client/.env.local
cp server/.env.example server/.env

# 3. Start all services
docker-compose up -d

# 4. View logs
docker-compose logs -f

# 5. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# API Docs: http://localhost:3001/api/docs
# pgAdmin: http://localhost:5050 (optional, use --profile tools)
```

### Option 2: Manual Setup (For Development)

This gives you more control and is better for active development.

#### Step 1: Install Dependencies

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

#### Step 2: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/tuandev1l/caro-testing.git
cd test-augment-coderabbit

# Install client dependencies
cd client
bun install

# Install server dependencies
cd ../server
bun install

# Return to root
cd ..
```

#### Step 3: Setup PostgreSQL

```bash
# Create database
createdb caro_game

# Or using psql
psql -U postgres
CREATE DATABASE caro_game;
\q
```

#### Step 4: Setup Redis

```bash
# Start Redis (if not running)
redis-server

# Or using Docker
docker run -d -p 6379:6379 redis:7-alpine
```

#### Step 5: Configure Environment Variables

**Client (.env.local)**:
```bash
cd client
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
```

**Server (.env)**:
```bash
cd server
cat > .env << EOF
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
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRATION=7d

# Client
CLIENT_URL=http://localhost:3000
EOF
```

#### Step 6: Run Database Migrations

```bash
cd server
bun run migration:run
```

#### Step 7: Start Development Servers

Open two terminal windows:

**Terminal 1 - Backend**:
```bash
cd server
bun run dev
```

**Terminal 2 - Frontend**:
```bash
cd client
bun run dev
```

#### Step 8: Verify Setup

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

## 📁 Project Structure

```
test-augment-coderabbit/
├── .augment/                   # Augment AI rules (root)
│   └── rules
├── .github/                    # GitHub workflows and templates
│   └── workflows/
│       └── ci.yml
├── client/                     # Next.js frontend
│   ├── .augment/              # Client-specific Augment rules
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities
│   │   ├── types/             # TypeScript types
│   │   └── styles/            # Global styles
│   ├── public/                # Static assets
│   └── package.json
├── server/                     # NestJS backend
│   ├── .augment/              # Server-specific Augment rules
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   ├── common/            # Shared code
│   │   ├── config/            # Configuration
│   │   ├── entities/          # TypeORM entities
│   │   └── main.ts            # Entry point
│   ├── test/                  # E2E tests
│   └── package.json
├── shared/                     # Shared types and utilities
│   └── types/
│       └── game.types.ts
├── docs/                       # Documentation
│   ├── project-plan.md
│   ├── linear-tasks-summary.md
│   └── getting-started.md
├── docker-compose.yml          # Docker Compose configuration
├── .coderabbit.yaml           # CodeRabbit configuration
└── README.md
```

## 🔧 Development Workflow

### 1. Pick a Task from Linear

1. Go to [Linear Project](https://linear.app/tuantm/project/online-caro-game-system-9b939746b664)
2. Pick a task from the backlog
3. Move it to "In Progress"
4. Note the issue ID (e.g., ISS-6)

### 2. Create a Feature Branch

```bash
# Format: feature/ISS-XX-short-description
git checkout -b feature/ISS-6-initialize-nextjs

# Or for fixes
git checkout -b fix/ISS-XX-bug-description
```

### 3. Develop the Feature

Follow the coding standards in `.augment/rules`:

- Write TypeScript with strict typing
- Follow naming conventions
- Add proper error handling
- Write tests for new code
- Update documentation

### 4. Run Tests Locally

```bash
# Client tests
cd client
bun run test              # Unit tests
bun run test:e2e          # E2E tests
bun run lint              # Linting
bun run type-check        # Type checking

# Server tests
cd server
bun run test              # Unit tests
bun run test:e2e          # E2E tests
bun run lint              # Linting
```

### 5. Commit Your Changes

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat(ISS-6): initialize Next.js with TypeScript and Tailwind"

# Other examples:
# git commit -m "fix(ISS-XX): resolve timer countdown issue"
# git commit -m "refactor(ISS-XX): optimize win condition check"
# git commit -m "docs(ISS-XX): update API documentation"
# git commit -m "test(ISS-XX): add unit tests for game logic"
```

### 6. Push and Create PR

```bash
# Push your branch
git push origin feature/ISS-6-initialize-nextjs

# Create PR on GitHub
# - Title: [ISS-6] Initialize Next.js with TypeScript and Tailwind
# - Description: Include Linear task link
# - CodeRabbitAI will review automatically
```

### 7. Address Review Comments

- CodeRabbitAI will review your PR automatically
- Address all comments and suggestions
- Push additional commits to the same branch
- All checks must pass before merge

### 8. Merge

- Once approved and all checks pass, PR will auto-merge
- Linear task will auto-update to "Done"
- Branch will be auto-deleted

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage
```

### E2E Tests

```bash
# Client E2E (Playwright)
cd client
bun run test:e2e

# Server E2E (Supertest)
cd server
bun run test:e2e
```

### Manual Testing

1. Start both client and server
2. Open http://localhost:3000
3. Test the feature manually
4. Check browser console for errors
5. Check server logs for errors

## 🐛 Debugging

### Client Debugging

1. Use React DevTools browser extension
2. Use `console.log` for quick debugging
3. Use VSCode debugger with launch configuration
4. Check Network tab for API calls

### Server Debugging

1. Use NestJS Logger for structured logging
2. Use VSCode debugger with launch configuration
3. Check database queries with TypeORM logging
4. Monitor Redis with Redis Commander

### Common Issues

**Issue**: Port already in use
```bash
# Find and kill process using port 3000 or 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Issue**: Database connection error
```bash
# Check if PostgreSQL is running
pg_isready

# Restart PostgreSQL
sudo service postgresql restart
```

**Issue**: Redis connection error
```bash
# Check if Redis is running
redis-cli ping

# Start Redis
redis-server
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Socket.io Documentation](https://socket.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Linear Documentation](https://linear.app/docs)
- [CodeRabbit Documentation](https://docs.coderabbit.ai)

## 🆘 Getting Help

If you encounter issues:

1. Check this documentation
2. Search existing GitHub issues
3. Check Linear for related tasks
4. Ask in team chat
5. Create a new issue on GitHub

## 🎯 Next Steps

Now that you're set up, you can:

1. ✅ Review the [Project Plan](project-plan.md)
2. ✅ Check [Linear Tasks](linear-tasks-summary.md)
3. ✅ Pick your first task from Sprint 1
4. ✅ Start coding!

Happy coding! 🚀

