import { DataSource } from "typeorm";
import { Users } from "../entity/user.entity";

export const UsersProviders = [
  {
    provide: 'UsersRepository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Users),
    inject: ['DATA_SOURCE'],
  },
];
