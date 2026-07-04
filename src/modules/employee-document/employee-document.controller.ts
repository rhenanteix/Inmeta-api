import { Controller, Body, Param, Post, Delete, Get, Query  } from '@nestjs/common';
import { LinkDocumentTypeDto } from './dto/link-document-type.dto';
import { EmployeeDocumentService } from './employee-document.service';
import { FindPendingDocumentsDto } from './dto/find-pending-documents.dto';

@Controller('employee-document')
export class EmployeeDocumentController {
    constructor(private readonly employeeDocumentService: EmployeeDocumentService) { }

    @Post(':id/link-document-type')
    async linkDocumentType(@Param('id') id: string, @Body() dto: LinkDocumentTypeDto) {
        return this.employeeDocumentService.linkDocumentType(id, dto);
    }

    @Delete(':employeeId/unlink-document-type/:documentTypeId')
    async unlinkDocumentType(
        @Param('employeeId') employeeId: string,
        @Param('documentTypeId') documentTypeId: string,
    ) {
        return this.employeeDocumentService.unlinkDocumentType(employeeId, documentTypeId);
    }

    @Get(':id/get-employee-documents')
    async findAll(
        @Param('id') id: string,
    ) {
        return this.employeeDocumentService.findEmployeeDocuments(id);
    }

    @Get('pending')
    async findPending(@Query() query: FindPendingDocumentsDto) {
        return this.employeeDocumentService.findPending(query);
    }
}
