import { Module } from '@nestjs/common';
import { LevelController } from './controller/level.controller';
import { LevelService } from './service/level.service';
import { ILevelRepository } from '../../database/repository/level.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from '../../entities/level.entity';
import { Developer } from '../../entities/developer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Level,Developer])],
    controllers: [LevelController],
    providers: [ILevelRepository, LevelService],
    exports: []
})
export class LevelModule {}
