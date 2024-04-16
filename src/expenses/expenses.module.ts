import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './service/expenses.service';
import { ExpensesProvider } from './service/expenses.provider';
import { DatabaseModule } from '../database/database.module';
import { Helper } from '../app.helper';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [DatabaseModule, UsersModule],
    controllers: [ExpensesController],
    providers: [
        ExpensesService, ...ExpensesProvider, Helper
    ],
    exports:[ExpensesService]
})
export class ExpensesModule { }
