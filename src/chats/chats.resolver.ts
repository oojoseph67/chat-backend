import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserTokenPayload } from 'src/global/providers/generate-token.provider';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(GQLAuthGuard)
  @Mutation(() => Chat)
  createChat(
    @Args('chat') createChatDto: CreateChatDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    console.log({ user });
    return this.chatsService.create({ chat: createChatDto, userId: user._id });
  }

  @Query(() => [Chat], { name: 'getAllChats' })
  findAll() {
    return this.chatsService.findAll();
  }

  @Query(() => Chat, { name: 'getChatById' })
  findOne(@Args('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @Mutation(() => Chat)
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatDto) {
    return this.chatsService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id', { type: () => Int }) id: number) {
    return this.chatsService.remove(id);
  }
}
