import {
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Response } from 'express';
import { GenerateTokenProvider } from 'src/global/providers/generate-token.provider';
import { HashingProvider } from 'src/global/providers/hashing.provider';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

export const CookieKey = 'Authentication';

@Injectable()
export class AuthService {
  constructor(
    // injecting userService and accessTokenProvider

    private userService: UsersService,
    private generateTokenProvider: GenerateTokenProvider,
    private hashingProvider: HashingProvider,
  ) {}

  async login({ response, user }: { user: User; response: Response }) {
    const { accessToken, refreshToken } =
      await this.generateTokenProvider.generateTokens({
        user,
      });

    response.cookie(CookieKey, accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000), // 1 hour
      secure: true,
    });
  }
}
