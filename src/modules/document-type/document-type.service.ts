import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/database/prisma/prisma.service";
import { CreateDocumentTypeDto } from "./dto/create-document-type.dto";

@Injectable()
export class DocumentTypeService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: CreateDocumentTypeDto) {
        return this.prismaService.documentType.create({ data });
    }

    async findAll() {
        return this.prismaService.documentType.findMany();
    }

    async findById(id: string) {
        return this.prismaService.documentType.findFirst({ where: { id, deletedAt: null } });
    }

    async update(id: string, data: CreateDocumentTypeDto) {
        return this.prismaService.documentType.update({ where: { id }, data });
    }

    async delete(id: string) {
        return this.prismaService.documentType.delete({ where: { id } });
    }
}    