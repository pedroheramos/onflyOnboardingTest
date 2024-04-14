import { Module, SetMetadata } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Helper } from 'src/app.helper';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('CONSTANT_SECRET_ENCRYPTER'),
        signOptions: {
            expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
      global: true
    })
  ],
  providers: [AuthService, Helper],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }