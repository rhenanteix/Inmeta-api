import {
    IsInt,
    IsOptional,
    IsUUID,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class FindPendingDocumentsDto {

    @IsOptional()

    @Type(() => Number)

    @IsInt()

    @Min(1)

    page = 1;

    @IsOptional()

    @Type(() => Number)

    @IsInt()

    @Min(1)

    limit = 10;

    @IsOptional()

    @IsUUID()

    employeeId?: string;

    @IsOptional()

    @IsUUID()

    documentTypeId?: string;

}