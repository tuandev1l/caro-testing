import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async updateElo(userId: string, eloChange: number): Promise<User> {
    const user = await this.findById(userId);
    user.elo += eloChange;
    return this.userRepository.save(user);
  }

  async updateStats(
    userId: string,
    result: 'win' | 'loss' | 'draw',
  ): Promise<User> {
    const user = await this.findById(userId);

    switch (result) {
      case 'win':
        user.wins += 1;
        user.elo += 3;
        break;
      case 'loss':
        user.losses += 1;
        break;
      case 'draw':
        user.draws += 1;
        user.elo += 1;
        break;
    }

    return this.userRepository.save(user);
  }

  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.findById(userId);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      elo: user.elo,
      wins: user.wins,
      losses: user.losses,
      draws: user.draws,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getLeaderboard(limit: number = 10): Promise<Partial<User>[]> {
    const users = await this.userRepository.find({
      order: { elo: 'DESC' },
      take: limit,
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      elo: user.elo,
      wins: user.wins,
      losses: user.losses,
      draws: user.draws,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}
