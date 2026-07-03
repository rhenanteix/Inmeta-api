import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { DocumentTypeService } from "./document-type.service";
import { CreateDocumentTypeDto } from "./dto/create-document-type.dto";

@Controller("document-types")
export class DocumentTypeController {
    constructor(private readonly documentTypeService: DocumentTypeService) { }

    @Post()
    async create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
        return this.documentTypeService.create(createDocumentTypeDto);
    }

    @Get()
    async findAll() {
        return this.documentTypeService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.documentTypeService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDocumentTypeDto: CreateDocumentTypeDto) {
        return this.documentTypeService.update(id, updateDocumentTypeDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.documentTypeService.delete(id);
    }
}    