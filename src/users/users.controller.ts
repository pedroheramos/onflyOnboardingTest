import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UsersService } from './service/users.service';
import { GetUserDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly UsersService: UsersService
    ) {}

    @Get()
    async getUsers(@Body() CreateUsersDto: CreateUsersDto) {
        return await this.UsersService.list();
    }//end list


    @Get('get')
    async getUser(@Body() GetUserDto: GetUserDto) {
        return await this.UsersService.list();
    }//end get

    @Post('create')
    async create(@Body() CreateUsersDto: CreateUsersDto) {
        return await this.UsersService.create(CreateUsersDto);
    }//end create

}
