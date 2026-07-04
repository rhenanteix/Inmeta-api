import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { DocumentService } from './document.service';
import { PrismaService } from '../../common/database/prisma/prisma.service';

describe('DocumentService', () => {
  let service: DocumentService;

  const tx = {
    employeeDocument: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },

    document: {
      create: jest.fn(),
    },

    documentVersion: {
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
    },
  };

  const prismaMock = {
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    prismaMock.$transaction.mockImplementation(
      async (callback: any) => callback(tx),
    );

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          DocumentService,
          {
            provide: PrismaService,
            useValue: prismaMock,
          },
        ],
      }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  describe('sendDocument', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should throw NotFoundException when employee document does not exist', async () => {
      tx.employeeDocument.findFirst.mockResolvedValue(null);

      await expect(
        service.sendDocument({
          employeeDocumentId: 'uuid',
          storageKey: 'cpf.pdf',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(
        tx.employeeDocument.findFirst,
      ).toHaveBeenCalled();
    });

    it('should create first document version', async () => {
      tx.employeeDocument.findFirst.mockResolvedValue({
        id: 'employee-document-id',
        document: null,
      });

      tx.document.create.mockResolvedValue({
        id: 'document-id',
      });

      tx.documentVersion.findFirst.mockResolvedValue(null);

      tx.documentVersion.updateMany.mockResolvedValue({
        count: 0,
      });

      tx.documentVersion.create.mockResolvedValue({
        id: 'version-id',
        version: 1,
        status: 'ACTIVE',
      });

      tx.employeeDocument.update.mockResolvedValue({
        id: 'employee-document-id',
        status: 'COMPLETED',
      });

      const result = await service.sendDocument({
        employeeDocumentId: 'employee-document-id',
        storageKey: 'cpf.pdf',
      });

      expect(result.message).toEqual(
        'Document sent successfully.',
      );

      expect(result.version.version).toBe(1);

      expect(tx.document.create).toHaveBeenCalledWith({
        data: {
          employeeDocumentId: 'employee-document-id',
        },
      });

      expect(
        tx.documentVersion.create,
      ).toHaveBeenCalledWith({
        data: {
          documentId: 'document-id',
          version: 1,
          storageKey: 'cpf.pdf',
          status: 'ACTIVE',
        },
      });
    });
  });
});