import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, ValidationPipe } from '@nestjs/common';
import { HttpStatusCode } from '@shared/utils/http-status-code';
import { CreateLevelDTO } from '../dto/create-level.dto';
import { UpdateLevelDTO } from '../dto/update-level.dto';
import { LevelService } from '../service/level.service';

@Controller('level')
export class LevelController {
    constructor(private readonly levelService: LevelService) { }

    @Post()
    @HttpCode(HttpStatusCode.CREATED)
    public async create(@Body(ValidationPipe) createLevelDto: CreateLevelDTO) {
        return await this.levelService.create(createLevelDto);
    }

    @Get()
    public async findAll(
        @Query('id') id: string,
        @Query('name') name: string,
        @Query('skip') skip: string,
        @Query('take') take: string,
        @Query('orderBy') orderBy: string,
        @Query('asc') asc: string
    ) {
        return await this.levelService.findAll(
            {
                id: +id,
                name
            },
            {
                skip: +skip,
                take: +take,
                orderBy,
                orderByAsc: asc == 'true'
            },
        );
    }

    @Get(':id')
    public async findOne(@Param('id') id: string) {
        return await this.levelService.findOne(+id);
    }

    @Patch(':id')
    public async update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDTO) {
        return await this.levelService.update(+id, updateLevelDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatusCode.NO_CONTENT)
    public async remove(@Param('id') id: string) {
        await this.levelService.remove(+id);
    }
}
