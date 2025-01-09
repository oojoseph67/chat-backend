import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('user') user: CreateUserDto) {
    return this.usersService.create({ user });
  }

  @Query(() => [User], { name: 'getAllUsers' }) // whats its returning([User]) and the name of the query
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne({ id: id.toString() });
  }

  @Mutation(() => User)
  updateUser(@Args('user') user: UpdateUserDto) {
    return this.usersService.update({
      id: user.id.toString(),
      user,
    });
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.removeUser({ id: id.toString() });
  }
}
