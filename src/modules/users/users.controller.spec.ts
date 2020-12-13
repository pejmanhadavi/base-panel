import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FilterQueryDto } from 'src/common/dto/filterQuery.dto';
import { ObjectIdDto } from 'src/common/dto/objectId.dto';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/updateUserDto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const objectId: ObjectIdDto = { id: '1234567890' };
const invalidId: ObjectIdDto = { id: '0' };

interface userModel {
  id: ObjectIdDto;
  email: string;
  phoneNumber: string;
  password: string;
  roles: [string];
}

const user: userModel = {
  id: objectId,
  email: 'email',
  phoneNumber: '0912',
  password: 'password',
  roles: ['roles'],
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAllUsers: jest.fn().mockResolvedValueOnce('users'),
            getUserById: jest.fn().mockImplementation(async (id: ObjectIdDto) => {
              if (id !== user.id)
                throw new NotFoundException('not found user by the given id');
              return 'user';
            }),
            createUser: jest
              .fn()
              .mockImplementation(async (createUserDto: CreateUserDto) => {
                const { email, phoneNumber } = createUserDto;
                if (email === user.email || phoneNumber === user.phoneNumber)
                  throw new BadRequestException('username has already exists');

                return 'created';
              }),
            updateUser: jest
              .fn()
              .mockImplementation(
                async (id: ObjectIdDto, updateUserDto: UpdateUserDto) => {
                  if (updateUserDto.email === user.email)
                    throw new BadRequestException('username has already exists');

                  return 'updated';
                },
              ),
            deleteUser: jest.fn().mockImplementation(async (id: ObjectIdDto) => {
              if (id !== user.id)
                throw new NotFoundException('not found user by the given id');

              return 'deleted';
            }),
          },
        },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const filterQuery: FilterQueryDto = {};
      const result = await controller.getAllUsers(filterQuery);
      expect(service.getAllUsers).toHaveBeenCalledTimes(1);
      expect(result).toBe('users');
    });
  });

  describe('getUserById', () => {
    it('should throw an exception if user not found', async () => {
      await expect(controller.getUserById(invalidId)).rejects.toThrow(
        'not found user by the given id',
      );
    });

    it('should return a user with passed id', async () => {
      const id = '1';
      const result = await controller.getUserById(user.id);
      expect(service.getUserById).toHaveBeenCalledTimes(1);
      expect(result).toEqual('user');
    });
  });

  describe('createUser', () => {
    it('should throw an exception if user already exists', async () => {
      const newUser: CreateUserDto = {
        email: user.email,
        password: 'password',
        roles: ['roles'],
      };
      await expect(controller.createUser(newUser)).rejects.toThrow(
        'username has already exists',
      );
    });

    it('should register the user and return it', async () => {
      const newUser: CreateUserDto = {
        email: 'newEmail',
        password: 'password',
        roles: ['roles'],
      };
      const result = await controller.createUser(newUser);
      expect(service.createUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual('created');
    });
  });

  describe('updateUser', () => {
    it('should throw BadRequest exception if username has already exists ', async () => {
      const updatedInfo: UpdateUserDto = { email: user.email };

      await expect(controller.updateUser(user.id, updatedInfo)).rejects.toThrow(
        'username has already exists',
      );
    });

    it('should update the username and return the user ', async () => {
      const updatedInfo: UpdateUserDto = { email: 'invalid' };

      const result = await controller.updateUser(user.id, updatedInfo);
      expect(service.updateUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual('updated');
    });
  });

  describe('deleteUser', () => {
    it('should throw NotFound exception if user not found', async () => {
      await expect(controller.deleteUser(invalidId)).rejects.toThrow(
        'not found user by the given id',
      );
    });

    it('should delete the user', async () => {
      const result = await controller.deleteUser(user.id);
      expect(service.deleteUser).toHaveBeenCalledTimes(1);
      expect(service.deleteUser).toHaveBeenCalledWith(user.id);
      expect(result).toEqual('deleted');
    });
  });
});
