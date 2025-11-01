import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT Auth Guard
 * Allows requests to proceed even if authentication fails
 * Useful for routes that can work with or without authentication
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(err: Error | null, user: TUser): TUser | null {
    // If there's an error or no user, return null instead of throwing
    // This allows the request to proceed without authentication
    if (err || !user) {
      return null;
    }
    return user;
  }

  canActivate(context: ExecutionContext) {
    // Always return true to allow the request to proceed
    // The actual authentication check happens in handleRequest
    return super.canActivate(context);
  }
}
