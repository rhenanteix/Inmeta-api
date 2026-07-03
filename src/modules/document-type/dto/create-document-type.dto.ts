import { IsString } from "class-validator";

export class CreateDocumentTypeDto {
    @IsString()
    name: string;

    @IsString()
    description: string;
}