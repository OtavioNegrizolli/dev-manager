import { Test, TestingModule } from '@nestjs/testing';
import { Level } from '../../../entities/level.entity';
import { CreateLevelDTO } from '../dto/create-level.dto';
import { ResponseLevelDTO } from '../dto/response-level.dto';
import { UpdateLevelDTO } from '../dto/update-level.dto';
import { LevelService } from '../service/level.service';
import { LevelController } from './level.controller';

const levelServiceMock = {
    create: async (createLevelDto: CreateLevelDTO): Promise<Level> =>
    {
        throw new Error('Method not implemented.');
    },
    findAll: async (filter?: Partial<Level>, options?: { orderBy: string; skip: number; take: number; orderByAsc: boolean; }): Promise<ResponseLevelDTO[]> =>
    {
        throw new Error('Method not implemented.');
    },
    findOne: async (id: number): Promise<{ id: number; name: string; }> =>
    {
        throw new Error('Method not implemented.');
    },
    update: async (id: number, updateLevelDto: UpdateLevelDTO): Promise<ResponseLevelDTO> =>
    {
        throw new Error('Method not implemented.');
    },
    remove: async (id: number): Promise<void> =>
    {
        throw new Error('Method not implemented.');
    }
}

describe('LevelController', () => {
    let controller: LevelController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LevelController],
            providers: [LevelService],
        })
            .overrideProvider(LevelService)
            .useValue(levelServiceMock)
            .compile();

        controller = module.get<LevelController>(LevelController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
