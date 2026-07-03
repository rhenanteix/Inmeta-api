import { Controller, Body, Post  } from '@nestjs/common';
import { SendDocumentDto } from './dto/send-document.dto';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
    constructor(
        private readonly documentService: DocumentService,
    ) { }

    @Post('send')
    async sendDocument(@Body() dto: SendDocumentDto) {
        return this.documentService.sendDocument(dto);
    }
}
