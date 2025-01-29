import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
@ObjectType()
export class Message {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field({}) // visible in graphql schema
  @Prop({}) // for mongoose declaration
  content: string;

  @Field({})
  @Prop({})
  createdAt: Date;

  @Field({})
  @Prop({})
  userId: string;

  @Field({})
  @Prop({})
  chatId: string;
}

export type ChatHydratedDocument = HydratedDocument<Message>;

export const MessageSchema = SchemaFactory.createForClass(Message);
