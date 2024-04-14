import { DataSource } from "typeorm";
import { Expenses } from "../entity/expenses.entity";

export const ExpensesProvider = [
  {
    provide: 'ExpensesRepository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Expenses),
    inject: ['DATA_SOURCE'],
  },
];
