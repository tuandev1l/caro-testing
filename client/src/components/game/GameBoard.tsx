'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { CellValue, Position } from '@/types';
import { GAME_CONFIG } from '@/lib/constants';

export interface GameBoardProps {
  /**
   * The game board state (16x16 grid)
   */
  board: CellValue[][];
  
  /**
   * Callback when a cell is clicked
   */
  onCellClick?: (position: Position) => void;
  
  /**
   * Whether the board is disabled (e.g., not player's turn)
   */
  disabled?: boolean;
  
  /**
   * Winning line to highlight (if game is won)
   */
  winningLine?: {
    start: Position;
    end: Position;
    direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
  } | null;
  
  /**
   * Last move position to highlight
   */
  lastMove?: Position | null;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Check if a position is part of the winning line
 */
function isInWinningLine(
  position: Position,
  winningLine: NonNullable<GameBoardProps['winningLine']>
): boolean {
  const { start, end, direction } = winningLine;
  const { row, col } = position;

  if (direction === 'horizontal') {
    return row === start.row && col >= start.col && col <= end.col;
  }
  
  if (direction === 'vertical') {
    return col === start.col && row >= start.row && row <= end.row;
  }
  
  if (direction === 'diagonal-down') {
    const offset = row - start.row;
    return col === start.col + offset && row >= start.row && row <= end.row;
  }
  
  if (direction === 'diagonal-up') {
    const offset = row - start.row;
    return col === start.col - offset && row >= start.row && row <= end.row;
  }
  
  return false;
}

/**
 * Individual cell component
 */
interface CellProps {
  value: CellValue;
  position: Position;
  onClick?: () => void;
  disabled?: boolean;
  isWinning?: boolean;
  isLastMove?: boolean;
}

const Cell = memo<CellProps>(({ 
  value, 
  position, 
  onClick, 
  disabled, 
  isWinning,
  isLastMove 
}) => {
  const isEmpty = value === null;
  const isClickable = !disabled && isEmpty;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={cn(
        'aspect-square border border-gray-300 dark:border-gray-700',
        'flex items-center justify-center',
        'transition-all duration-200',
        'text-lg font-bold',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        // Hover effect for empty cells
        isClickable && 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
        // Disabled state
        !isClickable && 'cursor-not-allowed',
        // Piece colors
        value === 'X' && 'bg-blue-500 text-white',
        value === 'O' && 'bg-red-500 text-white',
        // Winning line highlight
        isWinning && 'ring-4 ring-yellow-400 ring-inset animate-pulse',
        // Last move highlight
        isLastMove && !isWinning && 'ring-2 ring-green-400 ring-inset'
      )}
      aria-label={`Cell row ${position.row + 1}, column ${position.col + 1}${
        value ? `, occupied by ${value}` : ', empty'
      }`}
      aria-disabled={!isClickable}
    >
      {value && (
        <span className="select-none" aria-hidden="true">
          {value}
        </span>
      )}
    </button>
  );
});

Cell.displayName = 'Cell';

/**
 * Game Board Component
 * 
 * Renders a 16x16 Caro game board with:
 * - Responsive grid layout
 * - Click handling for piece placement
 * - Winning line highlighting
 * - Last move highlighting
 * - Accessibility support
 */
export const GameBoard = memo<GameBoardProps>(({
  board,
  onCellClick,
  disabled = false,
  winningLine = null,
  lastMove = null,
  className,
}) => {
  const handleCellClick = (row: number, col: number) => {
    if (disabled || board[row][col] !== null) return;
    onCellClick?.({ row, col });
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      <div
        className={cn(
          'grid gap-0.5 bg-gray-400 dark:bg-gray-600 p-0.5 rounded-lg',
          'shadow-lg'
        )}
        style={{
          gridTemplateColumns: `repeat(${GAME_CONFIG.BOARD_SIZE}, minmax(0, 1fr))`,
        }}
        role="grid"
        aria-label="Caro game board"
        aria-readonly={disabled}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const position: Position = { row: rowIndex, col: colIndex };
            const isWinning = winningLine
              ? isInWinningLine(position, winningLine)
              : false;
            const isLastMoveCell =
              lastMove?.row === rowIndex && lastMove?.col === colIndex;

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                position={position}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={disabled}
                isWinning={isWinning}
                isLastMove={isLastMoveCell}
              />
            );
          })
        )}
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';

