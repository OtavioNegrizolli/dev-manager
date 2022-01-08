import { MAX_NAME_LENGTH } from "@shared/utils/constants";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Level } from "./level.entity";

@Entity()
export class Developer
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: MAX_NAME_LENGTH })
    name: string;

    @Column()
    level_id: number;

    @ManyToOne(() => Level, level => level.developers, { eager: true })
    @JoinColumn({name: 'level_id'})
    level?: Level;

    @Column({ length: 1 })
    gender: string;

    @Column({ type: 'date' })
    birthDate: Date;

    @Column({ length: 1000, nullable: true })
    hobby?: string;
}
