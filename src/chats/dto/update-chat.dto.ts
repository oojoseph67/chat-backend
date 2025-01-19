import { CreateChatDto } from './create-chat.dto';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateChatDto extends PartialType(CreateChatDto) {
  @Field(() => Int)
  id: number;
}
