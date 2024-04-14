import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './service/expenses.service';
import { ExpensesProvider } from './service/expenses.provider';
import { DatabaseModule } from 'src/database/database.module';
import { Helper } from 'src/app.helper';
import { UsersProviders } from 'src/users/service/users.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [ExpensesController],
    providers: [
        ExpensesService, ...ExpensesProvider, ...UsersProviders, Helper
    ],
    exports:[ExpensesService]
})
export class ExpensesModule { }
