import { PartialType } from '@nestjs/mapped-types';
import { CreateDeveloperDTO } from './create-developer.dto';

export class UpdateDeveloperDTO extends PartialType(CreateDeveloperDTO) {}
