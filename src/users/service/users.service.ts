import { Inject, Injectable } from '@nestjs/common';
import { CreateUsersDto } from '../dto/create-users.dto';
import { Helper } from '../../app.helper';
import { Users } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { GetUserDto } from '../dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository') private readonly usersRepository: Repository <Users>,
    private readonly helper: Helper
  ) {}

  async find(username: string): Promise<Users[]> {
    return await this.usersRepository.find({where: {username: username}});
  }

  async findOne(GetUserDto: GetUserDto): Promise<Users | null> {
    return await this.usersRepository.findOne({where: {username: GetUserDto.username}});
  }

  async findOneBy(id: number): Promise<Users | null> {
    return await this.usersRepository.findOneBy({id: id});
  }

  async list(): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  
  async create(CreateUsersDto: CreateUsersDto): Promise<string> {

    CreateUsersDto.password = this.helper.encrypt(CreateUsersDto.password);
    return CreateUsersDto.password;
  }
}