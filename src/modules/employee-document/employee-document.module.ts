import { Module } from '@nestjs/common';
import { EmployeeDocumentService } from './employee-document.service';
import { EmployeeDocumentController } from './employee-document.controller';

@Module({
  providers: [EmployeeDocumentService],
  controllers: [EmployeeDocumentController]
})
export class EmployeeDocumentModule {}
