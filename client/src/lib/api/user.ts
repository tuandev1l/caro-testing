/**
 * User API Service
 * Handles all user-related API calls
 */

import { apiClient } from './client';
import type { Player } from '@/types';

class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<Player> {
    return await apiClient.get<Player>('/api/users/me');
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<Player> {
    return await apiClient.get<Player>(`/api/users/${id}`);
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 10): Promise<Player[]> {
    return await apiClient.get<Player[]>(
      `/api/users/leaderboard?limit=${limit}`
    );
  }
}

export const userService = new UserService();
