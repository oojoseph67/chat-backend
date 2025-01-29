import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserTokenPayload } from 'src/global/providers/generate-token.provider';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message) // return type
  // @UseGuards(GQLAuthGuard)
  async createMessage(
    @Args('createMessage') createMessageDto: CreateMessageDto,
    // @CurrentUser() user: UserTokenPayload,
  ) {
    return this.messagesService.createMessage({
      createMessageDto,
      // user,
    });
  }
}
