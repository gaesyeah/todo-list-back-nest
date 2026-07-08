import { IsEmail, IsString } from 'class-validator';
import { User } from 'src/generated/prisma/client';

export class CreateUserDto implements Pick<User, 'email' | 'password'> {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
