import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { Level } from "../../entities/level.entity";

@Injectable()
export class ILevelRepository
{
    constructor(
        @InjectRepository(Level) private readonly repository: Repository<Level>
    ) { }

    public async update(level: Level)
    {
        const entity: Level = {
            ... this.repository.create(),
            ...level
        };
        await this.repository.update( entity.id, entity);
    }

    public async findAll(
        data?: Partial<Level>,
        options?: {
            orderBy?: string,
            orderByAsc?: boolean
            skip?: number,
            take?: number,
            join?: keyof Level
        }
    ): Promise<Level[]>
    {
        let query: string[] = [];

        const params: { } = { };

        if (data.id) {
            query.push(' level.id = :id ');
            params['id'] = data.id ;
        }

        if ( data.name ) {
            query.push(' lower(level.name) like \'%\'|| lower(:name) || \'%\' ');
            params['name'] = data.name;
        }

        let qb = this.repository.createQueryBuilder('level')
            .where(query.join(' and '), params);

        if (options) {
            const { orderBy, orderByAsc, skip, take, join } = options;
            if (join)
                qb = qb.leftJoinAndSelect('level.developers', 'developers');

            if (orderBy)
                qb = qb.orderBy('level.' + options.orderBy, orderByAsc? 'ASC': 'DESC');

            if( skip )
                qb = qb.skip(options.skip)
            if(take)
                qb = qb.take(options.take);
        }

        const levels = await qb.getMany();
        return levels;
    }

    public async save(level: Level): Promise<Level> {
        const entity = {
            ...this.repository.create(),
            ...level
        };
        return await this.repository.save(entity);
    }

    public async find( data?: Partial<Level>, joins?: string[]  )
    {
        const findOptions: FindOneOptions<Level> = { };
        if (joins)
        {
            findOptions.relations = joins;
        }

        if (!!data.id)
            return await this.repository.findOne({...data }, findOptions);
        else if (data.name)
            return await this.repository.createQueryBuilder().where('lower(name) = lower(:name)', { name: data.name }).getOne();

        return null;
    }

    public async delete(levelToBeDeleted: Level) {
        await this.repository.delete( { id: levelToBeDeleted.id } );
    }

}
