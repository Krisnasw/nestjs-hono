import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TransformResponseInterceptor } from '@/interceptors/response.interceptor';
import { ApiCustomHeader } from '@/shared/swagger/decorator';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  RegisterDto,
  LoginDto,
  SocialLoginDto,
  CreateApiKeyDto,
} from '../dto/auth.dto';

@ApiTags('Auth')
@ApiCustomHeader()
@UseInterceptors(TransformResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('social-login')
  async socialLogin(@Body() dto: SocialLoginDto) {
    return this.authService.socialLogin(
      dto.provider,
      dto.providerId,
      dto.email,
      dto.name,
      dto.avatar,
    );
  }

  @Post('api-key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createApiKey(@Request() req, @Body() dto: CreateApiKeyDto) {
    return this.authService.generateApiKey(req.user.id, dto.name);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    return req.user;
  }
}
