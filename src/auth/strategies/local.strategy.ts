import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    // injecting user service

    private readonly usersService: UsersService,
  ) {
    super({ usernameField: 'email' }); // because we use email in our application
  }

  async validate(email: string, password: string) { // expects this to be passed to the body
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    return await this.usersService.verifyUser({ email, password });
  }
}
