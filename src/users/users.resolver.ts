import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserTokenPayload } from 'src/global/providers/generate-token.provider';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('user') user: CreateUserDto) {
    return this.usersService.create({ user });
  }

  @Query(() => [User], { name: 'getAllUsers' }) // whats its returning([User]) and the name of the query
  @UseGuards(GQLAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'getSingleUser' })
  // @UseGuards(GQLAuthGuard)
  findOne(@Args('id') id: string) {
    return this.usersService.findOne({ id });
  }

  @Mutation(() => User)
  @UseGuards(GQLAuthGuard)
  updateUser(
    @Args('user') user: UpdateUserDto,
    @CurrentUser() currentUser: UserTokenPayload,
  ) {
    return this.usersService.update({
      id: currentUser._id,
      user,
    });
  }

  @Mutation(() => User)
  @UseGuards(GQLAuthGuard)
  removeUser(@CurrentUser() currentUser: UserTokenPayload) {
    return this.usersService.removeUser({ id: currentUser._id });
  }

  @Query(() => User, {
    name: 'authenticatedUser',
    description: 'Gets the authenticated user',
  })
  @UseGuards(GQLAuthGuard) // only authenticated users
  getMe(@CurrentUser() user: UserTokenPayload) {
    console.log('authenticatedUser', { user });
    return user;
  }
}
