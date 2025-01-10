import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/global/config/jwt.config';
import { GenerateTokenProvider } from './generate-token.provider';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    // injecting jwt service dependency
    private jwtService: JwtService,

    // injecting jwtConfig (environment values)
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,

    private generateTokenProvider: GenerateTokenProvider,

    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  public async getRefreshToken({ token }: { token: RefreshTokenDto }) {
    try {
      // verify the refresh token sent
      const { _id } = await this.jwtService.verifyAsync<Pick<User, '_id'>>(
        token.refreshToken,
        {
          secret: this.jwtConfiguration.jwtSecret,
          audience: this.jwtConfiguration.jwtTokenAudience,
          issuer: this.jwtConfiguration.jwtTokenIssuer,
        },
      );
      // fetch the user
      const user = await this.userService.findOne({
        id: _id as unknown as string,
      });

      // generate new access and refresh tokens
      const { accessToken, refreshToken } =
        await this.generateTokenProvider.generateTokens({
          user,
        });

      return { accessToken, refreshToken };
    } catch (error: any) {
      throw new HttpException(
        `Invalid refresh token ${error.message}`,
        HttpStatus.UNAUTHORIZED,
        {
          cause: error.message,
          description: error,
        },
      );
    }
  }
}

import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
