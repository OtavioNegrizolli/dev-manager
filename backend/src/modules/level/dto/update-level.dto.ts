import { PartialType } from '@nestjs/mapped-types';
import { CreateLevelDTO } from './create-level.dto';

export class UpdateLevelDTO extends PartialType(CreateLevelDTO) {}
