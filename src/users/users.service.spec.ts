import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { FilterQueryDto } from '../common/dto/filterQuery.dto';
import { ObjectIdDto } from '../common/dto/objectId.dto';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/updateUserDto';
import { User, UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';

const id: ObjectIdDto = { id: '5fd4072f5417273f0c64f370' };
const mockUser = {
  email: 'user@gmail.com',
  phoneNumber: '0912',
  password: 'password',
  roles: ['roles'],
};

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn().mockImplementation(() => {
              return {
                populate: jest.fn().mockResolvedValue('users'),
                skip: jest.fn().mockImplementation(() => {
                  return {
                    limit: jest.fn().mockResolvedValue(' '),
                  };
                }),
              };
            }),
            findById: jest.fn().mockImplementation(() => {
              return {
                populate: jest.fn().mockResolvedValue('user'),
              };
            }),
            create: jest.fn().mockResolvedValue('newUser'),
            findByIdAndUpdate: jest.fn().mockResolvedValue('updatedUser'),
            deleteOne: jest.fn().mockResolvedValue(''),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
  });

  describe('getAllUsers', () => {
    it('should return all users ', async () => {
      const filterQueryDto: FilterQueryDto = {};
      const result = await usersService.getAllUsers(filterQueryDto);

      expect(userModel.find).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({ data: 'users', result: 5, status: 'success' });
    });
  });

  describe('getUserById', () => {
    it('should throw NotFound exception if user not found', async () => {
      userModel.findById = jest.fn().mockImplementation(() => {
        return {
          populate: jest.fn().mockResolvedValue(false),
        };
      });
      expect(usersService.getUserById(id)).rejects.toThrow(NotFoundException);
    });

    it('should call userModel.findById() method and return the user', async () => {
      const result = await usersService.getUserById(id);

      expect(userModel.findById).toHaveBeenCalledTimes(1);
      expect(userModel.findById).toHaveBeenCalledWith(id.id);
      expect(result).toEqual('user');
    });
  });

  // describe('createUser', () => {
  //   it('should throw InternalServer exception', async () => {
  //     const createUserDto: CreateUserDto = {
  //       email: 'email',
  //       password: 'password',
  //       roles: ['role'],
  //     };
  //     userModel.create.mockRejectedValue('error');
  //     expect(usersService.createUser(createUserDto)).rejects.toThrow(
  //       InternalServerErrorException,
  //     );
  //   });

  //   it('should throw BadRequest if username has already exists', async () => {
  //     const createUserDto: CreateUserDto = {
  //       email: 'email',
  //       password: 'password',
  //       roles: ['role'],
  //     };
  //     const error = {
  //       code: 11000,
  //     };
  //     userModel.create.mockRejectedValue(error);
  //     expect(usersService.createUser(createUserDto)).rejects.toThrow(BadRequestException);
  //   });

  //   it('should call userModel.create() method and return the newUser', async () => {
  //     expect(userModel.create).not.toHaveBeenCalled();
  //     const result = await usersService.createUser(createUserDto);

  //     expect(userModel.create).toHaveBeenCalledTimes(1);
  //     expect(userModel.create).toHaveBeenCalledWith(createUserDto);
  //     expect(result).toEqual('newUser');
  //   });
  // });

  describe('updateUser', () => {
    it('should throw BadRequest exception if user has already exists', () => {
      const error = { code: 11000 };
      const updateUserDto: UpdateUserDto = { email: mockUser.email };
      userModel.findByIdAndUpdate = jest.fn().mockRejectedValue(error);
      expect(usersService.updateUser(id, updateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequest exception if roles is not valid', () => {
      const error = { message: 'Cast to ObjectId failed for value' };
      const updateUserDto: UpdateUserDto = { email: mockUser.email };
      userModel.findByIdAndUpdate = jest.fn().mockRejectedValue(error);
      expect(usersService.updateUser(id, updateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call userModel.findByIdAndUpdate() method and return updated user', async () => {
      const updateUserDto: UpdateUserDto = { email: 'email' };
      const result = await usersService.updateUser(id, updateUserDto);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(result).toEqual('updatedUser');
    });
  });

  // describe('deleteUser', () => {
  //   it('should call userModel.deleteOne() method and delete the user', async () => {
  //     const result = await usersService.deleteUser(id);
  //     expect(userModel.deleteOne).toHaveBeenCalledTimes(1);
  //     expect(userModel.deleteOne).toHaveBeenCalledWith(id);
  //     expect(result).toBeUndefined();
  //   });
  // });
});
