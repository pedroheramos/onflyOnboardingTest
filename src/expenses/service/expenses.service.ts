import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../../users/entity/user.entity';
import { Expenses } from '../entity/expenses.entity';
import { CreateExpensesDto } from '../dto/create-expenses.dto';
import { ExpensesResponseDto } from '../dto/expenses-response.dto';
import { isBefore } from 'date-fns';

@Injectable()
export class ExpensesService {
    constructor(
        @Inject('ExpensesRepository') private readonly expensesRepository: Repository<Expenses>,
        @Inject('UsersRepository') private readonly usersRepository: Repository<Users>

    ) { }

    async list(username: string): Promise<ExpensesResponseDto[]> {
        const user = await this.usersRepository.find({ where: { username: username } })
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

        const user = await this.usersRepository.findOneBy({ id: createExpensesDto.userId })
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
        return {
            id: expenses.id,
            amount: expenses.amount,
            createdAt: expenses.created_at,
            dateOccurrence: expenses.date_occurrence,
            description: expenses.description
        } as ExpensesResponseDto
    }

}
