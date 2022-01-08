import { Module } from '@nestjs/common';
import { DeveloperService } from './service/developer.service';
import { DeveloperController } from './controller/developer.controller';
import { IDeveloperRepository } from '../../database/repository/developer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Developer } from '../../entities/developer.entity';
import { Level } from '../../entities/level.entity';
import { ILevelRepository } from '../../database/repository/level.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Developer, Level])
    ],
    controllers: [DeveloperController],
    providers: [
        IDeveloperRepository,
        ILevelRepository,
        DeveloperService
    ]
})
export class DeveloperModule { }
