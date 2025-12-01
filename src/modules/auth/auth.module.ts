import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';
import { ApiKeyRepository } from './repositories/api-key.repository';
import { SocialAccountRepository } from './repositories/social-account.repository';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    ApiKeyRepository,
    SocialAccountRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
