# Augment Rules - Server (NestJS Backend)

## Overview
NestJS application with TypeScript, WebSocket support, Redis caching, and PostgreSQL database.

## Technology Stack
- **Framework**: NestJS 10+
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis (ioredis)
- **WebSocket**: Socket.io with @nestjs/platform-socket.io
- **Validation**: class-validator + class-transformer
- **Authentication**: JWT with @nestjs/jwt
- **Testing**: Jest + Supertest
- **Package Manager**: Bun

## Project Structure
```
server/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── modules/                # Feature modules
│   │   ├── auth/              # Authentication module
│   │   ├── game/              # Game logic module
│   │   ├── player/            # Player management
│   │   ├── room/              # Room management
│   │   └── ranking/           # Ranking and Elo
│   ├── common/                # Shared code
│   │   ├── decorators/        # Custom decorators
│   │   ├── filters/           # Exception filters
│   │   ├── guards/            # Auth guards
│   │   ├── interceptors/      # Interceptors
│   │   ├── pipes/             # Validation pipes
│   │   └── middleware/        # Middleware
│   ├── config/                # Configuration
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── jwt.config.ts
│   ├── entities/              # TypeORM entities
│   ├── dto/                   # Data Transfer Objects
│   ├── interfaces/            # TypeScript interfaces
│   ├── constants/             # Constants
│   └── utils/                 # Utility functions
├── test/                      # E2E tests
├── migrations/                # Database migrations
└── package.json
```

## Module Structure

### Feature Module Pattern
```typescript
// modules/game/game.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { Game } from '@/entities/game.entity';
import { RedisModule } from '@/modules/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    RedisModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameService],
})
export class GameModule {}
```

### Controller Pattern
```typescript
// modules/game/game.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';

@ApiTags('game')
@Controller('game')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ status: 201, description: 'Game created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createGame(
    @Body() createGameDto: CreateGameDto,
    @CurrentUser() user: User,
  ) {
    try {
      const game = await this.gameService.create(createGameDto, user);
      return {
        success: true,
        data: game,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create game',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get game by ID' })
  @ApiResponse({ status: 200, description: 'Game found' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async getGame(@Param('id') id: string) {
    const game = await this.gameService.findById(id);
    
    if (!game) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }
    
    return {
      success: true,
      data: game,
    };
  }
}
```

### Service Pattern
```typescript
// modules/game/game.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '@/entities/game.entity';
import { RedisService } from '@/modules/redis/redis.service';
import { CreateGameDto } from './dto/create-game.dto';
import { User } from '@/entities/user.entity';
import { GAME_CONFIG } from '@/constants/game.constants';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly redisService: RedisService,
  ) {}

  async create(createGameDto: CreateGameDto, user: User): Promise<Game> {
    try {
      const game = this.gameRepository.create({
        ...createGameDto,
        createdBy: user,
        board: this.initializeBoard(),
        status: 'waiting',
      });

      const savedGame = await this.gameRepository.save(game);
      
      // Cache game state in Redis
      await this.cacheGameState(savedGame);
      
      this.logger.log(`Game created: ${savedGame.id}`);
      return savedGame;
    } catch (error) {
      this.logger.error('Failed to create game', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Game | null> {
    // Try cache first
    const cached = await this.redisService.get(`game:${id}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fallback to database
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['players', 'winner'],
    });

    if (game) {
      await this.cacheGameState(game);
    }

    return game;
  }

  private initializeBoard(): (string | null)[][] {
    return Array(GAME_CONFIG.BOARD_SIZE)
      .fill(null)
      .map(() => Array(GAME_CONFIG.BOARD_SIZE).fill(null));
  }

  private async cacheGameState(game: Game): Promise<void> {
    await this.redisService.set(
      `game:${game.id}`,
      JSON.stringify(game),
      3600, // 1 hour TTL
    );
  }
}
```

### Gateway Pattern (WebSocket)
```typescript
// modules/game/game.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { WsJwtGuard } from '@/common/guards/ws-jwt.guard';
import { MakeMoveDto } from './dto/make-move.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GameGateway.name);

  constructor(private readonly gameService: GameService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Handle reconnection logic
    await this.handlePlayerDisconnect(client);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    try {
      await client.join(data.roomId);
      
      this.server.to(data.roomId).emit('player-joined', {
        playerId: client.data.userId,
        roomId: data.roomId,
      });
      
      this.logger.log(`Player ${client.data.userId} joined room ${data.roomId}`);
    } catch (error) {
      this.logger.error('Failed to join room', error);
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('make-move')
  async handleMakeMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() moveDto: MakeMoveDto,
  ) {
    try {
      // Validate and process move
      const result = await this.gameService.makeMove(
        moveDto.gameId,
        moveDto.position,
        client.data.userId,
      );

      // Broadcast move to room
      this.server.to(moveDto.gameId).emit('move-made', {
        position: moveDto.position,
        player: client.data.userId,
        board: result.board,
      });

      // Check win condition
      if (result.winner) {
        this.server.to(moveDto.gameId).emit('game-over', {
          winner: result.winner,
          winningLine: result.winningLine,
        });
      }
    } catch (error) {
      this.logger.error('Failed to make move', error);
      client.emit('error', { message: 'Invalid move' });
    }
  }

  private async handlePlayerDisconnect(client: Socket) {
    // Store disconnection in Redis for reconnection handling
    // Implementation for reconnection logic
  }
}
```

## Data Transfer Objects (DTOs)

### DTO Pattern with Validation
```typescript
// modules/game/dto/create-game.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum GameMode {
  CLASSIC = 'classic',
  RANKED = 'ranked',
}

export class CreateGameDto {
  @ApiProperty({ description: 'Game name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Game mode', enum: GameMode })
  @IsOptional()
  @IsEnum(GameMode)
  mode?: GameMode = GameMode.CLASSIC;
}
```

```typescript
// modules/game/dto/make-move.dto.ts
import { IsString, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GAME_CONFIG } from '@/constants/game.constants';

class PositionDto {
  @ApiProperty({ description: 'Row index', minimum: 0, maximum: 15 })
  @IsNumber()
  @Min(0)
  @Max(GAME_CONFIG.BOARD_SIZE - 1)
  row: number;

  @ApiProperty({ description: 'Column index', minimum: 0, maximum: 15 })
  @IsNumber()
  @Min(0)
  @Max(GAME_CONFIG.BOARD_SIZE - 1)
  col: number;
}

export class MakeMoveDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  gameId: string;

  @ApiProperty({ description: 'Move position', type: PositionDto })
  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;
}
```

## Database Entities

### Entity Pattern
```typescript
// entities/game.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export type GameStatus = 'waiting' | 'in_progress' | 'completed' | 'abandoned';
export type CellValue = 'X' | 'O' | null;

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'jsonb' })
  board: CellValue[][];

  @Column({ type: 'enum', enum: ['waiting', 'in_progress', 'completed', 'abandoned'] })
  status: GameStatus;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToMany(() => User)
  @JoinTable()
  players: User[];

  @ManyToOne(() => User, { nullable: true })
  winner: User | null;

  @Column({ type: 'varchar', length: 1, nullable: true })
  currentTurn: 'X' | 'O' | null;

  @Column({ type: 'int', default: 30 })
  turnTimeRemaining: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

```typescript
// entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index()
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'int', default: 1000 })
  elo: number;

  @Column({ type: 'int', default: 0 })
  wins: number;

  @Column({ type: 'int', default: 0 })
  losses: number;

  @Column({ type: 'int', default: 0 })
  draws: number;

  @Column({ type: 'boolean', default: true })
  isOnline: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Computed property
  get winRate(): number {
    const total = this.wins + this.losses + this.draws;
    return total > 0 ? (this.wins / total) * 100 : 0;
  }
}
```

## Guards and Decorators

### JWT Auth Guard
```typescript
// common/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
```

### WebSocket JWT Guard
```typescript
// common/guards/ws-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth.token;

    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.userId = payload.sub;
      client.data.username = payload.username;
      return true;
    } catch {
      return false;
    }
  }
}
```

### Custom Decorator
```typescript
// common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

## Redis Integration

### Redis Service
```typescript
// modules/redis/redis.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
```

## Game Logic

### Win Condition Check
```typescript
// modules/game/game-logic.service.ts
import { Injectable } from '@nestjs/common';
import { GAME_CONFIG } from '@/constants/game.constants';
import type { CellValue } from '@/entities/game.entity';

@Injectable()
export class GameLogicService {
  checkWin(board: CellValue[][], lastMove: { row: number; col: number }): {
    isWin: boolean;
    winningLine?: { start: [number, number]; end: [number, number] };
  } {
    const { row, col } = lastMove;
    const player = board[row][col];

    if (!player) return { isWin: false };

    // Check all four directions
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal \
      [1, -1],  // Diagonal /
    ];

    for (const [dx, dy] of directions) {
      const count = this.countConsecutive(board, row, col, dx, dy, player);
      
      if (count >= GAME_CONFIG.WIN_CONDITION) {
        return {
          isWin: true,
          winningLine: this.getWinningLine(board, row, col, dx, dy, player),
        };
      }
    }

    return { isWin: false };
  }

  private countConsecutive(
    board: CellValue[][],
    row: number,
    col: number,
    dx: number,
    dy: number,
    player: CellValue,
  ): number {
    let count = 1; // Count the current cell

    // Count in positive direction
    count += this.countDirection(board, row, col, dx, dy, player);
    
    // Count in negative direction
    count += this.countDirection(board, row, col, -dx, -dy, player);

    return count;
  }

  private countDirection(
    board: CellValue[][],
    row: number,
    col: number,
    dx: number,
    dy: number,
    player: CellValue,
  ): number {
    let count = 0;
    let r = row + dx;
    let c = col + dy;

    while (
      r >= 0 &&
      r < GAME_CONFIG.BOARD_SIZE &&
      c >= 0 &&
      c < GAME_CONFIG.BOARD_SIZE &&
      board[r][c] === player
    ) {
      count++;
      r += dx;
      c += dy;
    }

    return count;
  }
}
```

## Environment Variables
```bash
# .env
NODE_ENV=development
PORT=3001

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=caro_game

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# Client
CLIENT_URL=http://localhost:3000
```

## Testing
- **Unit Tests**: Test services and utilities in isolation
- **Integration Tests**: Test controllers with mocked services
- **E2E Tests**: Test complete flows with real database
- **Coverage**: Minimum 80% code coverage required

