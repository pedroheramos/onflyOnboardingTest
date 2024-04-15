import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../entity/user.entity';
import { UsersRepository } from '../../auth/auth.controller.spec';
import { Helper } from '../../app.helper';

describe('UsersService', () => {
  let service: UsersService;
  let helper: Helper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: UsersRepository
        },
        Helper
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    helper = await module.resolve(Helper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
