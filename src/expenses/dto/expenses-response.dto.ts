import { Users } from "src/users/entity/user.entity";
import { Double } from "typeorm";

export class ExpensesResponseDto {

    public id: number;

    public createdAt: string;

    public dateOccurrence: Date;

    public description: string;

    public amount: number;

}
