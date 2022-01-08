
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Developer } from "../../entities/developer.entity";
import { Repository } from "typeorm";

@Injectable()
export class IDeveloperRepository
{
    constructor(
        @InjectRepository(Developer) private readonly repository: Repository<Developer>
    ) { }

    public async update(level: Developer)
    {
        const entity: Developer = {
            ... this.repository.create(),
            ...level
        };
        await this.repository.update( entity.id, entity);
    }

    public async findAll(
        data?: {
            level?: string
            name?: string,
            id?: number,
        },
        options?: {
            orderBy?: string,
            orderByAsc?: boolean
            skip?: number,
            take?: number,
            join?: keyof Developer
        }
    ): Promise<Developer[]>
    {
        let query: string[] = [];

        const params: {} = { };
        // the primary key invalidate other filters
        if (data.id)
        {
            query.push('id = :id');
            params['id'] = data.id ;
        }

        if ( data.level )
        {
            query.push(`lower(level.name) like '%' || lower(:level) || '%'`)
            params['level'] = data.level
        }

        if ( data.name )
        {
            query.push('dev.name like \'%\'|| :name || \'%\'');
            params['name'] = data.name;
        }

        let qb = this.repository.createQueryBuilder('dev');

        if (options) {
            const { orderBy, orderByAsc, skip, take, join } = options;
            if (join)
                qb = qb.innerJoinAndSelect('dev.level', 'level');
            if (orderBy)
                qb = qb.orderBy('dev.'+options.orderBy, orderByAsc? 'ASC': 'DESC');
            if( skip )
                qb = qb.skip(options.skip)
            if(take)
                qb = qb.take(options.take);
        }
        qb = qb.where(query.join(' and '), params);
        const devs = await qb.getMany();
        return devs;
    }

    public async save(level: Developer): Promise<Developer> {
        const entity = {
            ...this.repository.create(),
            ...level
        };
        return await this.repository.save(entity);
    }

    public async find( data?: Partial<Developer> )
    {
        if (!!data.id)
            return await this.repository.findOne({ id: data.id }, {
                relations: ['level']
            });
        else if (data.name)
            return await this.repository.createQueryBuilder().where('name = :name', { name: data.name }).getOne();

        return null;
    }

    public async delete(levelToBeDeleted: Developer) {
        await this.repository.delete( { id: levelToBeDeleted.id } );
    }
}
