import { IsUUID, IsString } from "class-validator";

export class SendDocumentDto {
  @IsUUID()
  employeeDocumentId: string;

  @IsString()
  storageKey: string;
}