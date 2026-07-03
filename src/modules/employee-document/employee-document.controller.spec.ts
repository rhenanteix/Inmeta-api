import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDocumentController } from './employee-document.controller';

describe('EmployeeDocumentController', () => {
  let controller: EmployeeDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeDocumentController],
    }).compile();

    controller = module.get<EmployeeDocumentController>(EmployeeDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
