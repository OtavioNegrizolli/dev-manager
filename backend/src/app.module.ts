import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelModule } from './modules/level/level.module';
import { DeveloperModule } from './modules/developer/developer.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        LevelModule,
        DeveloperModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
