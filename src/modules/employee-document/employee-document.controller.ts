import { Controller, Body, Param, Post } from '@nestjs/common';
import { LinkDocumentTypeDto } from './dto/link-document-type.dto';
import { EmployeeDocumentService } from './employee-document.service';

@Controller('employee-document')
export class EmployeeDocumentController {
    constructor(private readonly employeeDocumentService: EmployeeDocumentService) { }

    @Post(':id/link-document-type')
    async linkDocumentType(@Param('id') id: string, @Body() dto: LinkDocumentTypeDto) {
        return this.employeeDocumentService.linkDocumentType(id, dto);
    }
}
