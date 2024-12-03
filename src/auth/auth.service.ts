import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService {
  constructor(
    private useService: UserService,  
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private dataSource: DataSource,
  ) {}
  
  async register(createUserDto: CreateUserDto) {
    try {
      // Create the user first
      const user = await this.useService.create(createUserDto);

      return {
        user: {
          id: user.id,
          fullname: user.fullname,
          phone_number: user.phone_number,
        }
      };

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new BadRequestException(
        'Registration failed: ' + error
      );
    }
  }

  async login(phone_number: string, password: string) {
    try {
      const user = await this.useService.findByPhoneNumberWithPassword(phone_number);
      
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Invalidate all existing refresh tokens for the user
      await this.refreshTokenRepository.delete({ userId: user.id });

      const {access_token, refresh_token} = await this.generateTokens(user.id);
      return {
        user: {
          id: user.id,
          fullname: user.fullname,
          phone_number: user.phone_number,
          role: user.role,
        },
        access_token,
        refresh_token,
      }
    } catch (error) {
      if (error instanceof ConflictException || error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Authentication failed: ' + error);
    }
  }

  private async generateTokens(userId: number) {
    const [access_token, refresh_token] = await Promise.all([
      this.generateAccessToken(userId),
      this.generateRefreshToken(userId),
    ]);

    return { access_token, refresh_token };
  }

  private async generateAccessToken(userId: number): Promise<string> {
    const payload = { sub: userId };
    const token = await this.jwtService.signAsync(payload);
    
    const decodedToken = jwt.decode(token) as { exp: number };
    const expirationTime = new Date(decodedToken.exp * 1000);
    console.log(`Token of user ${userId} expires at: ${expirationTime}`); // xoá sau khi test xong

    // Schedule a log when the token expires
    setTimeout(() => {
      console.log(`Token for user ${userId} has expired at: ${new Date()}`);
    }, decodedToken.exp * 1000 - Date.now());

    return token;
  }

  private async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken = new RefreshToken();
    refreshToken.token = uuidv4();
    refreshToken.userId = userId;
    refreshToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.refreshTokenRepository.save(refreshToken);
    return refreshToken.token;
  }

  async refreshAccessToken(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { access_token, refresh_token } = await this.generateTokens(token.userId);
    await this.refreshTokenRepository.delete({ token: refreshToken });

    return { 
      access_token,
      refresh_token
    };
  }

  async logout(userId: number) {
    await this.refreshTokenRepository.delete({ userId });
    return { message: 'Logged out successfully' };
  }
}
