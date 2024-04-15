import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Helper } from '../app.helper';
import { UsersService } from '../users/service/users.service';
import { Users } from '../users/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';


export const UsersRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let helper: Helper;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: UsersRepository
        },
        JwtService, Helper]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = await module.resolve(AuthService);
    usersService = await module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    helper = await module.resolve(Helper);
  });

  it('should be defined', () => {

    expect(controller).toBeDefined();
  });
});
