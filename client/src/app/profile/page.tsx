'use client';

/**
 * User Profile Page
 * Displays user statistics, Elo rating, and game history
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/lib/api/user';
import { authService } from '@/lib/api/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Player } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);

        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          toast.error('Please login to view your profile');
          router.push('/auth/login');
          return;
        }

        const profile = await userService.getProfile();
        setUser(profile);
      } catch (error) {
        const apiError = error as { message?: string; statusCode?: number };
        console.error('Failed to load profile:', error);
        toast.error(apiError.message || 'Failed to load profile');

        // If unauthorized, redirect to login
        if (apiError.statusCode === 401) {
          router.push('/auth/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const getWinRate = () => {
    if (!user) return 0;
    const totalGames = user.wins + user.losses + user.draws;
    if (totalGames === 0) return 0;
    return ((user.wins / totalGames) * 100).toFixed(1);
  };

  const getTotalGames = () => {
    if (!user) return 0;
    return user.wins + user.losses + user.draws;
  };

  const getEloRank = () => {
    if (!user) return 'Unranked';
    const elo = user.elo;
    if (elo >= 2000) return 'Grandmaster';
    if (elo >= 1800) return 'Master';
    if (elo >= 1600) return 'Expert';
    if (elo >= 1400) return 'Advanced';
    if (elo >= 1200) return 'Intermediate';
    return 'Beginner';
  };

  const getEloColor = () => {
    if (!user) return 'default';
    const elo = user.elo;
    if (elo >= 2000) return 'destructive';
    if (elo >= 1800) return 'default';
    if (elo >= 1600) return 'secondary';
    if (elo >= 1400) return 'outline';
    return 'default';
  };

  const getUserInitials = () => {
    if (!user) return '?';
    return user.username.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>Unable to load your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className='w-full'>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background p-4 md:p-8'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>Profile</h1>
          <Button variant='outline' onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-4'>
              <Avatar className='h-20 w-20'>
                <AvatarFallback className='text-2xl'>
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <CardTitle className='text-2xl'>{user.username}</CardTitle>
                <CardDescription className='text-base'>
                  {user.email}
                </CardDescription>
                <div className='flex gap-2 mt-2'>
                  <Badge
                    variant={
                      getEloColor() as
                        | 'default'
                        | 'destructive'
                        | 'secondary'
                        | 'outline'
                    }
                  >
                    {getEloRank()}
                  </Badge>
                  <Badge variant='outline'>Elo: {user.elo}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Total Games */}
          <Card>
            <CardHeader className='pb-3'>
              <CardDescription>Total Games</CardDescription>
              <CardTitle className='text-3xl'>{getTotalGames()}</CardTitle>
            </CardHeader>
          </Card>

          {/* Wins */}
          <Card>
            <CardHeader className='pb-3'>
              <CardDescription>Wins</CardDescription>
              <CardTitle className='text-3xl text-green-600'>
                {user.wins}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Losses */}
          <Card>
            <CardHeader className='pb-3'>
              <CardDescription>Losses</CardDescription>
              <CardTitle className='text-3xl text-red-600'>
                {user.losses}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Draws */}
          <Card>
            <CardHeader className='pb-3'>
              <CardDescription>Draws</CardDescription>
              <CardTitle className='text-3xl text-yellow-600'>
                {user.draws}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Win Rate Card */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <div className='flex justify-between mb-2'>
                  <span className='text-sm font-medium'>Win Rate</span>
                  <span className='text-sm font-medium'>{getWinRate()}%</span>
                </div>
                <div className='w-full bg-secondary rounded-full h-2.5'>
                  <div
                    className='bg-primary h-2.5 rounded-full transition-all'
                    style={{ width: `${getWinRate()}%` }}
                  ></div>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 pt-4 border-t'>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-green-600'>
                    {user.wins}
                  </p>
                  <p className='text-xs text-muted-foreground'>Wins</p>
                </div>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-yellow-600'>
                    {user.draws}
                  </p>
                  <p className='text-xs text-muted-foreground'>Draws</p>
                </div>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-red-600'>
                    {user.losses}
                  </p>
                  <p className='text-xs text-muted-foreground'>Losses</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex justify-between py-2 border-b'>
              <span className='text-muted-foreground'>Member Since</span>
              <span className='font-medium'>
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className='flex justify-between py-2 border-b'>
              <span className='text-muted-foreground'>User ID</span>
              <span className='font-mono text-sm'>
                {user.id.substring(0, 8)}...
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='flex gap-4'>
          <Button onClick={() => router.push('/lobby')} className='flex-1'>
            Find Game
          </Button>
          <Button
            onClick={() => router.push('/rankings')}
            variant='outline'
            className='flex-1'
          >
            View Rankings
          </Button>
        </div>
      </div>
    </div>
  );
}
