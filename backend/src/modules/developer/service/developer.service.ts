import { Injectable, NotFoundException } from '@nestjs/common';
import { InvalidDataError } from '@shared/errors/invalid-data-error';
import { MAX_NAME_LENGTH } from '@shared/utils/constants';
import { Developer } from '../../../entities/developer.entity';
import { IDeveloperRepository } from '../../../database/repository/developer.repository';
import { CreateDeveloperDTO } from '../dto/create-developer.dto';
import { ResponseDeveloperDTO } from '../dto/list-developer.dto';
import { UpdateDeveloperDTO } from '../dto/update-developer.dto';
import { ILevelRepository } from '../../../database/repository/level.repository';

@Injectable()
export class DeveloperService {
    constructor(
        private repository: IDeveloperRepository,
        private levelsRepository: ILevelRepository
    ) { }

    public async create(createDeveloperDto: CreateDeveloperDTO): Promise<ResponseDeveloperDTO>
    {
        this.validateName(createDeveloperDto.name);
        await this.validateLevel(createDeveloperDto.level);
        this.validateGender(createDeveloperDto.gender);
        this.validateBirthDate(createDeveloperDto.birthDate);

        // hobby: string
        const developer = new Developer();
        developer.name      = createDeveloperDto.name.trim();
        developer.birthDate = createDeveloperDto.birthDate;
        developer.level_id  = createDeveloperDto.level;
        developer.gender    = createDeveloperDto.gender.trim();
        developer.hobby     = createDeveloperDto.hobby.trim();

        const registredDeveloper = await this.repository.save(developer);

        return {
            id: registredDeveloper.id,
            name: registredDeveloper.name,
            level_id: registredDeveloper.level_id,
            level: registredDeveloper.level?.name,
            gender: registredDeveloper.gender,
            birthDate: registredDeveloper.birthDate,
            hobby: registredDeveloper.hobby
        };
    }

    public async findAll(
        filter: Partial<{id: number, name: string, level:string}>,
        options?: {
            orderBy:string,
            skip: number,
            take: number,
            orderByAsc: boolean
    }): Promise<ResponseDeveloperDTO[]>
    {
        const take = options?.take || 100;
        const developers = await this.repository.findAll(filter, {
            skip: options?.skip || 0,
            take: take < 0? null : take,
            orderBy: options?.orderBy || 'id',
            orderByAsc: !!options?.orderByAsc,
            join: 'level'
        });

        if (!developers || developers.length === 0)
            throw new NotFoundException('Nenhum registro foi encontrado!');

        return developers.map<ResponseDeveloperDTO>( dev =>
            ({
                id: dev.id,
                name: dev.name,
                gender: dev.gender,
                birthDate: dev.birthDate,
                level: dev.level?.name,
                level_id: dev.level_id,
                hobby:dev.hobby
            })
        );
    }

    public async findOne(id: number): Promise<ResponseDeveloperDTO>
    {
        const developer =  await this.repository.find({ id });
        console.warn(developer);

        if (developer)
            return {
                id: developer.id,
                name: developer.name,
                birthDate: developer.birthDate,
                gender: developer.gender,
                level: developer?.level.name,
                level_id: developer.level_id,
                hobby: developer.hobby
            };

        throw new NotFoundException(`Não existe nível com o id: ${id}`);
    }

    public async update(id: number, updateDeveloperDto: UpdateDeveloperDTO): Promise<ResponseDeveloperDTO>
    {
        this.validateName(updateDeveloperDto.name);
        await  this.validateLevel(updateDeveloperDto.level);
        this.validateGender(updateDeveloperDto.gender);
        this.validateBirthDate(updateDeveloperDto.birthDate);

        if ( !(await this.repository.find( { id })) )
            throw new InvalidDataError(`Não foi possível o nível com id: ${id}!`);

        const developer: Developer = {
            id:        id,
            name:      updateDeveloperDto.name.trim(),
            birthDate: updateDeveloperDto.birthDate,
            level_id:  updateDeveloperDto.level,
            gender:    updateDeveloperDto.gender.trim(),
            hobby:     updateDeveloperDto.hobby.trim(),
        };
        await this.repository.update(developer);

        return {
            id: developer.id,
            name: developer.name,
            birthDate: developer.birthDate,
            gender: developer.gender,
            level_id: developer.level_id,
            level: developer.level?.name,
            hobby: developer.hobby
        };
    }

    public async remove(id: number)
    {
        const developerToBeDeleted = await this.repository.find({ id });

        if (!developerToBeDeleted)
            throw new InvalidDataError(`Não existe nível com o id: ${id}`);

        this.repository.delete(developerToBeDeleted);

    }

    private validateGender(gender: string)
    {
        if ( !gender )
            throw new InvalidDataError('Informar o sexo é obrigatório');
        if ( gender.toLowerCase() != 'm' && gender.toLowerCase() != 'f')
            throw new InvalidDataError('O sexo informado é inválido');
    }

    private validateBirthDate(birthDate: Date)
    {
        if ( !birthDate )
            throw  new InvalidDataError('A data de nacimento é obrigatória!');
        if ( birthDate > new Date() )
            throw new InvalidDataError('A data de nascimento não pode ser posterio ao dia atual');
    }

    private async validateLevel( id: number ) {
        if (id == null)
            throw new InvalidDataError('É obrigatório informar o nível do desenvolvedor');
        if ( ! await this.levelsRepository.find({ id }) )
            throw new InvalidDataError(`Não foi encontrado nenhum nível com id: ${id}`);
    }

    private validateName(name: string) {
        if (!name || name.trim().length === 0)
            throw new InvalidDataError('O nome não pode estar em branco!');

        if (name.trim().length > MAX_NAME_LENGTH)
            throw new InvalidDataError(`Nome muito longo, o máximo é ${MAX_NAME_LENGTH} caracteres!`);

    }
}
