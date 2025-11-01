'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { CellValue, Position, PlayerSymbol, GameStatus } from '@/types';
import { GAME_CONFIG } from '@/lib/constants';

// ============================================================================
// Types
// ============================================================================

export interface GameState {
  board: CellValue[][];
  currentPlayer: PlayerSymbol;
  status: GameStatus;
  winner: PlayerSymbol | null;
  winningLine: {
    start: Position;
    end: Position;
    direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
  } | null;
  lastMove: Position | null;
  moveCount: number;
}

type GameAction =
  | { type: 'MAKE_MOVE'; payload: Position }
  | { type: 'SET_WINNER'; payload: { winner: PlayerSymbol; winningLine: GameState['winningLine'] } }
  | { type: 'RESET_GAME' }
  | { type: 'SET_STATUS'; payload: GameStatus }
  | { type: 'SET_BOARD'; payload: CellValue[][] };

interface GameContextValue {
  state: GameState;
  makeMove: (position: Position) => boolean;
  resetGame: () => void;
  setStatus: (status: GameStatus) => void;
  setBoard: (board: CellValue[][]) => void;
}

// ============================================================================
// Initial State
// ============================================================================

const createEmptyBoard = (): CellValue[][] => {
  return Array(GAME_CONFIG.BOARD_SIZE)
    .fill(null)
    .map(() => Array(GAME_CONFIG.BOARD_SIZE).fill(null));
};

const initialState: GameState = {
  board: createEmptyBoard(),
  currentPlayer: 'X',
  status: 'waiting',
  winner: null,
  winningLine: null,
  lastMove: null,
  moveCount: 0,
};

// ============================================================================
// Win Detection Logic
// ============================================================================

function checkWin(
  board: CellValue[][],
  position: Position,
  player: PlayerSymbol
): GameState['winningLine'] {
  const { row, col } = position;
  const directions = [
    { dx: 0, dy: 1, name: 'horizontal' as const },
    { dx: 1, dy: 0, name: 'vertical' as const },
    { dx: 1, dy: 1, name: 'diagonal-down' as const },
    { dx: 1, dy: -1, name: 'diagonal-up' as const },
  ];

  for (const { dx, dy, name } of directions) {
    let count = 1;
    let startRow = row;
    let startCol = col;
    let endRow = row;
    let endCol = col;

    // Check forward direction
    let r = row + dx;
    let c = col + dy;
    while (
      r >= 0 &&
      r < GAME_CONFIG.BOARD_SIZE &&
      c >= 0 &&
      c < GAME_CONFIG.BOARD_SIZE &&
      board[r][c] === player
    ) {
      count++;
      endRow = r;
      endCol = c;
      r += dx;
      c += dy;
    }

    // Check backward direction
    r = row - dx;
    c = col - dy;
    while (
      r >= 0 &&
      r < GAME_CONFIG.BOARD_SIZE &&
      c >= 0 &&
      c < GAME_CONFIG.BOARD_SIZE &&
      board[r][c] === player
    ) {
      count++;
      startRow = r;
      startCol = c;
      r -= dx;
      c -= dy;
    }

    if (count >= GAME_CONFIG.WIN_CONDITION) {
      return {
        start: { row: startRow, col: startCol },
        end: { row: endRow, col: endCol },
        direction: name,
      };
    }
  }

  return null;
}

// ============================================================================
// Reducer
// ============================================================================

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const { row, col } = action.payload;

      // Validate move
      if (
        state.status !== 'playing' ||
        state.board[row][col] !== null ||
        state.winner !== null
      ) {
        return state;
      }

      // Create new board with the move
      const newBoard = state.board.map((r, i) =>
        i === row
          ? r.map((cell, j) => (j === col ? state.currentPlayer : cell))
          : [...r]
      );

      // Check for win
      const winningLine = checkWin(newBoard, action.payload, state.currentPlayer);
      const winner = winningLine ? state.currentPlayer : null;
      const newMoveCount = state.moveCount + 1;

      // Check for draw (board full)
      const isBoardFull = newMoveCount === GAME_CONFIG.BOARD_SIZE * GAME_CONFIG.BOARD_SIZE;
      const newStatus: GameStatus = winner
        ? 'finished'
        : isBoardFull
        ? 'draw'
        : 'playing';

      return {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
        lastMove: action.payload,
        moveCount: newMoveCount,
        winner,
        winningLine,
        status: newStatus,
      };
    }

    case 'SET_WINNER': {
      return {
        ...state,
        winner: action.payload.winner,
        winningLine: action.payload.winningLine,
        status: 'finished',
      };
    }

    case 'RESET_GAME': {
      return {
        ...initialState,
        board: createEmptyBoard(),
      };
    }

    case 'SET_STATUS': {
      return {
        ...state,
        status: action.payload,
      };
    }

    case 'SET_BOARD': {
      return {
        ...state,
        board: action.payload,
      };
    }

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const makeMove = useCallback((position: Position): boolean => {
    const { row, col } = position;
    
    // Validate position
    if (
      row < 0 ||
      row >= GAME_CONFIG.BOARD_SIZE ||
      col < 0 ||
      col >= GAME_CONFIG.BOARD_SIZE
    ) {
      return false;
    }

    // Check if cell is already occupied
    if (state.board[row][col] !== null) {
      return false;
    }

    dispatch({ type: 'MAKE_MOVE', payload: position });
    return true;
  }, [state.board]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const setStatus = useCallback((status: GameStatus) => {
    dispatch({ type: 'SET_STATUS', payload: status });
  }, []);

  const setBoard = useCallback((board: CellValue[][]) => {
    dispatch({ type: 'SET_BOARD', payload: board });
  }, []);

  const value: GameContextValue = {
    state,
    makeMove,
    resetGame,
    setStatus,
    setBoard,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

