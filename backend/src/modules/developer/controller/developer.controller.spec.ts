import { Test, TestingModule } from '@nestjs/testing';
import { DeveloperController } from './developer.controller';
import { DeveloperService } from '../service/developer.service';
import { Developer } from '../../../entities/developer.entity';
import { CreateDeveloperDTO } from '../dto/create-developer.dto';
import { ResponseDeveloperDTO } from '../dto/list-developer.dto';
import { UpdateDeveloperDTO } from '../dto/update-developer.dto';
import { IDeveloperRepository } from '../../../database/repository/developer.repository';
import { ILevelRepository } from '../../../database/repository/level.repository';

const developerServiceMock = {
    create: async (createDeveloperDto: CreateDeveloperDTO): Promise<Developer> => {
        return {
            id: Math.floor(Math.random() * 100 + 1),
            name: createDeveloperDto.name,
            level_id: createDeveloperDto.level,
            birthDate: createDeveloperDto.birthDate,
            gender: createDeveloperDto.gender,
            hobby: createDeveloperDto.hobby,
        };
    },
    findAll: (
        filter: Partial<{
            id: number;
            name: string;
            level: string; }>,
        options?: {
            orderBy: string;
            skip: number;
            take: number;
            orderByAsc: boolean;
        }
    ) => {

    },

    findOne: (id: number) => {
    },

    update:  (id: number, updateDeveloperDto: UpdateDeveloperDTO) => {
    },

    remove:  (id: number) => {
    },

}


describe('DeveloperController', () => {
    let controller: DeveloperController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                DeveloperController
            ],
            providers: [
                DeveloperService,
            ],
        })
            .overrideProvider(DeveloperService)
            .useValue(developerServiceMock)
            .compile();

        controller = module.get<DeveloperController>(DeveloperController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
