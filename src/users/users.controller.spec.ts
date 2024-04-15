import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './service/users.service';
import { UsersRepository } from '../auth/auth.controller.spec';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { Helper } from '../app.helper';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let helper: Helper;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: UsersRepository
        },
      Helper
    ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    helper = await module.resolve(Helper);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
