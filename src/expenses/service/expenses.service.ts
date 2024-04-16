import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../../users/entity/user.entity';
import { Expenses } from '../entity/expenses.entity';
import { CreateExpensesDto } from '../dto/create-expenses.dto';
import { ExpensesResponseDto } from '../dto/expenses-response.dto';
import { isBefore } from 'date-fns';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../../users/service/users.service';

@Injectable()
export class ExpensesService {
    constructor(
        @Inject('ExpensesRepository') private readonly expensesRepository: Repository<Expenses>,
        private readonly mailerService: MailerService,
        private readonly usersService: UsersService
    ) { }

    async list(username: string): Promise<ExpensesResponseDto[]> {
        const user = await this.usersService.find(username)
        if (user.length == 0)
            return []
        let expenses = await this.expensesRepository.find(
            {
                relations: {
                    user_owner: true
                },
                where: {
                    userOwnerId: user[0].id
                }
            }
        )

        return expenses.map(item => {
            return {
                id: item.id,
                createdAt: item.created_at,
                dateOccurrence: item.date_occurrence,
                description: item.description,
                amount: item.amount
            } as ExpensesResponseDto
        })

    }

    async create(createExpensesDto: CreateExpensesDto): Promise<ExpensesResponseDto> {

        const user = await this.usersService.findOneBy(createExpensesDto.userId)
        if (!user)
            throw new HttpException('User not found!', HttpStatus.BAD_REQUEST)

        const checkDate = createExpensesDto.dateOccurrence;
        console.log(checkDate)
        console.log(typeof checkDate)
        if (!isBefore(checkDate, new Date()))
            throw new HttpException('Data não pode ser no futuro.', HttpStatus.BAD_REQUEST)


        const createExpense = {
            amount: createExpensesDto.amount,
            date_occurrence: createExpensesDto.dateOccurrence,
            description: createExpensesDto.description,
            userOwnerId: createExpensesDto.userId
        };

        const expenses = await this.expensesRepository.save(createExpense);
        console.log(expenses)


        this.mailerService
            .sendMail({
                to: 'pedroheramos@gmail.com', // list of receivers
                from: 'noreply@nestjs.com', // sender address
                subject: 'despesa cadastrada ✔', // Subject line
                text: ' ', // plaintext body
                html: '<b> </b>', // HTML body content
            })
            .then((success) => {
                console.log(success)
            })
            .catch((err) => {
                console.log(err)
            });
            
        return {
            id: expenses.id,
            amount: expenses.amount,
            createdAt: expenses.created_at,
            dateOccurrence: expenses.date_occurrence,
            description: expenses.description
        } as ExpensesResponseDto
    }

}
