import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@CurrentUser() user: User): Promise<Partial<User>> {
    return this.userService.getProfile(user.id);
  }

  @Get('leaderboard')
  async getLeaderboard(
    @Query('limit') limit?: number,
  ): Promise<Partial<User>[]> {
    return this.userService.getLeaderboard(limit || 10);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Partial<User>> {
    return this.userService.getProfile(id);
  }
}
