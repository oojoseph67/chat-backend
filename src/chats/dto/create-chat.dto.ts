import { InputType, Int, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateChatDto {
  @Field()
  @IsBoolean()
  @Transform(({ value }: { value: string }) => value === 'true')
  isPrivate: boolean;

  @Field()
  @IsString()
  name: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  userIds?: string[];
}
