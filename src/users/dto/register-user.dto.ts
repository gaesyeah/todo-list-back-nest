import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class RegisterUserDto extends CreateUserDto {
  @IsString()
  confirmPassword: string;
}
