import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../../common/database/prisma/prisma.service';

describe('EmployeeService', () => {
  let service: EmployeeService;

  const prismaMock = {
    employee: {
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
        EmployeeService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an employee', async () => {
      const dto = {
        name: 'Rhenan',
        email: 'rhenan@email.com',
      };

      const employee = {
        id: 'uuid-123',
        ...dto,
      };

      prismaMock.employee.create.mockResolvedValue(employee);

      const result = await service.create(dto);

      expect(result).toEqual(employee);

      expect(prismaMock.employee.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all employees', async () => {
      const employees = [
        {
          id: '1',
          name: 'Rhenan',
          email: 'a@a.com',
        },
        {
          id: '2',
          name: 'João',
          email: 'b@b.com',
        },
      ];

      prismaMock.employee.findMany.mockResolvedValue(employees);

      const result = await service.findAll();

      expect(result).toEqual(employees);

      expect(prismaMock.employee.findMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return employee by id', async () => {
      const employee = {
        id: 'uuid',
        name: 'Rhenan',
        email: 'teste@email.com',
      };

      prismaMock.employee.findFirst.mockResolvedValue(employee);

      const result = await service.findById('uuid');

      expect(result).toEqual(employee);

      expect(prismaMock.employee.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'uuid',
          deletedAt: null,
        },
      });
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const dto = {
        name: 'Novo Nome',
        email: 'novo@email.com',
      };

      const updated = {
        id: 'uuid',
        ...dto,
      };

      prismaMock.employee.update.mockResolvedValue(updated);

      const result = await service.update('uuid', dto);

      expect(result).toEqual(updated);

      expect(prismaMock.employee.update).toHaveBeenCalledWith({
        where: {
          id: 'uuid',
        },
        data: dto,
      });
    });
  });

  describe('delete', () => {
    it('should delete an employee', async () => {
      prismaMock.employee.delete.mockResolvedValue({
        id: 'uuid',
      });

      const result = await service.delete('uuid');

      expect(result).toEqual({
        id: 'uuid',
      });

      expect(prismaMock.employee.delete).toHaveBeenCalledWith({
        where: {
          id: 'uuid',
        },
      });
    });
  });
});