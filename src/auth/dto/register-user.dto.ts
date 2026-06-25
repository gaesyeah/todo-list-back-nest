import { IsString } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class RegisterUserDto extends CreateUserDto {
  @IsString()
  confirmPassword: string;
}
