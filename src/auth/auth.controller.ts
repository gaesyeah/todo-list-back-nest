import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: RegisterUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signIn(@Body() dto: CreateUserDto) {
    return this.authService.signIn(dto);
  }
}
