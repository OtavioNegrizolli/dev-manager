import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { DeveloperService } from '../service/developer.service';
import { CreateDeveloperDTO } from '../dto/create-developer.dto';
import { UpdateDeveloperDTO } from '../dto/update-developer.dto';
import { HttpStatusCode } from '../../../shared/utils/http-status-code';

@Controller('developer')
export class DeveloperController {
    constructor(private readonly developerService: DeveloperService) { }

    @Post()
    @HttpCode(HttpStatusCode.CREATED)
    public create(@Body() createDeveloperDto: CreateDeveloperDTO) {
        return this.developerService.create(createDeveloperDto);
    }

    @Get()
    public findAll(
        @Query('id') id: string,
        @Query('name') name: string,
        @Query('level') level: string,
        @Query('skip') skip: string,
        @Query('take') take: string,
        @Query('orderBy') orderBy: string,
        @Query('asc') asc: string
    ) {
        const filter ={ name, id: +id, level };
        return this.developerService.findAll( filter, {
            skip: +skip,
            take: +take,
            orderBy,
            orderByAsc: asc == 'true'
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.developerService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDeveloperDto: UpdateDeveloperDTO) {
        return this.developerService.update(+id, updateDeveloperDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.developerService.remove(+id);
    }
}
