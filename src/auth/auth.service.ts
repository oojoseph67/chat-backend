import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { GenerateTokenProvider } from 'src/global/providers/generate-token.provider';
import { User } from 'src/users/entities/user.entity';

export const CookieKey = 'Authentication';

@Injectable()
export class AuthService {
  constructor(
    // injecting userService and accessTokenProvider

    private generateTokenProvider: GenerateTokenProvider,
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
