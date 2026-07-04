import { Test, TestingModule } from '@nestjs/testing';
import { DocumentTypeService } from './document-type.service';
import { PrismaService } from '../../common/database/prisma/prisma.service';

describe('DocumentTypeService', () => {
  let service: DocumentTypeService;

  const prismaMock = {
    documentType: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTypeService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<DocumentTypeService>(DocumentTypeService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a document type', async () => {
      const dto = {
        name: 'CPF',
        description: 'Cadastro de Pessoa Física',
      };

      const documentType = {
        id: 'uuid-123',
        ...dto,
      };

      prismaMock.documentType.create.mockResolvedValue(documentType);

      const result = await service.create(dto);

      expect(result).toEqual(documentType);

      expect(prismaMock.documentType.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all document types', async () => {
      const documentTypes = [
        {
          id: '1',
          name: 'CPF',
          description: 'Cadastro de Pessoa Física',
        },
        {
          id: '2',
          name: 'RG',
          description: 'Registro Geral',
        },
      ];

      prismaMock.documentType.findMany.mockResolvedValue(documentTypes);

      const result = await service.findAll();

      expect(result).toEqual(documentTypes);

      expect(prismaMock.documentType.findMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a document type by id', async () => {
      const documentType = {
        id: 'uuid',
        name: 'CPF',
        description: 'Cadastro de Pessoa Física',
      };

      prismaMock.documentType.findFirst.mockResolvedValue(documentType);

      const result = await service.findById('uuid');

      expect(result).toEqual(documentType);

      expect(prismaMock.documentType.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'uuid',
          deletedAt: null,
        },
      });
    });

    it('should return null when document type does not exist', async () => {
      prismaMock.documentType.findFirst.mockResolvedValue(null);

      const result = await service.findById('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a document type', async () => {
      const dto = {
        name: 'CPF Atualizado',
        description: 'Descrição Atualizada',
      };

      const updated = {
        id: 'uuid',
        ...dto,
      };

      prismaMock.documentType.update.mockResolvedValue(updated);

      const result = await service.update('uuid', dto);

      expect(result).toEqual(updated);

      expect(prismaMock.documentType.update).toHaveBeenCalledWith({
        where: {
          id: 'uuid',
        },
        data: dto,
      });
    });
  });

  describe('delete', () => {
    it('should delete a document type', async () => {
      prismaMock.documentType.delete.mockResolvedValue({
        id: 'uuid',
      });

      const result = await service.delete('uuid');

      expect(result).toEqual({
        id: 'uuid',
      });

      expect(prismaMock.documentType.delete).toHaveBeenCalledWith({
        where: {
          id: 'uuid',
        },
      });
    });
  });
});