import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma/prisma.service';
import { LinkDocumentTypeDto } from './dto/link-document-type.dto';
import { FindPendingDocumentsDto } from './dto/find-pending-documents.dto';

@Injectable()
export class EmployeeDocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async linkDocumentType(
    employeeId: string,
    dto: LinkDocumentTypeDto,
  ) {
   return this.prisma.$transaction(async (tx) => {
    const employee = await tx.employee.findFirst({
      where: { id: employeeId },
    });
    
    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    const documentType = await tx.documentType.findFirst({
      where: { id: dto.documentTypeId },
    });
    
    if (!documentType) {
      throw new BadRequestException('Document type not found');
    }

 const existingEmployeeDocument = await tx.employeeDocument.findFirst({
  where:{
    employeeId: employeeId,
    documentTypeId: dto.documentTypeId,
    deletedAt: null
  }
    })

 if (existingEmployeeDocument) {
  throw new ConflictException('Employee document already exists');
 }
 return tx.employeeDocument.create({
  data: {
    employeeId,
    documentTypeId: dto.documentTypeId,
  },
});

});
}

async unlinkDocumentType(
    employeeId: string,
    documentTypeId: string,
) {
    const employeeDocument = await this.prisma.employeeDocument.findFirst({
        where: {
            employeeId,
            documentTypeId,
            deletedAt: null,
        },
    });

    if (!employeeDocument) {
        throw new BadRequestException('Employee document link not found');
    }

    return this.prisma.employeeDocument.update({
        where: {
            id: employeeDocument.id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

async findEmployeeDocuments(
    employeeId: string
) {
    return this.prisma.employeeDocument.findMany({
      where: {
        employeeId: employeeId,
        deletedAt: null,
      },
      include: {
        documentType: true,
      },
    });
}

async findPending(query: FindPendingDocumentsDto): Promise<{
  data: any[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {
    status: 'PENDING',
    deletedAt: null,
  };

  if (query.employeeId) {
    where.employeeId = query.employeeId;
  }

  if (query.documentTypeId) {
    where.documentTypeId = query.documentTypeId;
  }

  const data = await this.prisma.employeeDocument.findMany({
    where,
    skip,
    take: limit,
    include: {
      employee: true,
      documentType: true,
    },
  });

  const total = await this.prisma.employeeDocument.count({
    where,
  });

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}


}