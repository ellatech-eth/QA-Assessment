import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import {
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

function postgresUniqueViolationError(): QueryFailedError {
  const driverError = Object.assign(new Error('duplicate key value'), {
    code: '23505',
  });
  return new QueryFailedError('', [], driverError);
}

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<
    Pick<Repository<User>, 'create' | 'save' | 'findOne' | 'preload'>
  >;

  const mockUser: User = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    transactions: [],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  };

  beforeEach(async () => {
    userRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      preload: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto: CreateUserDto = {
      name: 'Jane Doe',
      email: 'jane@example.com',
    };

    it('successfully creates a user', async () => {
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(dto);

      expect(userRepository.create).toHaveBeenCalledWith(dto);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: mockUser,
      });
    });

    it('throws ConflictException when duplicate email causes PostgreSQL error code 23505', async () => {
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockRejectedValue(postgresUniqueViolationError());

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      await expect(service.create(dto)).rejects.toThrow(
        'Email already exists',
      );
    });
  });

  describe('findOne', () => {
    it('successfully returns an existing user', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['transactions'],
      });
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: mockUser,
      });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'User with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    const dto: CreateUserDto = {
      name: 'Jane Updated',
      email: 'jane.updated@example.com',
    };

    const updatedUser: User = {
      ...mockUser,
      name: dto.name,
      email: dto.email,
      updatedAt: new Date('2024-03-01T00:00:00.000Z'),
    };

    it('successfully updates a user', async () => {
      userRepository.preload.mockResolvedValue(updatedUser);
      userRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, dto);

      expect(userRepository.preload).toHaveBeenCalledWith({ id: 1, ...dto });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: updatedUser,
      });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userRepository.preload.mockResolvedValue(undefined);

      await expect(service.update(999, dto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(999, dto)).rejects.toThrow(
        'User with ID 999 not found',
      );
    });
  });
});
