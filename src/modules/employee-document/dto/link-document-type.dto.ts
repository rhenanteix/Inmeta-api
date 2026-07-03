import { IsUUID } from "class-validator";

export class LinkDocumentTypeDto {
    @IsUUID()
    documentTypeId: string;
}