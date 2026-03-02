import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService, LoginDto, LoginResponse } from './auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';

class LoginBodyDto implements LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  senha: string;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() body: LoginBodyDto): Promise<LoginResponse> {
    return this.auth.login(body);
  }
}
