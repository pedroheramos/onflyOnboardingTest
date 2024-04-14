import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/service/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SignUserDto } from '../dto/sign-user.dto';
import { SignUserResponseDto } from '../dto/sign-user-response.dto';
import { UsersModule } from '../../users/users.module';
import { Helper } from '../../app.helper';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let helper: Helper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        }),
        ConfigModule.forRoot({
          isGlobal: true,
        })
      ],
      providers: [
        AuthService,
        Helper
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    helper = await module.resolve(Helper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(helper).toBeDefined();
  });

  it('should not sign in', async () => {
    const result = null;
    jest.spyOn(usersService, 'findOne').mockImplementation(() => new Promise(function (resolve, reject) {
      resolve(result)
    }));

    //expect(await usersService.findOne()).toBe(result);
  })

  it('should sign in', async () => {
    const request = {
      "username": "pedro@onfly.com.br",
      "password": '123123123123'
    };
    const resultFindOne = {
      "id": 1,
      "created_at": "2024-04-11T22:09:00.071Z",
      "username": "pedro@onfly.com.br",
      "password": helper.encrypt('123123123123')
    };
    jest.spyOn(usersService, 'findOne').mockImplementation(() => new Promise(function (resolve, reject) {
      resolve(resultFindOne)
    }));

    const signUser = {
      username: request.username,
      password: request.password
    } as SignUserDto;


    jest.spyOn(jwtService, 'signAsync').mockImplementation(() => new Promise(function(resolve, reject) {
      resolve('x')
    }))

    const signUserResponse = {
      access_token: 'x'
    } as SignUserResponseDto

    const resultSignIn = await service.signIn(signUser);

    expect(resultSignIn.access_token).toBe(signUserResponse.access_token);
  })
});
