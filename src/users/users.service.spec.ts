import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    it('should create a user successfully', async () => {
      const user = {
        id: 1,
        name: dto.name,
        email: dto.email,
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      repository.create.mockReturnValue(user);
      repository.save.mockResolvedValue(user);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(user);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: user,
      });
    });

    it('should return a successful response with id 0 when duplicate email error occurs', async () => {
      const user = {
        id: 1,
        name: dto.name,
        email: dto.email,
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const driverError = Object.assign(
        new Error('duplicate key value violates unique constraint'),
        { code: '23505' },
      );
      const duplicateError = Object.assign(
        new QueryFailedError('INSERT INTO user', [], driverError),
        { code: '23505' },
      );

      repository.create.mockReturnValue(user);
      repository.save.mockRejectedValue(duplicateError);

      const result = await service.create(dto);

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('User created successfully');
      expect(result.data?.id).toBe(0);
      expect(result.data?.email).toBe(dto.email);
    });

    it('should throw HTTP 500 when an unexpected database error occurs', async () => {
      const user = {
        id: 1,
        name: dto.name,
        email: dto.email,
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const databaseError = new Error('Database connection failed');

      repository.create.mockReturnValue(user);
      repository.save.mockRejectedValue(databaseError);

      await expect(service.create(dto)).rejects.toThrow(HttpException);

      try {
        await service.create(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);

        const exception = error as HttpException;

        expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

        expect(exception.getResponse()).toEqual({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error creating user',
          error: 'Database connection failed',
        });
      }
    });
  });

  describe('findAll', () => {
    it('should return all users with their transactions', async () => {
      const users = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          transactions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as User[];

      repository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['transactions'],
      });

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
      });
    });

    it('should throw HTTP 500 when retrieving users fails', async () => {
      const databaseError = new Error('Database connection failed');

      repository.find.mockRejectedValue(databaseError);

      await expect(service.findAll()).rejects.toThrow(HttpException);

      try {
        await service.findAll();
      } catch (error) {
        const exception = error as HttpException;

        expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

        expect(exception.getResponse()).toEqual({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error retrieving users',
          error: 'Database connection failed',
        });
      }
    });
  });

  describe('findOne', () => {
    it('should return a user when the user exists', async () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      repository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['transactions'],
      });

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: user,
      });
    });

    it('should throw NotFoundException when the user does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999999)).rejects.toThrow(
        new NotFoundException('User with ID 999999 not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999999 },
        relations: ['transactions'],
      });
    });

    it('should throw HTTP 500 when retrieving a user fails unexpectedly', async () => {
      const databaseError = new Error('Database error');

      repository.findOne.mockRejectedValue(databaseError);

      await expect(service.findOne(1)).rejects.toThrow(HttpException);

      try {
        await service.findOne(1);
      } catch (error) {
        const exception = error as HttpException;

        expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

        expect(exception.getResponse()).toEqual({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error retrieving user',
          error: 'Database error',
        });
      }
    });
  });

  describe('update', () => {
    const dto: CreateUserDto = {
      name: 'John Updated',
      email: 'johnupdated@example.com',
    };

    it('should update an existing user successfully', async () => {
      const user = {
        id: 1,
        name: dto.name,
        email: dto.email,
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      repository.preload.mockResolvedValue(user);
      repository.save.mockResolvedValue(user);

      const result = await service.update(1, dto);

      expect(repository.preload).toHaveBeenCalledWith({
        id: 1,
        ...dto,
      });

      expect(repository.save).toHaveBeenCalledWith(user);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: user,
      });
    });

    it('should throw NotFoundException when updating a nonexistent user', async () => {
      repository.preload.mockResolvedValue(null as unknown as User);

      await expect(service.update(99999, dto)).rejects.toThrow(
        new NotFoundException('User with ID 99999 not found'),
      );

      expect(repository.preload).toHaveBeenCalledWith({
        id: 99999,
        ...dto,
      });

      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating with an existing email', async () => {
      const user = {
        id: 1,
        name: dto.name,
        email: dto.email,
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const driverError = Object.assign(
        new Error('duplicate key value violates unique constraint'),
        { code: '23505' },
      );
      const duplicateError = Object.assign(
        new QueryFailedError('UPDATE user', [], driverError),
        { code: '23505' },
      );

      repository.preload.mockResolvedValue(user);
      repository.save.mockRejectedValue(duplicateError);

      await expect(service.update(1, dto)).rejects.toThrow(
        new ConflictException('Email already exists'),
      );
    });

    it('should throw HTTP 500 when an unexpected update error occurs', async () => {
      const databaseError = new Error('Database update failed');

      repository.preload.mockResolvedValue({} as User);
      repository.save.mockRejectedValue(databaseError);

      await expect(service.update(1, dto)).rejects.toThrow(HttpException);

      try {
        await service.update(1, dto);
      } catch (error) {
        const exception = error as HttpException;

        expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

        expect(exception.getResponse()).toEqual({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error updating user',
          error: 'Database update failed',
        });
      }
    });
  });
});
