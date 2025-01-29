import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Message } from '../messages/entities/message.entity';

@Schema({ versionKey: false })
@ObjectType()
export class Chat {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, required: true })
  chatCreatorId: Types.ObjectId;

  @Field({})
  @Prop({
    type: Boolean,
  })
  isPrivate: boolean;

  @Field(() => [String])
  @Prop({
    type: [String],
  })
  userIds: string[];

  @Field({})
  @Prop({})
  name: string;

  @Field(() => [Message])
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Message[];
}

export type ChatHydratedDocument = HydratedDocument<Chat>;

export const ChatSchema = SchemaFactory.createForClass(Chat);
