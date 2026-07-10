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
    prismaMock.$transaction.mockImplementation(async (cb:any)=>cb(tx));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(DocumentService);
  });

  describe('sendDocument', () => {
    it('should throw when employee document is not found', async () => {
      tx.employeeDocument.findFirst.mockResolvedValue(null);

      await expect(
        service.sendDocument({
          employeeDocumentId: 'emp-doc',
          storageKey: 'file.pdf',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create first document/version', async () => {
      tx.employeeDocument.findFirst.mockResolvedValue({
        id: 'emp-doc',
        document: null,
      });

      tx.document.create.mockResolvedValue({
        id: 'doc-1',
      });

      tx.documentVersion.findFirst.mockResolvedValue(null);
      tx.documentVersion.updateMany.mockResolvedValue({ count: 0 });

      tx.documentVersion.create.mockResolvedValue({
        id: 'v1',
        version: 1,
        status: 'ACTIVE',
      });

      tx.employeeDocument.update.mockResolvedValue({
        id: 'emp-doc',
        status: 'COMPLETED',
      });

      const result = await service.sendDocument({
        employeeDocumentId: 'emp-doc',
        storageKey: 'cpf.pdf',
      });

      expect(tx.document.create).toHaveBeenCalledWith({
        data: {
          employeeDocumentId: 'emp-doc',
        },
      });

      expect(tx.documentVersion.create).toHaveBeenCalledWith({
        data: {
          documentId: 'doc-1',
          version: 1,
          storageKey: 'cpf.pdf',
          status: 'ACTIVE',
        },
      });

      expect(result.message).toBe('Document sent successfully.');
      expect(result.version.version).toBe(1);
    });

    it('should create next version when document exists', async () => {
      tx.employeeDocument.findFirst.mockResolvedValue({
        id: 'emp-doc',
        document: {
          id: 'doc-1',
        },
      });

      tx.documentVersion.findFirst.mockResolvedValue({
        version: 2,
      });

      tx.documentVersion.updateMany.mockResolvedValue({ count: 1 });

      tx.documentVersion.create.mockResolvedValue({
        id: 'v3',
        version: 3,
      });

      tx.employeeDocument.update.mockResolvedValue({
        id: 'emp-doc',
      });

      const result = await service.sendDocument({
        employeeDocumentId: 'emp-doc',
        storageKey: 'novo.pdf',
      });

      expect(tx.document.create).not.toHaveBeenCalled();

      expect(tx.documentVersion.updateMany).toHaveBeenCalledWith({
        where: {
          documentId: 'doc-1',
          status: 'ACTIVE',
        },
        data: {
          status: 'INACTIVE',
        },
      });

      expect(tx.documentVersion.create).toHaveBeenCalledWith({
        data: {
          documentId: 'doc-1',
          version: 3,
          storageKey: 'novo.pdf',
          status: 'ACTIVE',
        },
      });

      expect(tx.employeeDocument.update).toHaveBeenCalledWith({
        where: { id: 'emp-doc' },
        data: { status: 'COMPLETED' },
      });

      expect(result.version.version).toBe(3);
    });
  });
});
