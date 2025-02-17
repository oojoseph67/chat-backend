import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetMessagesDto {
  @Field()
  @IsNotEmpty()
  chatId: string;
}
