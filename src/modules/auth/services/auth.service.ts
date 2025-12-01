import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserRepository } from '../repositories/user.repository';
import { ApiKeyRepository } from '../repositories/api-key.repository';
import { SocialAccountRepository } from '../repositories/social-account.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly apiKeyRepo: ApiKeyRepository,
    private readonly socialAccountRepo: SocialAccountRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hash(password, 10);
    const user = await this.userRepo.create({
      email,
      password: hashedPassword,
      name,
    });

    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    return { user: this.sanitizeUser(user), accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    return { user: this.sanitizeUser(user), accessToken, refreshToken };
  }

  async socialLogin(
    provider: string,
    providerId: string,
    email: string,
    name?: string,
    avatar?: string,
  ) {
    let socialAccount = await this.socialAccountRepo.findByProvider(
      provider,
      providerId,
    );

    let user;
    if (socialAccount) {
      user = await this.userRepo.findById(socialAccount.userId);
    } else {
      user = await this.userRepo.findByEmail(email);
      if (!user) {
        user = await this.userRepo.create({
          email,
          name,
          avatar,
          emailVerified: true,
        });
      }

      socialAccount = await this.socialAccountRepo.create({
        userId: user.id,
        provider,
        providerId,
      });
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    return { user: this.sanitizeUser(user), accessToken, refreshToken };
  }

  async generateApiKey(userId: string, name: string) {
    const key = `sk_${randomBytes(32).toString('hex')}`;
    const apiKey = await this.apiKeyRepo.create({
      userId,
      key,
      name,
    });
    return apiKey;
  }

  async validateApiKey(key: string) {
    const apiKey = await this.apiKeyRepo.findByKey(key);
    if (!apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      throw new UnauthorizedException('API key expired');
    }

    await this.apiKeyRepo.updateLastUsed(apiKey.id);
    const user = await this.userRepo.findById(apiKey.userId);
    return user;
  }

  async validateUser(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }

  private async generateTokens(userId: string) {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
