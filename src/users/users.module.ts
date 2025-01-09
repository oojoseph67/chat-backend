import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { HashingProvider } from 'src/global/providers/hashing.provider';
import { BcryptProvider } from 'src/global/providers/bcrypt.provider';
import { User, UserSchema } from './entities/user.entity';

@Module({
  providers: [
    UsersResolver,
    UsersService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]), // for repository (entity) injection
  ],
  exports: [HashingProvider],
})
export class UsersModule {}
