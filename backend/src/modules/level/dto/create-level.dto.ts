import { IsNotEmpty, MinLength } from "class-validator";

export class CreateLevelDTO {
    @IsNotEmpty({message: 'O nome não pode estar em branco'})
    name: string;
}
