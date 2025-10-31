# Augment Rules - Client (Next.js Frontend)

## Overview
Next.js 14+ application with TypeScript, focused on SEO, performance, and real-time gameplay.

## Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + useReducer, React Query for server state
- **Real-time**: Socket.io client
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest + React Testing Library + Playwright
- **Package Manager**: Bun

## Project Structure
```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth group routes
│   │   ├── (game)/            # Game group routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── game/             # Game-specific components
│   │   ├── layout/           # Layout components
│   │   └── shared/           # Shared components
│   ├── hooks/                # Custom React hooks
│   │   ├── use-socket.ts     # WebSocket hook
│   │   ├── use-game.ts       # Game state hook
│   │   └── use-auth.ts       # Auth hook
│   ├── lib/                  # Utilities and helpers
│   │   ├── api.ts           # API client
│   │   ├── socket.ts        # Socket.io setup
│   │   └── utils.ts         # General utilities
│   ├── types/               # TypeScript types
│   ├── contexts/            # React contexts
│   ├── styles/              # Global styles
│   └── constants/           # Constants and config
├── public/                  # Static assets
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── package.json
```

## Component Development Rules

### Component Structure
```typescript
// components/game/game-board.tsx
'use client'; // Only if client-side interactivity needed

import { FC, memo } from 'react';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  size: number;
  board: (string | null)[][];
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
  className?: string;
}

export const GameBoard: FC<GameBoardProps> = memo(({
  size,
  board,
  onCellClick,
  disabled = false,
  className,
}) => {
  return (
    <div 
      className={cn('grid gap-1', className)}
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Game board"
    >
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onCellClick(rowIndex, colIndex)}
            disabled={disabled || cell !== null}
            className={cn(
              'aspect-square border rounded hover:bg-gray-100',
              cell === 'X' && 'bg-blue-500',
              cell === 'O' && 'bg-red-500'
            )}
            aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}`}
          >
            {cell}
          </button>
        ))
      ))}
    </div>
  );
});

GameBoard.displayName = 'GameBoard';
```

### Component Guidelines
- **Use Functional Components**: Always use functional components with hooks
- **Memo Wisely**: Use `memo` for components that receive stable props
- **Props Interface**: Always define props interface above component
- **Default Props**: Use default parameters instead of defaultProps
- **Display Name**: Set displayName for memoized components
- **Accessibility**: Include ARIA labels and semantic HTML
- **Client Components**: Mark with 'use client' only when necessary
- **Server Components**: Prefer server components by default (App Router)

### Hooks Rules
```typescript
// hooks/use-game.ts
import { useContext, useCallback } from 'react';
import { GameContext } from '@/contexts/game-context';
import type { Position } from '@/types/game';

export const useGame = () => {
  const context = useContext(GameContext);
  
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  
  const makeMove = useCallback((position: Position) => {
    // Validate move client-side (server validates too)
    if (!context.isValidMove(position)) {
      return false;
    }
    
    context.dispatch({ type: 'MAKE_MOVE', payload: position });
    return true;
  }, [context]);
  
  return {
    ...context,
    makeMove,
  };
};
```

### Custom Hooks Guidelines
- **Naming**: Always prefix with 'use'
- **Single Responsibility**: Each hook should have one clear purpose
- **Error Handling**: Throw errors for invalid usage
- **Memoization**: Use useCallback and useMemo appropriately
- **Dependencies**: Always specify correct dependency arrays
- **Return Object**: Return object for multiple values, direct value for single value

## State Management

### Context Pattern
```typescript
// contexts/game-context.tsx
'use client';

import { createContext, useReducer, ReactNode, FC } from 'react';
import type { GameState, GameAction } from '@/types/game';

const initialState: GameState = {
  board: Array(16).fill(null).map(() => Array(16).fill(null)),
  currentPlayer: 'X',
  gameStatus: 'waiting',
  timer: 30,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MAKE_MOVE':
      // Immutable state update
      return {
        ...state,
        board: state.board.map((row, i) =>
          i === action.payload.row
            ? row.map((cell, j) => j === action.payload.col ? state.currentPlayer : cell)
            : row
        ),
        currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
      };
    default:
      return state;
  }
};

export const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
```

## Next.js Specific Rules

### App Router (Next.js 14+)
- **Server Components by Default**: Use server components unless client interactivity needed
- **Metadata API**: Use generateMetadata for dynamic SEO
- **Loading States**: Create loading.tsx for route segments
- **Error Handling**: Create error.tsx for error boundaries
- **Route Groups**: Use (group) for organization without affecting URL

### SEO Optimization
```typescript
// app/game/[id]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await fetchGame(params.id);
  
  return {
    title: `Game ${params.id} | Caro Online`,
    description: `Watch or join game ${params.id}`,
    openGraph: {
      title: `Game ${params.id}`,
      description: `Caro game in progress`,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Game ${params.id}`,
      description: `Caro game in progress`,
    },
  };
}
```

### Image Optimization
```typescript
import Image from 'next/image';

// Always use Next.js Image component
<Image
  src="/avatar.png"
  alt="Player avatar"
  width={64}
  height={64}
  priority={false} // true for above-fold images
  placeholder="blur" // Use blur placeholder
  blurDataURL="data:image/..." // Or import image for automatic blur
/>
```

### Performance Optimization
- **Code Splitting**: Use dynamic imports for heavy components
```typescript
import dynamic from 'next/dynamic';

const GameBoard = dynamic(() => import('@/components/game/game-board'), {
  loading: () => <GameBoardSkeleton />,
  ssr: false, // Disable SSR if needed
});
```

- **Font Optimization**: Use next/font
```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

## Styling Rules

### Tailwind CSS
- **Use Tailwind Utilities**: Prefer Tailwind classes over custom CSS
- **Component Variants**: Use cva (class-variance-authority) for variants
- **Responsive Design**: Mobile-first approach (sm:, md:, lg:, xl:)
- **Dark Mode**: Support dark mode with dark: prefix
- **Custom Colors**: Define in tailwind.config.ts

### shadcn/ui Integration
- **Install Components**: Use `bunx shadcn-ui@latest add <component>`
- **Customize**: Modify components in components/ui as needed
- **Consistent Design**: Use shadcn components for consistency

## API Integration

### API Client
```typescript
// lib/api.ts
import { z } from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }
  
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
```

### React Query Integration
```typescript
// hooks/use-players.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const usePlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: () => api.get('/players'),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};
```

## WebSocket Integration

### Socket.io Setup
```typescript
// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// Typed event emitters
export const socketEmit = {
  joinRoom: (roomId: string) => socket.emit('join-room', { roomId }),
  makeMove: (move: Move) => socket.emit('make-move', move),
  challenge: () => socket.emit('challenge'),
};
```

### Socket Hook
```typescript
// hooks/use-socket.ts
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  
  useEffect(() => {
    socket.connect();
    
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);
  
  return { socket, isConnected };
};
```

## Form Handling

### React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginForm) => {
    // Handle login
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      {errors.username && <span>{errors.username.message}</span>}
    </form>
  );
};
```

## Testing

### Unit Tests (Jest + RTL)
```typescript
// components/game/game-board.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from './game-board';

describe('GameBoard', () => {
  it('renders board with correct size', () => {
    const mockBoard = Array(16).fill(null).map(() => Array(16).fill(null));
    render(<GameBoard size={16} board={mockBoard} onCellClick={jest.fn()} />);
    
    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(256); // 16x16
  });
  
  it('calls onCellClick when cell is clicked', () => {
    const mockOnClick = jest.fn();
    const mockBoard = Array(16).fill(null).map(() => Array(16).fill(null));
    
    render(<GameBoard size={16} board={mockBoard} onCellClick={mockOnClick} />);
    
    const firstCell = screen.getAllByRole('button')[0];
    fireEvent.click(firstCell);
    
    expect(mockOnClick).toHaveBeenCalledWith(0, 0);
  });
});
```

## Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Build and Deploy
- **Build Command**: `bun run build`
- **Dev Command**: `bun run dev`
- **Test Command**: `bun run test`
- **Lint Command**: `bun run lint`
- **Type Check**: `bun run type-check`

