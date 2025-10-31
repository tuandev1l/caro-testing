/**
 * Game constants
 * Shared constants for the Caro game
 */

export const GAME_CONFIG = {
  BOARD_SIZE: 16,
  WIN_CONDITION: 5,
  TURN_TIMEOUT: 30000, // 30 seconds
  CHALLENGE_TIMEOUT: 10000, // 10 seconds
  STARTING_ELO: 1000,
  ELO_WIN_POINTS: 3,
  ELO_DRAW_POINTS: 1,
  ELO_LOSE_POINTS: 0,
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  GAME: '/game',
  LOBBY: '/lobby',
  PROFILE: '/profile',
  RANKINGS: '/rankings',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'caro_auth_token',
  USER_DATA: 'caro_user_data',
} as const;

