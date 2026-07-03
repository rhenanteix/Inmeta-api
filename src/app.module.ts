import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/database/prisma/prisma.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { DocumentTypeModule } from './modules/document-type/document-type.module';

@Module({
  imports: [PrismaModule, EmployeeModule, DocumentTypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
