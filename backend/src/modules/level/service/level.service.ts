import { Injectable, NotFoundException, NotImplementedException, ServiceUnavailableException } from '@nestjs/common';
import { InvalidDataError } from '../../../shared/errors/invalid-data-error';
import { CreateLevelDTO } from '../dto/create-level.dto';
import { UpdateLevelDTO } from '../dto/update-level.dto';
import { Level } from '../../../entities/level.entity';
import { ILevelRepository } from '../../../database/repository/level.repository';
import { ResponseLevelDTO } from '../dto/response-level.dto';
import { MAX_NAME_LENGTH } from '@shared/utils/constants';

@Injectable()
export class LevelService {

    /**
     *
     */
    constructor(
        private repository: ILevelRepository
    ) { }

    public async create(createLevelDto: CreateLevelDTO)
    {
        await this.validateName(createLevelDto.name);

        const level = new Level();
        level.name = createLevelDto.name.trim();

        const registredLevel = await this.repository.save(level);

        return registredLevel;
    }

    public async findAll(
        filter?: Partial<Level>,
        options?: {
            orderBy: string,
            skip: number,
            take: number,
            orderByAsc: boolean
        }
    ): Promise<ResponseLevelDTO[]>
    {
        const take = options?.take || 100;
        const levels = await this.repository.findAll(filter, {
            skip: options?.skip || 0,
            take: take < 0? null : take,
            orderBy: options?.orderBy || 'id',
            orderByAsc: !!options?.orderByAsc,
            join: 'developers'
        });

        if (!levels || levels.length === 0)
            throw new NotFoundException('Nenhum registro foi encontrado!');

        return levels.map<ResponseLevelDTO>( level => ({ id: level.id, name: level.name, totalDevelopers: level.developers?.length || 0 }) );
    }

    public async findOne(id: number)
    {
        const level =  await this.repository.find({ id });
        if (level)
            return { id: level.id, name: level.name };

        throw new NotFoundException(`Não existe nível com o id: ${id}`);
    }

    public async update(id: number, updateLevelDto: UpdateLevelDTO): Promise<ResponseLevelDTO>
    {
        await this.validateName(updateLevelDto.name);

        if ( !(await this.repository.find( {id: id })) )
            throw new InvalidDataError(`Não foi possível encontrar o nível com id: ${id}!`);

        const level: Level = { id: id, name: updateLevelDto.name.trim() };
        await this.repository.update(level);

        return { id: level.id, name: level.name };
    }

    public async remove(id: number)
    {
        const levelToBeDeleted = await this.repository.find({ id }, ['developers']);

        if (!levelToBeDeleted)
            throw new InvalidDataError(`Não existe nível com o id: ${id}`);
        if (levelToBeDeleted.developers && levelToBeDeleted.developers.length > 0)
            throw new ServiceUnavailableException('Este nível está sendo usado por desenvolvedores ativos!');

        this.repository.delete(levelToBeDeleted);

    }

    private async validateName(name: string) {
        if (!name || name.trim().length === 0)
            throw new InvalidDataError('O nome não pode estar em branco!');

        if (name.trim().length > MAX_NAME_LENGTH)
            throw new InvalidDataError(`Nome muito longo, o máximo é ${MAX_NAME_LENGTH} caracteres!`);

        if ( await this.repository.find({ name: name }) )
            throw new InvalidDataError('O nome informado já pertence a um nível!');
    }
}
