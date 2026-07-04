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

        const employeeDocument = await tx.employeeDocument.findFirst({
            where: {
                id: dto.employeeDocumentId,
                deletedAt: null,
            },
            include: {
                    document: true,
            },
        });

        if(!employeeDocument){
            throw new NotFoundException("Employee Document not found");
        }

        let document = employeeDocument.document;

        if(!document) {
            document = await tx.document.create({
                data: {
                    employeeDocumentId: employeeDocument.id,
                },
            })
        }

        const lastVersion = await tx.documentVersion.findFirst({
            where: {
                documentId: document.id
            },
            orderBy: {
                version: 'desc',
                },
            })

        const nextVersion = lastVersion ? lastVersion.version + 1 : 1;
        
        await tx.documentVersion.updateMany({
            where:{
                documentId: document.id,
                status: 'ACTIVE',
                
            },
            data:{
                status: 'INACTIVE',
            },
        });

        const version = await tx.documentVersion.create({
            data:{
               documentId: document.id,
                version: nextVersion,
                storageKey: dto.storageKey,
                status: 'ACTIVE',   
            },
        });

        await tx.employeeDocument.update({
            where:{
                id: employeeDocument.id,
            },
            data:{
                status: 'COMPLETED',
            },
        });

        return {
            message: 'Document sent successfully.',
            version,
        };
        
      });
    }
}
