import { User } from "src/users/interface/user.interface";

export interface Expenses{
    id: string;
    description: string;
    created_at: Date;
    user_owner: User;
}