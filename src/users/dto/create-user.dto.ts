import { InputType, Int, Field } from '@nestjs/graphql';
import { Exclude, Transform } from 'class-transformer';
import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field({
    description: 'The name of the user to create',
    defaultValue: 'John Doe',
  })
  @MinLength(2)
  name: string;

  @Field({
    description: 'The email address of the user',
    defaultValue: 'john@doe.com',
  })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @Field({
    description: 'The password of the user',
    defaultValue: 'password123',
  })
  @IsStrongPassword()
  @MinLength(8)
  password: string;
}
