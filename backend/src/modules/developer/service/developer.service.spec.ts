import { Test, TestingModule } from '@nestjs/testing';
import { IDeveloperRepository } from '../../../database/repository/developer.repository';
import { ILevelRepository } from '../../../database/repository/level.repository';
import { DeveloperService } from './developer.service';

const developersRepositoryMock = {
    delete:  async () => { },
    find:    async () => { },
    findAll: async () => { },
    save:    async ()=>  { },
    update:  async () => { }
}

describe('DeveloperService', () => {
    let service: DeveloperService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IDeveloperRepository,
                ILevelRepository,
                DeveloperService
            ],
        })
        .overrideProvider(IDeveloperRepository)
        .useValue(developersRepositoryMock)
        .overrideProvider(ILevelRepository)
        .useValue({ })
        .compile();

        service = module.get<DeveloperService>(DeveloperService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('', async () => {

    });
});
