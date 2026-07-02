import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";

@Controller("employees")
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Post()
    async create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeeService.create(createEmployeeDto);
    }

    @Get()
    async findAll() {
        return this.employeeService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.employeeService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateEmployeeDto: CreateEmployeeDto) {
        return this.employeeService.update(id, updateEmployeeDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.employeeService.delete(id);
    }
}
    