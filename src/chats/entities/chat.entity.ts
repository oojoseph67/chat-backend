import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
@ObjectType()
export class Chat {
  @Field(() => ID)
  _id: Types.ObjectId;

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
}

export type ChatHydratedDocument = HydratedDocument<Chat>;

export const ChatSchema = SchemaFactory.createForClass(Chat);
