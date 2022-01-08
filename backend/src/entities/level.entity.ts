import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Developer } from './developer.entity';

@Entity()
export class Level {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: 100, nullable: false })
    name: string;
    @OneToMany(() => Developer, dev => dev.level)
    developers?: Developer[];
}
