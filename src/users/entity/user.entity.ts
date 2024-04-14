import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Users{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    created_at: string;

    @Column({length: 120})
    username: string;

    @Column({length: 100})
    password: string;

}
