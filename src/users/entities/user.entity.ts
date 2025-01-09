import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
@ObjectType() // graphql setting
export class User extends Document {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  @Field() // make this field queryable via graphql
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  @Field()
  email: string;

  @Exclude()
  @Prop({
    type: String,
    required: true,
  })
  // @Field() // by commenting this out it wont be visible in the graphql response
  password: string;
}

export type UserHydratedDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
