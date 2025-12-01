import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ApiKeyGuard {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('No API key provided');
    }

    try {
      const user = await this.authService.validateApiKey(apiKey);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid API key');
    }
  }

  private extractApiKey(request: any): string | undefined {
    return (
      request.headers['x-api-key'] ||
      request.headers['authorization']?.replace('Bearer ', '')
    );
  }
}
