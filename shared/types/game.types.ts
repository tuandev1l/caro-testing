/**
 * Shared TypeScript types for Caro Game
 * Used by both client and server
 */

// ============================================================================
// Game Constants
// ============================================================================

export const GAME_CONFIG = {
  BOARD_SIZE: 16,
  WIN_CONDITION: 5,
  TURN_TIMEOUT: 30000, // 30 seconds in milliseconds
  CHALLENGE_TIMEOUT: 10000, // 10 seconds in milliseconds
  STARTING_ELO: 1000,
  ELO_WIN_POINTS: 3,
  ELO_DRAW_POINTS: 1,
  ELO_LOSE_POINTS: 0,
} as const;

// ============================================================================
// Basic Types
// ============================================================================

export type CellValue = 'X' | 'O' | null;

export type GameStatus = 'waiting' | 'challenging' | 'in_progress' | 'completed' | 'abandoned';

export type GameResult = 'win' | 'loss' | 'draw';

export type PlayerSymbol = 'X' | 'O';

// ============================================================================
// Position and Move Types
// ============================================================================

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  position: Position;
  player: PlayerSymbol;
  timestamp: number;
}

export interface MoveValidation {
  isValid: boolean;
  reason?: string;
}

// ============================================================================
// Game State Types
// ============================================================================

export interface GameBoard {
  cells: CellValue[][];
  size: number;
}

export interface WinningLine {
  start: Position;
  end: Position;
  direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
}

export interface GameState {
  id: string;
  board: CellValue[][];
  status: GameStatus;
  currentTurn: PlayerSymbol | null;
  turnTimeRemaining: number;
  players: GamePlayer[];
  winner: GamePlayer | null;
  winningLine: WinningLine | null;
  moveHistory: Move[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Player Types
// ============================================================================

export interface Player {
  id: string;
  username: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  isOnline: boolean;
  createdAt: Date;
}

export interface GamePlayer {
  player: Player;
  symbol: PlayerSymbol;
  hasAcceptedChallenge: boolean;
  isConnected: boolean;
}

export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentElo: number;
  eloHistory: EloHistoryEntry[];
}

export interface EloHistoryEntry {
  gameId: string;
  previousElo: number;
  newElo: number;
  change: number;
  result: GameResult;
  timestamp: Date;
}

// ============================================================================
// Room Types
// ============================================================================

export interface Room {
  id: string;
  name: string;
  status: 'waiting' | 'full' | 'in_progress';
  players: Player[];
  maxPlayers: 2;
  createdBy: Player;
  gameId: string | null;
  createdAt: Date;
}

export interface RoomListItem {
  id: string;
  name: string;
  status: Room['status'];
  playerCount: number;
  maxPlayers: number;
  createdBy: string; // username
}

// ============================================================================
// WebSocket Event Types
// ============================================================================

export enum SocketEvent {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect',
  
  // Room events
  JOIN_ROOM = 'join-room',
  LEAVE_ROOM = 'leave-room',
  ROOM_JOINED = 'room-joined',
  ROOM_LEFT = 'room-left',
  PLAYER_JOINED = 'player-joined',
  PLAYER_LEFT = 'player-left',
  
  // Challenge events
  CHALLENGE = 'challenge',
  CHALLENGE_ACCEPTED = 'challenge-accepted',
  CHALLENGE_TIMEOUT = 'challenge-timeout',
  GAME_START = 'game-start',
  
  // Game events
  MAKE_MOVE = 'make-move',
  MOVE_MADE = 'move-made',
  INVALID_MOVE = 'invalid-move',
  TURN_TIMEOUT = 'turn-timeout',
  
  // Game end events
  GAME_OVER = 'game-over',
  PROPOSE_DRAW = 'propose-draw',
  DRAW_PROPOSED = 'draw-proposed',
  ACCEPT_DRAW = 'accept-draw',
  REJECT_DRAW = 'reject-draw',
  SURRENDER = 'surrender',
  
  // State sync events
  GAME_STATE_UPDATE = 'game-state-update',
  TIMER_UPDATE = 'timer-update',
  
  // Error events
  ERROR = 'error',
}

// ============================================================================
// WebSocket Payload Types
// ============================================================================

export interface JoinRoomPayload {
  roomId: string;
}

export interface LeaveRoomPayload {
  roomId: string;
}

export interface MakeMovePayload {
  gameId: string;
  position: Position;
}

export interface MoveMadePayload {
  gameId: string;
  move: Move;
  board: CellValue[][];
  nextTurn: PlayerSymbol;
}

export interface GameOverPayload {
  gameId: string;
  winner: GamePlayer | null;
  winningLine: WinningLine | null;
  result: GameResult;
  eloChanges: {
    [playerId: string]: {
      previous: number;
      new: number;
      change: number;
    };
  };
}

export interface ProposeDrawPayload {
  gameId: string;
  proposedBy: string; // player ID
}

export interface DrawProposedPayload {
  gameId: string;
  proposedBy: Player;
}

export interface TimerUpdatePayload {
  gameId: string;
  timeRemaining: number;
  currentTurn: PlayerSymbol;
}

export interface ErrorPayload {
  message: string;
  code?: string;
  details?: unknown;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateGameRequest {
  name: string;
  mode?: 'classic' | 'ranked';
}

export interface CreateGameResponse {
  success: boolean;
  data: GameState;
}

export interface GetGameResponse {
  success: boolean;
  data: GameState;
}

export interface GetRoomsResponse {
  success: boolean;
  data: RoomListItem[];
}

export interface GetRankingsRequest {
  page?: number;
  limit?: number;
  sortBy?: 'elo' | 'winRate' | 'totalGames';
  order?: 'asc' | 'desc';
}

export interface GetRankingsResponse {
  success: boolean;
  data: {
    rankings: Player[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface GetPlayerStatsResponse {
  success: boolean;
  data: PlayerStats;
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken?: string;
    user: Player;
  };
}

export interface JwtPayload {
  sub: string; // user ID
  username: string;
  iat: number;
  exp: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// Game Logic Types
// ============================================================================

export interface WinCheckResult {
  isWin: boolean;
  winningLine?: WinningLine;
  isTwoEndBlocked?: boolean;
}

export interface BlockedPattern {
  pattern: CellValue[];
  description: string;
}

// Common blocked patterns for two-end block detection
export const BLOCKED_PATTERNS: BlockedPattern[] = [
  {
    pattern: ['X', 'O', 'O', 'O', 'O', 'O', 'X'],
    description: 'Five Os blocked by Xs on both ends',
  },
  {
    pattern: ['O', 'X', 'X', 'X', 'X', 'X', 'O'],
    description: 'Five Xs blocked by Os on both ends',
  },
  {
    pattern: ['X', null, 'O', 'O', 'O', 'O', 'O', 'X'],
    description: 'Five Os with gap, blocked by Xs',
  },
  {
    pattern: ['O', null, 'X', 'X', 'X', 'X', 'X', 'O'],
    description: 'Five Xs with gap, blocked by Os',
  },
];

// ============================================================================
// Type Guards
// ============================================================================

export function isValidPosition(pos: Position): boolean {
  return (
    pos.row >= 0 &&
    pos.row < GAME_CONFIG.BOARD_SIZE &&
    pos.col >= 0 &&
    pos.col < GAME_CONFIG.BOARD_SIZE
  );
}

export function isPlayerSymbol(value: unknown): value is PlayerSymbol {
  return value === 'X' || value === 'O';
}

export function isCellValue(value: unknown): value is CellValue {
  return value === 'X' || value === 'O' || value === null;
}

export function isGameStatus(value: unknown): value is GameStatus {
  return (
    value === 'waiting' ||
    value === 'challenging' ||
    value === 'in_progress' ||
    value === 'completed' ||
    value === 'abandoned'
  );
}

