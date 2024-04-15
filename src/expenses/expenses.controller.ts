import { Controller, Post, Get, Req, Headers, Body, Patch } from '@nestjs/common';
import { ExpensesService } from './service/expenses.service';
import { JwtService } from '@nestjs/jwt';
import { CreateExpensesDto } from './dto/create-expenses.dto';


@Controller('expenses')
export class ExpensesController {
    constructor(
        private readonly ExpensesService: ExpensesService,
        private jwtService: JwtService
    ) { }

    @Post()
    async post(@Body() CreateExpensesDto: CreateExpensesDto) {
        return await this.ExpensesService.create(CreateExpensesDto);
    }//end create


    @Get()
    async get(@Req() request: Request, @Headers('authorization') authorization?: string) {
        const authstring: string = authorization || '';
        const [type, token] = authstring?.split(' ') ?? [];
        const decodedToken = await this.jwtService.decode(token);
        return await this.ExpensesService.list(decodedToken.username);
        return [decodedToken]
    }


    @Patch()
    async patch(@Req() request: Request, @Headers('authorization') authorization?: string) {
        const authstring: string = authorization || '';
        const [type, token] = authstring?.split(' ') ?? [];
        const decodedToken = await this.jwtService.decode(token);
        return await this.ExpensesService.list(decodedToken.username);
        return [decodedToken]
    }

}