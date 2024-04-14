import { Inject, Injectable } from '@nestjs/common';
import { CreateUsersDto } from '../dto/create-users.dto';
import { Helper } from '../../app.helper';
import { Users } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { GetUserDto } from '../dto/get-user.dto';


// This should be a real class/interface representing a user entity
export type UserAny = any;

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository') private readonly usersRepository: Repository <Users>,
    private readonly helper: Helper
  ) {}

  async findOne(GetUserDto: GetUserDto): Promise<Users | null> {
    return await this.usersRepository.findOne({where: {username: GetUserDto.username}});
  }

  async list(): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  
  async create(CreateUsersDto: CreateUsersDto): Promise<string> {

    CreateUsersDto.password = this.helper.encrypt(CreateUsersDto.password);
    return CreateUsersDto.password;
  }
}