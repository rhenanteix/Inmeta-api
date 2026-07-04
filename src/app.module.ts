import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/database/prisma/prisma.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { EmployeeDocumentModule } from './modules/employee-document/employee-document.module';
import { DocumentModule } from './modules/document/document.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [PrismaModule, EmployeeModule, DocumentTypeModule, EmployeeDocumentModule, DocumentModule, DashboardModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
