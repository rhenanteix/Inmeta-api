import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { EmployeeDocumentService } from './employee-document.service';
import { PrismaService } from '../../common/database/prisma/prisma.service';

describe('EmployeeDocumentService', () => {
  let service: EmployeeDocumentService;

  const tx = {
    employee: {
      findFirst: jest.fn(),
    },
    documentType: {
      findFirst: jest.fn(),
    },
    employeeDocument: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  const prismaMock = {
    $transaction: jest.fn(),
    employeeDocument: {
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    prismaMock.$transaction.mockImplementation(
      async (callback: any) => callback(tx),
    );

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          EmployeeDocumentService,
          {
            provide: PrismaService,
            useValue: prismaMock,
          },
        ],
      }).compile();

    service = module.get(EmployeeDocumentService);
  });

  describe('linkDocumentType', () => {
    it('should link employee with document type', async () => {
      tx.employee.findFirst.mockResolvedValue({
        id: 'employee-id',
      });

      tx.documentType.findFirst.mockResolvedValue({
        id: 'document-type-id',
      });

      tx.employeeDocument.findFirst.mockResolvedValue(null);

      tx.employeeDocument.create.mockResolvedValue({
        id: 'employee-document-id',
      });

      const dto = {
        documentTypeId: 'document-type-id',
      };

      const result = await service.linkDocumentType(
        'employee-id',
        dto,
      );

      expect(result).toEqual({
        id: 'employee-document-id',
      });

      expect(tx.employeeDocument.create).toHaveBeenCalledWith({
        data: {
          employeeId: 'employee-id',
          documentTypeId: 'document-type-id',
        },
      });
    });

    it('should throw BadRequestException when employee does not exist', async () => {
      tx.employee.findFirst.mockResolvedValue(null);

      await expect(
        service.linkDocumentType('employee-id', {
          documentTypeId: 'doc-id',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when document type does not exist', async () => {
      tx.employee.findFirst.mockResolvedValue({
        id: 'employee-id',
      });

      tx.documentType.findFirst.mockResolvedValue(null);

      await expect(
        service.linkDocumentType('employee-id', {
          documentTypeId: 'doc-id',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when employee document already exists', async () => {
      tx.employee.findFirst.mockResolvedValue({
        id: 'employee-id',
      });

      tx.documentType.findFirst.mockResolvedValue({
        id: 'doc-id',
      });

      tx.employeeDocument.findFirst.mockResolvedValue({
        id: 'employee-document',
      });

      await expect(
        service.linkDocumentType('employee-id', {
          documentTypeId: 'doc-id',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('unlinkDocumentType', () => {
    it('should soft delete employee document', async () => {
      prismaMock.employeeDocument.findFirst.mockResolvedValue({
        id: 'employee-document-id',
      });

      prismaMock.employeeDocument.update.mockResolvedValue({
        id: 'employee-document-id',
        deletedAt: new Date(),
      });

      const result = await service.unlinkDocumentType(
        'employee-id',
        'document-id',
      );

      expect(result.id).toEqual(
        'employee-document-id',
      );

      expect(
        prismaMock.employeeDocument.update,
      ).toHaveBeenCalled();
    });

    it('should throw BadRequestException when link does not exist', async () => {
      prismaMock.employeeDocument.findFirst.mockResolvedValue(
        null,
      );

      await expect(
        service.unlinkDocumentType(
          'employee-id',
          'document-id',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findEmployeeDocuments', () => {
    it('should return employee documents', async () => {
      const documents = [
        {
          id: '1',
        },
        {
          id: '2',
        },
      ];

      prismaMock.employeeDocument.findMany.mockResolvedValue(
        documents,
      );

      const result =
        await service.findEmployeeDocuments(
          'employee-id',
        );

      expect(result).toEqual(documents);

      expect(
        prismaMock.employeeDocument.findMany,
      ).toHaveBeenCalledWith({
        where: {
          employeeId: 'employee-id',
          deletedAt: null,
        },
        include: {
          documentType: true,
        },
      });
    });
  });

  describe('findPending', () => {
    it('should return pending documents with pagination', async () => {
      prismaMock.employeeDocument.findMany.mockResolvedValue([
        {
          id: '1',
        },
      ]);

      prismaMock.employeeDocument.count.mockResolvedValue(
        1,
      );

      const result =
        await service.findPending({
          page: 1,
          limit: 10,
        });

      expect(result.data.length).toBe(1);

      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });

    it('should filter by employeeId', async () => {
      prismaMock.employeeDocument.findMany.mockResolvedValue(
        [],
      );

      prismaMock.employeeDocument.count.mockResolvedValue(
        0,
      );

      await service.findPending({
        employeeId: 'employee-id',
        page: 0,
        limit: 0
      });

      expect(
        prismaMock.employeeDocument.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            employeeId: 'employee-id',
          }),
        }),
      );
    });

    it('should filter by documentTypeId', async () => {
      prismaMock.employeeDocument.findMany.mockResolvedValue(
        [],
      );

      prismaMock.employeeDocument.count.mockResolvedValue(
        0,
      );

      await service.findPending({
        documentTypeId: 'document-type-id',
        page: 0,
        limit: 0
      });

      expect(
        prismaMock.employeeDocument.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            documentTypeId:
              'document-type-id',
          }),
        }),
      );
    });
  });
});