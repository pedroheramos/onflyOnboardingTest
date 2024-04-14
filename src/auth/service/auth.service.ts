import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUserDto } from '../dto/sign-user.dto';
import { Helper } from '../../app.helper';
import { SignUserResponseDto } from '../dto/sign-user-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private readonly helper: Helper
    ) { }

    async signIn(
        SignUserDto: SignUserDto
    ): Promise<SignUserResponseDto> {
        let inpassword = SignUserDto.password;
        
        inpassword = this.helper.encrypt(inpassword);

        const user = await this.usersService.findOne(SignUserDto);
        if (user?.password !== inpassword) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;

        const payload = { sub: user.id, username: user.username };

        return {
            access_token: await this.jwtService.signAsync(payload),
        } as SignUserResponseDto;
    }
}