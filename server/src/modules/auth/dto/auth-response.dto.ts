export class AuthResponseDto {
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
