import { Developer } from "../../../entities/developer.entity";

export interface ResponseDeveloperDTO {
    id: number;
    name: string;
    level_id: number;
    level: string;
    gender: string;
    birthDate: Date;
    hobby?: string;
}
