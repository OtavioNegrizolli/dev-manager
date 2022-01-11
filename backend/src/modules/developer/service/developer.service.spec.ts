import { Test, TestingModule } from '@nestjs/testing';
import { IDeveloperRepository } from '../../../database/repository/developer.repository';
import { ILevelRepository } from '../../../database/repository/level.repository';
import { Developer } from '../../../entities/developer.entity';
import { InvalidDataError } from '../../../shared/errors/invalid-data-error';
import { MAX_NAME_LENGTH } from '../../../shared/utils/constants';
import { DeveloperService } from './developer.service';


const makeValidCreateDTO = (): any => {

    return {
        gender: 'm',
        level: 1,
        name: 'a valid name',
        hobby: 'some hobby',
        birthDate: new Date()
    }
}

describe('DeveloperService', () => {
    let service: DeveloperService;
    let developersRepositoryMock;
    let levelRepositoryMock;

    beforeEach( async () => {
        developersRepositoryMock = {
            delete:  async () => { },
            find:    async (prams: any) => ({id: 1, name: 'some level'}),
            findAll: async () => { },
            save:    async (dev)=>  ({ id: 1, ...dev }),
            update:  async () => { }
        }
        levelRepositoryMock = {

            find: async (params: { id: number }) => ({ id: 1 })
        }

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
        .useValue(levelRepositoryMock)
        .compile();

        service = module.get<DeveloperService>(DeveloperService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('creation pipeline', () => {

        it('should throws "InvalidDataError" when the name is null', async () => {
            const nullNameDTO = makeValidCreateDTO();
            nullNameDTO.name = null;

            await expect(service.create(nullNameDTO)).rejects.toMatchObject(new InvalidDataError('O nome não pode estar em branco!'));
        });

        it('should throws "InvalidDataError" when the name is empty', async () => {
            const emptyNameDTO = makeValidCreateDTO();
            emptyNameDTO.name = '         ';

            await expect(service.create(emptyNameDTO)).rejects.toMatchObject(new InvalidDataError('O nome não pode estar em branco!'));
        });

        it(`should throws "InvalidDataError" when the name is longger then ${MAX_NAME_LENGTH}`, async () => {
            const emptyNameDTO = makeValidCreateDTO();
            emptyNameDTO.name = '0123456789'.replace(/\d/g, '0123456789') + '1';

            await expect(service.create(emptyNameDTO)).rejects
                .toMatchObject(new InvalidDataError(`Nome muito longo, o máximo é ${MAX_NAME_LENGTH} caracteres!`));
        });

        it('should throws "InvalidDataError" when the level is null', async () => {
            const nullLevelDTO = makeValidCreateDTO();
            nullLevelDTO.level = null;

            await expect(service.create(nullLevelDTO)).rejects
                .toMatchObject(new InvalidDataError('É obrigatório informar o nível do desenvolvedor'));
        });

        it('should throws "InvalidDataError" when the level don\'t exist', async () => {
            const inexistendLevelId = 1;
            const inexistentLevelIdDTO = makeValidCreateDTO();
            inexistentLevelIdDTO.level = inexistendLevelId;

            levelRepositoryMock.find = (_: any) => (null);

            await expect(service.create(inexistentLevelIdDTO)).rejects
                .toMatchObject(new InvalidDataError(`Não foi encontrado nenhum nível com id: ${inexistendLevelId}`));
        });

        it('should throws "InvalidDataError" when the gender is null', async () => {
            const nullGenderDTO = makeValidCreateDTO();
            nullGenderDTO.gender = null;

            await expect(service.create(nullGenderDTO)).rejects
                .toMatchObject(new InvalidDataError('Informar o sexo é obrigatório'));
        });

        it('should throws "InvalidDataError" when the gender is diferent from \'m\' and \'f\'', async () => {
            const nullGenderDTO = makeValidCreateDTO();
            nullGenderDTO.gender = 'j';

            await expect(service.create(nullGenderDTO)).rejects
                .toMatchObject(new InvalidDataError('O sexo informado é inválido'));
        });

        it('should throws "InvalidDataError" when the birth date is null', async () => {
            const nullBirthDateDTO = makeValidCreateDTO();
            nullBirthDateDTO.birthDate = null;

            await expect(service.create(nullBirthDateDTO)).rejects
                .toMatchObject(new InvalidDataError('A data de nacimento é obrigatória!'));
        });

        it('should throws "InvalidDataError" when the birth date is after today', async () => {
            const nullBirthDateDTO = makeValidCreateDTO();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            nullBirthDateDTO.birthDate = tomorrow;

            await expect(service.create(nullBirthDateDTO)).rejects
                .toMatchObject(new InvalidDataError('A data de nascimento não pode ser posterio ao dia atual'));
        });

        it('should returns the saved level with its generated id', async () => {
            const validDevDTO = makeValidCreateDTO();
            const expectedValue: Developer = {
                id: expect.any(Number),
                name: validDevDTO.name,
                birthDate: validDevDTO.birthDate,
                gender: validDevDTO.gender,
                level_id: validDevDTO.level,
                hobby: validDevDTO.hobby
            };
            await expect(service.create(validDevDTO)).resolves.toEqual(expectedValue);
        });
    });

    describe('update pipeline', () => {

        it('should throws "InvalidDataError" when the name is null', async () => {
            const nullNameDTO = makeValidCreateDTO();
            nullNameDTO.name = null;

            await expect(service.update(1, nullNameDTO)).rejects.toMatchObject(new InvalidDataError('O nome não pode estar em branco!'));
        });

        it('should throws "InvalidDataError" when the name is empty', async () => {
            const emptyNameDTO = makeValidCreateDTO();
            emptyNameDTO.name = '         ';

            await expect(service.update(1, emptyNameDTO)).rejects.toMatchObject(new InvalidDataError('O nome não pode estar em branco!'));
        });

        it(`should throws "InvalidDataError" when the name is longger then ${MAX_NAME_LENGTH}`, async () => {
            const emptyNameDTO = makeValidCreateDTO();
            emptyNameDTO.name = '0123456789'.replace(/\d/g, '0123456789') + '1';

            await expect(service.update(1, emptyNameDTO)).rejects
                .toMatchObject(new InvalidDataError(`Nome muito longo, o máximo é ${MAX_NAME_LENGTH} caracteres!`));
        });

        it('should throws "InvalidDataError" when the level is null', async () => {
            const nullLevelDTO = makeValidCreateDTO();
            nullLevelDTO.level = null;

            await expect(service.update(1, nullLevelDTO)).rejects
                .toMatchObject(new InvalidDataError('É obrigatório informar o nível do desenvolvedor'));
        });

        it('should throws "InvalidDataError" when the level don\'t exist', async () => {
            const inexistendLevelId = 1;
            const inexistentLevelIdDTO = makeValidCreateDTO();
            inexistentLevelIdDTO.level = inexistendLevelId;

            levelRepositoryMock.find = (_: any) => (null);

            await expect(service.update(1, inexistentLevelIdDTO)).rejects
                .toMatchObject(new InvalidDataError(`Não foi encontrado nenhum nível com id: ${inexistendLevelId}`));
        });

        it('should throws "InvalidDataError" when the gender is null', async () => {
            const nullGenderDTO = makeValidCreateDTO();
            nullGenderDTO.gender = null;

            await expect(service.update(1, nullGenderDTO)).rejects
                .toMatchObject(new InvalidDataError('Informar o sexo é obrigatório'));
        });

        it('should throws "InvalidDataError" when the gender is diferent from \'m\' and \'f\'', async () => {
            const nullGenderDTO = makeValidCreateDTO();
            nullGenderDTO.gender = 'j';

            await expect(service.update(1, nullGenderDTO)).rejects
                .toMatchObject(new InvalidDataError('O sexo informado é inválido'));
        });

        it('should throws "InvalidDataError" when the birth date is null', async () => {
            const nullBirthDateDTO = makeValidCreateDTO();
            nullBirthDateDTO.birthDate = null;

            await expect(service.update(1, nullBirthDateDTO)).rejects
                .toMatchObject(new InvalidDataError('A data de nacimento é obrigatória!'));
        });

        it('should throws "InvalidDataError" when the birth date is after today', async () => {
            const nullBirthDateDTO = makeValidCreateDTO();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            nullBirthDateDTO.birthDate = tomorrow;

            await expect(service.update(1, nullBirthDateDTO)).rejects
                .toMatchObject(new InvalidDataError('A data de nascimento não pode ser posterio ao dia atual'));
        });

        it('should throws "InvalidDataError" when the developer is not found', async () => {
            const inexistentDeveloperId = 0;
            const validUpdateDTO = makeValidCreateDTO();
            developersRepositoryMock.find = (_:any) => (null);

            await expect(service.update(inexistentDeveloperId, validUpdateDTO)).rejects
                .toMatchObject(new InvalidDataError(`Não foi possível o nível com id: ${inexistentDeveloperId}!`));
        });

        it('should returns the saved level with its generated id', async () => {
            const validDevDTO = makeValidCreateDTO();
            const expectedValue: Developer = {
                id: expect.any(Number),
                name: validDevDTO.name,
                birthDate: validDevDTO.birthDate,
                gender: validDevDTO.gender,
                level_id: validDevDTO.level,
                hobby: validDevDTO.hobby
            };
            await expect(service.update(1, validDevDTO)).resolves.toEqual(expectedValue);
        });
    });
});
