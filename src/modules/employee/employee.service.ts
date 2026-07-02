import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/database/prisma/prisma.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";

@Injectable()
export class EmployeeService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: CreateEmployeeDto) {
        return this.prismaService.employee.create({ data });
    }

    async findAll() {
        return this.prismaService.employee.findMany();
    }

    async findById(id: string) {
        return this.prismaService.employee.findFirst({ where: { id, deletedAt: null } });
    }

    async update(id: string, data: CreateEmployeeDto) {
        return this.prismaService.employee.update({ where: { id }, data });
    }

    async delete(id: string) {
        return this.prismaService.employee.delete({ where: { id } });
    }
}    