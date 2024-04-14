import { Type } from "class-transformer";
import { IsDate, IsDateString, IsPositive, IsString, Length, MaxDate } from "class-validator";
import { addDays } from "date-fns";

export class CreateExpensesDto {

    @IsString()
    @Length(1, 190)
    description: string;

    @IsPositive({message: 'Valor não pode ser negativo'})
    amount: number;

    userId: number;

    dateOccurrence: string;

}
