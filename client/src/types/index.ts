/**
 * Client-side type definitions
 * Re-exports shared types and adds client-specific types
 */

// Re-export shared types from the shared package
// These will be imported once the shared types are properly set up
export type CellValue = 'X' | 'O' | null;
export type GameStatus = 'waiting' | 'playing' | 'finished' | 'draw';
export type GameResult = 'win' | 'lose' | 'draw';
export type PlayerSymbol = 'X' | 'O';

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  position: Position;
  player: PlayerSymbol;
  timestamp: number;
}

export interface GameState {
  id: string;
  board: CellValue[][];
  currentPlayer: PlayerSymbol;
  status: GameStatus;
  winner: PlayerSymbol | null;
  moves: Move[];
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  username: string;
  email: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  createdAt: string;
}

export interface GamePlayer {
  player: Player;
  symbol: PlayerSymbol;
  isReady: boolean;
}

export interface Room {
  id: string;
  name: string;
  players: GamePlayer[];
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  gameId: string | null;
  createdAt: string;
}

// Client-specific types
export interface AuthState {
  user: Player | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

