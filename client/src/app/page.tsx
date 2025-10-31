import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* Header */}
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Caro Game</h1>
          <nav className='flex gap-4'>
            <Link href='/auth/login'>
              <Button variant='ghost'>Login</Button>
            </Link>
            <Link href='/auth/register'>
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className='flex-1'>
        <section className='container mx-auto px-4 py-20 text-center'>
          <Badge className='mb-4' variant='secondary'>
            🎮 Online Multiplayer
          </Badge>
          <h2 className='text-5xl font-bold mb-6'>Play Caro (Gomoku) Online</h2>
          <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            Challenge players worldwide in real-time Caro matches. Climb the
            rankings, improve your Elo rating, and become a Caro master!
          </p>
          <div className='flex gap-4 justify-center'>
            <Link href='/auth/register'>
              <Button size='lg'>Start Playing</Button>
            </Link>
            <Link href='/rankings'>
              <Button size='lg' variant='outline'>
                View Rankings
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className='container mx-auto px-4 py-16'>
          <h3 className='text-3xl font-bold text-center mb-12'>Features</h3>
          <div className='grid md:grid-cols-3 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>⚡ Real-time Multiplayer</CardTitle>
                <CardDescription>
                  Play against opponents in real-time with WebSocket technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='list-disc list-inside space-y-2 text-sm text-muted-foreground'>
                  <li>Instant move updates</li>
                  <li>30-second turn timer</li>
                  <li>Challenge system</li>
                  <li>Room-based gameplay</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🏆 Elo Rating System</CardTitle>
                <CardDescription>
                  Competitive ranking system to track your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='list-disc list-inside space-y-2 text-sm text-muted-foreground'>
                  <li>Start at 1000 Elo</li>
                  <li>+3 points for wins</li>
                  <li>+1 point for draws</li>
                  <li>Global leaderboard</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔄 Reconnection Support</CardTitle>
                <CardDescription>
                  Never lose progress due to network issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='list-disc list-inside space-y-2 text-sm text-muted-foreground'>
                  <li>Auto-reconnect on disconnect</li>
                  <li>Game state persistence</li>
                  <li>Resume from last move</li>
                  <li>Move queuing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Game Rules Section */}
        <section className='container mx-auto px-4 py-16 bg-muted/50'>
          <h3 className='text-3xl font-bold text-center mb-8'>How to Play</h3>
          <div className='max-w-3xl mx-auto'>
            <Card>
              <CardHeader>
                <CardTitle>Game Rules</CardTitle>
                <CardDescription>
                  Simple rules, strategic gameplay
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h4 className='font-semibold mb-2'>Objective</h4>
                  <p className='text-sm text-muted-foreground'>
                    Be the first player to get 5 of your pieces in a row
                    (horizontally, vertically, or diagonally) on a 16x16 board.
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold mb-2'>Gameplay</h4>
                  <p className='text-sm text-muted-foreground'>
                    Players take turns placing their pieces (X or O) on empty
                    cells. You have 30 seconds per turn. If time runs out, you
                    automatically lose.
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold mb-2'>Winning</h4>
                  <p className='text-sm text-muted-foreground'>
                    Create an unbroken line of 5 pieces. The game also features
                    two-end block detection for advanced strategy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t py-8'>
        <div className='container mx-auto px-4 text-center text-sm text-muted-foreground'>
          <p>© 2025 Caro Game. Built with Next.js and NestJS.</p>
        </div>
      </footer>
    </div>
  );
}

