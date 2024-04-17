import { IsNumber, IsPositive, IsString, Length, MaxDate } from "class-validator";

export class PatchExpensesDto {
    
    @IsNumber()
    id: string;

    @IsString()
    @Length(1, 190)
    description: string;

    @IsPositive({message: 'Valor não pode ser negativo'})
    amount: number;

    userId: number;

    dateOccurrence: string;

}
