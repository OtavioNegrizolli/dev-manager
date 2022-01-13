import { InvalidDataError } from '../../../shared/errors/invalid-data-error';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateLevelDTO } from '../dto/create-level.dto';
import { Level } from '../../../entities/level.entity';
import { ILevelRepository } from '../../../database/repository/level.repository';
import { LevelService } from './level.service';
import { MAX_NAME_LENGTH } from '../../../shared/utils/constants';
import { UpdateLevelDTO } from '../dto/update-level.dto';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { async } from 'rxjs';

describe('LevelService', () => {
    let nameThatAlreadyExisits = 'already existing name';
    let levelsRepositoryMock;

    let service: LevelService;

    beforeEach( async () => {
        levelsRepositoryMock = {
            save: (level: Level) => { level.id = 1; return level; },
            find: (_: Partial<Level>) => ({id:1, name: 'test subject'}),
            findAll: () => ([]),
            update: async (_:any) => (null),
            delete: async (_:any) => (null)
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [ILevelRepository, LevelService],
        })
            .overrideProvider(ILevelRepository)
            .useValue(levelsRepositoryMock)
            .compile();
        service = module.get<LevelService>(LevelService);
    });

    it( 'should be defined', () => {
        expect(service).toBeDefined();
    });
    // on create
    describe( 'on creation', () =>
    {
        it('should throw "InvalidDataError" when the name is passed as null', async () => {
            const nullNameCreateLevelDTO: CreateLevelDTO = { name: null };

            await expect(service.create(nullNameCreateLevelDTO)).rejects.toMatchObject(new InvalidDataError('O nome não pode estar em branco!'));
        });

        it('should throw "InvalidDataError" when the name is empty or blank', async () => {
            const emptyNameCreateLevelDTO: CreateLevelDTO = { name: '        ' };

            await expect(service.create(emptyNameCreateLevelDTO)).rejects.toMatchObject(new InvalidDataError('O nome não pode estar em branco!'));
        });

        it(`should throw "InvalidDataError" when the name has more then ${MAX_NAME_LENGTH} chacracteres`, async () => {
            const emptyNameCreateLevelDTO: CreateLevelDTO = { name: '0123456789'.repeat(10) + '0' };

            await expect(service.create(emptyNameCreateLevelDTO)).rejects
                .toMatchObject(new InvalidDataError(`Nome muito longo, o máximo é ${MAX_NAME_LENGTH} caracteres!`));
        });

        it('should throw "InvalidDataError" with message \'This level already exists!\' when the name already exists', async () => {
            levelsRepositoryMock.find = (_: Partial<Level>) => (true);
            const areadyExistingNameCreateLevelDTO: CreateLevelDTO = { name: nameThatAlreadyExisits };

            await expect(service.create(areadyExistingNameCreateLevelDTO)).rejects
                .toMatchObject(new InvalidDataError('O nome informado já pertence a um nível!'));
        });

        it('should create a new level and return it with it\'s generated id', async () => {
            const validLevel: CreateLevelDTO = { name: 'Valid level' };
            levelsRepositoryMock.find = (_:any) => (null);

            await expect(service.create(validLevel)).resolves.toEqual({
                id: expect.any(Number),
                ...validLevel
            });
        });
    });

    // update
    describe( 'on update', () =>
    {
        const validId_for_test = 1;
        beforeEach(() => {
            levelsRepositoryMock.find = async (d: any) => ( d.id > 0? true : false );
        });

        it('should throw "InvalidDataError" when the name is passed as null', async () => {
            const nullNameUpdateLevelDTO: UpdateLevelDTO = { name: null };

            await expect(service.update(validId_for_test, nullNameUpdateLevelDTO)).rejects
                .toMatchObject(new InvalidDataError('O nome não pode estar em branco!'));
        });

        it('should throw "InvalidDataError" when the name is empty or blank', async () => {
            const emptyNameUpdateLevelDTO: UpdateLevelDTO = { name: '        ' };

            await expect(service.update(validId_for_test, emptyNameUpdateLevelDTO)).rejects
                .toMatchObject(new InvalidDataError('O nome não pode estar em branco!'));
        });

        it(`should throw "InvalidDataError" when the name has more then ${MAX_NAME_LENGTH} chacracteres`, async () => {
            const emptyNameUpdateLevelDTO: UpdateLevelDTO = { name: '0123456789'.repeat(10) + '0' };

            await expect(service.update(validId_for_test, emptyNameUpdateLevelDTO)).rejects
                .toMatchObject(new InvalidDataError(`Nome muito longo, o máximo é ${MAX_NAME_LENGTH} caracteres!`));
        });

        it('should throw "InvalidDataError" when the name already exists', async () => {
            levelsRepositoryMock.find = (_: Partial<Level>) => (true);
            const alreadyExistingNameUpdateLevelDTO: UpdateLevelDTO = { name: nameThatAlreadyExisits };

            await expect(service.update(validId_for_test, alreadyExistingNameUpdateLevelDTO)).rejects
                .toMatchObject(new InvalidDataError('O nome informado já pertence a um nível!'));
        });

        it ('should throw "InvalidDataError" when not found the level by it\'s id', async () => {
            const validLevelUpdateDTO: UpdateLevelDTO = { name: 'um nome válido' };
            const invalidId = 0;
            await expect(service.update(invalidId, validLevelUpdateDTO)).rejects
                .toMatchObject(new InvalidDataError(`Não foi possível encontrar o nível com id: ${invalidId}!`));
        });

        it('should return the update version of the level when saves', async () => {
            const validLevelUpdateDTO: UpdateLevelDTO = { name: 'um nome válido' };

            await expect(service.update(validId_for_test, validLevelUpdateDTO)).resolves
                .toMatchObject({
                    id: validId_for_test,
                    name: validLevelUpdateDTO.name
                });
        });
    });

    describe( 'on remove', () => {
        it('should throw "InvalidDataError" when the id don\'t belong to any register', async () => {
            const invalidLevelId = 0;
            levelsRepositoryMock.find = (_:any) => (null);

            await expect(service.remove(invalidLevelId)).rejects
                .toMatchObject(new InvalidDataError(`Não existe nível com o id: ${invalidLevelId}`));
        });

        it('should throw "ServiceUnavailableException" when the have at least one developer', async () => {
            const levelWhitDevsId = 1;
            levelsRepositoryMock.find = (_:any) => ( {id: 1, developers: [{ name: 'this is suposed to be a dev of this level' }] });

            await expect(service.remove(levelWhitDevsId)).rejects
                .toMatchObject(new ServiceUnavailableException('Este nível está sendo usado por desenvolvedores ativos!'));
        });

        it('should resolves when the level exists and can be deleted', async () =>{
            const removableLevelId = 1;
            await expect(service.remove(removableLevelId)).resolves.not.toThrow();
        });
    });

    describe( 'on listing', () =>
    {
        it('should return a null when a nothing is found', async () => {
            await expect(service.findAll()).rejects
            .toMatchObject( new NotFoundException('Nenhum registro foi encontrado!'));
        });
    });

});
