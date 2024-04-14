import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, SetMetadata } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { SignUserDto } from './dto/sign-user.dto';


export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() SignUserDto: SignUserDto) {
    return this.authService.signIn(SignUserDto);
  }

}
