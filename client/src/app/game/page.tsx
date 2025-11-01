'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameBoard } from '@/components/game/GameBoard';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/lib/api/auth';
import { ROUTES } from '@/lib/constants';

/**
 * Game Page Content Component
 * Separated to use the GameContext
 */
function GamePageContent() {
  const { state, makeMove, resetGame, setStatus } = useGame();
  const router = useRouter();

  // Start game when component mounts
  useEffect(() => {
    if (state.status === 'waiting') {
      setStatus('playing');
    }
  }, [state.status, setStatus]);

  const handleCellClick = (position: { row: number; col: number }) => {
    makeMove(position);
  };

  const handleNewGame = () => {
    resetGame();
    setStatus('playing');
  };

  const handleBackToLobby = () => {
    router.push(ROUTES.LOBBY);
  };

  const isGameOver = state.status === 'finished' || state.status === 'draw';
  const currentPlayerName = state.currentPlayer === 'X' ? 'Player 1 (X)' : 'Player 2 (O)';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Caro Game</h1>
            <p className="text-muted-foreground">
              Connect 5 pieces in a row to win!
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToLobby}>
            Back to Lobby
          </Button>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Game Board */}
          <div className="flex flex-col items-center">
            <GameBoard
              board={state.board}
              onCellClick={handleCellClick}
              disabled={isGameOver}
              winningLine={state.winningLine}
              lastMove={state.lastMove}
              className="mb-4"
            />

            {/* Mobile Game Info */}
            <div className="lg:hidden w-full max-w-md mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Game Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isGameOver && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Current Turn
                      </p>
                      <Badge
                        variant={
                          state.currentPlayer === 'X' ? 'default' : 'destructive'
                        }
                        className="text-lg px-4 py-2"
                      >
                        {currentPlayerName}
                      </Badge>
                    </div>
                  )}

                  {isGameOver && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Game Over
                      </p>
                      {state.winner ? (
                        <Badge variant="default" className="text-lg px-4 py-2">
                          {state.winner === 'X' ? 'Player 1 (X)' : 'Player 2 (O)'}{' '}
                          Wins! 🎉
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          Draw! 🤝
                        </Badge>
                      )}
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Moves</p>
                    <p className="text-2xl font-bold">{state.moveCount}</p>
                  </div>

                  <Button onClick={handleNewGame} className="w-full" size="lg">
                    New Game
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Game Info</CardTitle>
                <CardDescription>
                  {isGameOver ? 'Game finished' : 'Game in progress'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Turn */}
                {!isGameOver && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Current Turn
                    </p>
                    <Badge
                      variant={
                        state.currentPlayer === 'X' ? 'default' : 'destructive'
                      }
                      className="text-lg px-4 py-2"
                    >
                      {currentPlayerName}
                    </Badge>
                  </div>
                )}

                {/* Game Over */}
                {isGameOver && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Result
                    </p>
                    {state.winner ? (
                      <div className="space-y-2">
                        <Badge variant="default" className="text-lg px-4 py-2">
                          {state.winner === 'X' ? 'Player 1 (X)' : 'Player 2 (O)'}{' '}
                          Wins! 🎉
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {state.winningLine?.direction === 'horizontal' &&
                            'Horizontal win'}
                          {state.winningLine?.direction === 'vertical' &&
                            'Vertical win'}
                          {state.winningLine?.direction === 'diagonal-down' &&
                            'Diagonal win (↘)'}
                          {state.winningLine?.direction === 'diagonal-up' &&
                            'Diagonal win (↗)'}
                        </p>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        Draw! 🤝
                      </Badge>
                    )}
                  </div>
                )}

                {/* Move Count */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Total Moves
                  </p>
                  <p className="text-3xl font-bold">{state.moveCount}</p>
                </div>

                {/* Players */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">Players</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Player 1 (X)</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Player 2 (O)</Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <Button onClick={handleNewGame} className="w-full" size="lg">
                    New Game
                  </Button>
                  <Button
                    onClick={handleBackToLobby}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Lobby
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Game Instructions */}
        <Card className="mt-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Players take turns placing their pieces (X or O) on the board</li>
              <li>The first player to get 5 pieces in a row wins</li>
              <li>Rows can be horizontal, vertical, or diagonal</li>
              <li>If the board fills up with no winner, the game is a draw</li>
              <li>Click on any empty cell to place your piece</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Game Page
 * Provides game context and renders the game board
 */
export default function GamePage() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      router.push(`${ROUTES.LOGIN}?redirect=${ROUTES.GAME}`);
    }
  }, [router]);

  return (
    <GameProvider>
      <GamePageContent />
    </GameProvider>
  );
}

