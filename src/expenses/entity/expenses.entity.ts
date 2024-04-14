import { Users } from '../../users/entity/user.entity';
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Expenses{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    created_at: string;

    @Column({nullable: false})
    date_occurrence: Date;

    @Column({length: 100})
    description: string;

    @Column({ precision: 10, scale: 2 })
    amount: number;

    @OneToOne(() => Users)
    @JoinColumn()
    user_owner: Users

    @Column()
    userOwnerId: number

}