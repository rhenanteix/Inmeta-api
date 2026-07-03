import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { SendDocumentDto } from './dto/send-document.dto';

@Injectable()
export class DocumentService {
    constructor(
        private readonly prisma: PrismaService
    ) {
        
    }

    async sendDocument(dto: SendDocumentDto) {
      return this.prisma.$transaction(async (tx) => {

       const employeeDocument =
        await tx.employeeDocument.findFirst({
            where: {
                id: dto.employeeDocumentId,
                deletedAt: null,
            },
            include: {
                document: {
                    include: {
                        versions: true,
                    },
                 },
            },
        });

        if(!employeeDocument){
            throw new NotFoundException("Employee Document not found");
        }

        

      });
    }
}
