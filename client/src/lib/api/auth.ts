/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { apiClient } from './client';
import { STORAGE_KEYS } from '../constants';
import type { Player } from '@/types';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    elo: number;
    wins: number;
    losses: number;
    draws: number;
  };
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/api/auth/register',
      data
    );
    this.saveAuthData(response);
    return response;
  }

  /**
   * Login user
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/api/auth/login',
      data
    );
    this.saveAuthData(response);
    return response;
  }

  /**
   * Logout user
   */
  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    // Remove cookie
    document.cookie =
      'caro_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): Player | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userData) return null;
    try {
      return JSON.parse(userData) as Player;
    } catch {
      return null;
    }
  }

  /**
   * Get auth token from localStorage
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Save authentication data to localStorage and cookies
   */
  private saveAuthData(data: AuthResponse): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.accessToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));

    // Save token in cookie for middleware (7 days expiry)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    document.cookie = `caro_auth_token=${
      data.accessToken
    }; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
  }
}

export const authService = new AuthService();
