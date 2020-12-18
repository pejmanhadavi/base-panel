import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { AuthSignUpDto } from './dto/auth-signUp.dto';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { VerifyUuidDto } from './dto/verifyUuid.dto';
import { ForgotPassword } from './schemas/forgotPassword.schema';
import { RefreshToken } from './schemas/refreshToken.schema';
import { Role } from './schemas/role.schema';
import { Request } from 'express';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';
import { AuthHistory } from './schemas/authHistory.schema';
import { addHours } from 'date-fns';
import { ObjectIdDto } from 'src/common/dto/objectId.dto';
import { VerifyPhoneNumberDto } from './dto/verifyPhoneNumber.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';

const id: ObjectIdDto = { id: '5fd4072f5417273f0c64f370' };

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userModel, roleModel, refreshTokenModel, forgotPasswordModel, authHistoryModel;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockResolvedValue('newUser'),
            findById: jest.fn().mockResolvedValue('user'),
            findOne: jest.fn().mockImplementation(() => {
              return {
                select: jest.fn().mockResolvedValue({
                  validatePassword: async () => true,
                  save: async () => true,
                }),
                confirmationAttemptsCount: 1,
              };
            }),
            blockExpires: addHours(Date.now(), 1),
            save: jest.fn().mockResolvedValue('saved'),
          },
        },
        {
          provide: getModelToken(Role.name),
          useValue: {
            find: jest.fn().mockResolvedValue('roles'),
            findById: jest.fn().mockResolvedValue('role'),
            create: jest.fn().mockResolvedValue('created'),
            findByIdAndUpdate: jest.fn().mockResolvedValue('updated'),
            deleteOne: jest.fn().mockResolvedValue(''),
          },
        },
        {
          provide: getModelToken(ForgotPassword.name),
          useValue: {
            create: jest.fn().mockResolvedValue(true),
            findOne: jest.fn().mockImplementation(() => {
              return {
                used: true,
                save: jest.fn().mockResolvedValue(() => true),
              };
            }),
          },
        },
        {
          provide: getModelToken(RefreshToken.name),
          useValue: {
            findOne: jest.fn().mockImplementation(() => {
              return {
                save: jest.fn().mockResolvedValue('saved'),
              };
            }),
            create: jest.fn().mockResolvedValue('created'),
          },
        },
        {
          provide: getModelToken(AuthHistory.name),
          useValue: {
            create: jest.fn().mockResolvedValue('created'),
          },
        },

        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get(getModelToken(User.name));
    roleModel = module.get(getModelToken(Role.name));
    forgotPasswordModel = module.get(getModelToken(ForgotPassword.name));
    refreshTokenModel = module.get(getModelToken(RefreshToken.name));
    authHistoryModel = module.get(getModelToken(AuthHistory.name));
  });

  describe('signUp', () => {
    let authSignUpDto: AuthSignUpDto;

    beforeEach(() => {
      authSignUpDto = { password: 'password', email: 'email' };
    });

    it('should throw BadRequest exception if email and phone number is empty', async () => {
      const authSignUpDto: AuthSignUpDto = { password: 'password' };

      expect(authService.signUp({} as Request, authSignUpDto)).rejects.toThrow(
        'please enter phone number or email',
      );
    });

    it('should throw BadRequest exception if both email and phoneNumber are entered', async () => {
      expect(authService.signUp({} as Request, authSignUpDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should BadRequest exception if user has already exists', () => {
      expect(authService.signUp({} as Request, authSignUpDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should register new user and return verification code', async () => {
      // userModel = jest.fn().mockResolvedValue(undefined);
      // const result = await authService.signUp({} as Request, authSignUpDto);
      // expect(userModel.save).toHaveBeenCalled();
      // expect(userModel.save).toHaveBeenCalledTimes(1);
      // expect(result).toEqual('saved');
    });

    it('should call save() method of userModel call twice', async () => {
      // userModel = jest.fn().mockResolvedValue(undefined);
      // await authService.signUp({} as Request, authSignUpDto);
      // expect(userModel.save).toHaveBeenCalledTimes(2);
    });

    it('should call create() method of authHistoryModel and return verification code', async () => {
      // userModel = jest.fn().mockResolvedValue(undefined);
      // const result = await authService.signUp(
      //   { headers: { 'user-agent': 'mozilla' } } as Request,
      //   authSignUpDto,
      // );
      // expect(authHistoryModel.create).toHaveBeenCalledTimes(1);
      // expect(result).toHaveProperty('verificationCode');
    });
  });

  describe('signIn', () => {
    let authSignInDto: AuthSignInDto;

    beforeEach(() => {
      authSignInDto = { password: 'password', email: 'email' };
    });

    it('should throw BadRequest exception if email and phone number is empty', async () => {
      const authSignInDto: AuthSignInDto = { password: 'password' };

      expect(authService.signUp({} as Request, authSignInDto)).rejects.toThrow(
        'please enter phone number or email',
      );
    });

    it('should throw BadRequest exception if both email and phoneNumber are entered', async () => {
      const authSignInDto: AuthSignInDto = {
        password: 'password',
        email: 'email',
        phoneNumber: '0912',
      };
      expect(authService.signUp({} as Request, authSignInDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw Unauthorize exception if user not found', () => {
      userModel.findOne = jest.fn().mockImplementation(() => {
        return {
          select: jest.fn().mockRejectedValue(new UnauthorizedException()),
        };
      });

      expect(authService.signIn({} as Request, authSignInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    // it('should throw BadRequest exception if user is blocked', () => {

    //   expect(authService.signIn({} as Request, authSignInDto)).rejects.toThrow(
    //     BadRequestException,
    //   );
    // });

    it('should throw BadRequest exception if the confirmation attempt count is grater than 5', () => {
      userModel.findOne = jest.fn().mockImplementation(() => {
        return {
          select: jest.fn().mockResolvedValue({
            validatePassword: async () => false,
            save: async () => true,
            confirmationAttemptsCount: 10,
          }),
        };
      });

      expect(authService.signIn({} as Request, authSignInDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw Unauthorize exception if the password is invalid', () => {
      userModel.findOne = jest.fn().mockImplementation(() => {
        return {
          select: jest.fn().mockResolvedValue({
            validatePassword: async () => false,
            save: async () => true,
            confirmationAttemptsCount: 1,
          }),
        };
      });

      expect(authService.signIn({} as Request, authSignInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should create new authHistory and call the create method of authHistory model', async () => {
      const result = await authService.signIn(
        { headers: { 'user-agent': 'mozilla' } } as Request,
        authSignInDto,
      );

      expect(authHistoryModel.create).toHaveBeenCalledTimes(1);
    });

    it('should signIn the user and return access token', async () => {
      const result = await authService.signIn(
        { headers: { 'user-agent': 'mozilla' } } as Request,
        authSignInDto,
      );

      expect(userModel.findOne).toHaveBeenCalledTimes(1);
      expect(authHistoryModel.create).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles ', async () => {
      const result = await authService.getAllRoles();

      expect(roleModel.find).toHaveBeenCalledTimes(1);
      expect(roleModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual({ data: 'roles', result: 5, status: 'success' });
    });
  });

  describe('getRoleById', () => {
    it('should throw an exception if role not found by the id', () => {
      roleModel.findById = jest.fn().mockRejectedValue(new NotFoundException());
      expect(authService.getRoleById(id)).rejects.toThrow(NotFoundException);
    });

    it('should return the role by id', async () => {
      const result = await authService.getRoleById(id);

      expect(roleModel.findById).toHaveBeenCalledWith(id);
      expect(roleModel.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual('role');
    });
  });

  describe('createRole', () => {
    it('should throw an exception if role already exists', () => {
      const error = { code: 11000 };
      const createRoleDto: CreateRoleDto = {
        name: 'roleName',
        permissions: ['permissions'],
      };

      roleModel.create = jest.fn().mockRejectedValue(error);
      expect(authService.createRole(createRoleDto)).rejects.toThrow(
        'This role already exists',
      );
    });

    it('should throw an exception if permissions are invalid', () => {
      const error = { _message: 'Role validation failed' };
      const createRoleDto: CreateRoleDto = {
        name: 'roleName',
        permissions: ['permissions'],
      };

      roleModel.create = jest.fn().mockRejectedValue(error);
      expect(authService.createRole(createRoleDto)).rejects.toThrow(
        'the permissions entered are invalid',
      );
    });
    it('should create new role and return it', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'roleName',
        permissions: ['permissions'],
      };
      const result = await authService.createRole(createRoleDto);

      expect(roleModel.create).toHaveBeenCalledTimes(1);
      expect(roleModel.create).toHaveBeenCalledWith(createRoleDto);
      expect(result).toEqual('created');
    });
  });

  describe('updateRole', () => {
    it('should throw and exception if role id is invalid', () => {
      const updateRoleDto: UpdateRoleDto = { name: 'name' };
      roleModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new NotFoundException());

      expect(authService.updateRole(id, updateRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update the role and return it', async () => {
      const updateRoleDto: UpdateRoleDto = { name: 'name' };

      const result = await authService.updateRole(id, updateRoleDto);

      expect(roleModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(result).toEqual('updated');
    });
  });

  describe('deleteRole', () => {
    it('should throw and exception if role id is invalid', () => {
      authService.getRoleById = jest.fn().mockRejectedValue(new NotFoundException());

      expect(authService.deleteRole(id)).rejects.toThrow(NotFoundException);
    });

    // it('should delete the role ', async () => {
    //   const result = await authService.deleteRole(id);

    //   roleModel.deleteOne = jest.fn().mockResolvedValue(true);

    //   expect(roleModel.deleteOne).toHaveBeenCalled();
    //   expect(roleModel.deleteOne).toHaveBeenCalledTimes(1);
    //   expect(roleModel.deleteOne).toHaveBeenCalledWith(id);
    //   expect(result).toEqual('deleted successfully');
    // });
  });

  describe('verifyEmail', () => {
    it('should throw an exception if user with the given email not found', async () => {
      const verifyEmailDto: VerifyEmailDto = {
        email: 'email',
        token: 'token',
      };
      userModel.findOne = jest.fn().mockRejectedValue(new BadRequestException());
      expect(userModel.findOne).not.toHaveBeenCalled();

      expect(
        authService.verifyEmail({ res: {} } as Request, verifyEmailDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw and exception if token is invalid', async () => {
      const verifyEmailDto: VerifyEmailDto = {
        email: 'email',
        token: 'token',
      };

      userModel.findOne = jest.fn().mockImplementation(() => {
        return {
          verificationCode: false,
        };
      });

      expect(
        authService.verifyEmail({ res: {} } as Request, verifyEmailDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should verify the email and return access token and refresh token', async () => {
      const verifyEmailDto: VerifyEmailDto = {
        email: 'email',
        token: 'token',
      };
      userModel.findOne = jest.fn().mockImplementation(() => {
        return {
          save: async () => true,
          verificationCode: verifyEmailDto.token,
        };
      });
      const result = await authService.verifyEmail(
        { headers: { 'user-agent': 'mozilla' } } as Request,
        verifyEmailDto,
      );

      expect(userModel.findOne).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalled();
      expect(authHistoryModel.create).toHaveBeenCalled();
      expect(refreshTokenModel.create).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('verifyPhoneNumber', () => {
    it('should throw an exception if user with the given phoneNumber not found', async () => {
      const verifyPhoneNumber: VerifyPhoneNumberDto = {
        phoneNumber: '0912',
        token: 'token',
      };
      userModel.findOne = jest.fn().mockRejectedValue(new BadRequestException());
      expect(userModel.findOne).not.toHaveBeenCalled();

      expect(
        authService.verifyPhoneNumber({ res: {} } as Request, verifyPhoneNumber),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw and exception if token is invalid', async () => {
      const verifyPhoneNumber: VerifyPhoneNumberDto = {
        phoneNumber: '0912',
        token: 'token',
      };

      userModel.findOne = jest.fn().mockImplementation(() => {
        return {
          verificationCode: false,
        };
      });

      expect(
        authService.verifyPhoneNumber({ res: {} } as Request, verifyPhoneNumber),
      ).rejects.toThrow(BadRequestException);
    });

    it('should verify the phoneNumber and return access token and refresh token', async () => {
      const verifyPhoneNumber: VerifyPhoneNumberDto = {
        phoneNumber: '0912',
        token: 'token',
      };
      userModel.findOne = jest.fn().mockImplementation(() => {
        return {
          save: async () => true,
          verificationCode: verifyPhoneNumber.token,
        };
      });
      const result = await authService.verifyPhoneNumber(
        { headers: { 'user-agent': 'mozilla' } } as Request,
        verifyPhoneNumber,
      );

      expect(userModel.findOne).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalled();
      expect(authHistoryModel.create).toHaveBeenCalled();
      expect(refreshTokenModel.create).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('refreshAccessToken', () => {
    it('should throw Unauthorized exception if refresh token not found', () => {
      refreshTokenModel.findOne = jest.fn().mockResolvedValue(false);
      expect(refreshTokenModel.findOne).not.toHaveBeenCalled();
      const refreshTokenDto: RefreshAccessTokenDto = { refreshToken: 'token' };

      expect(
        authService.refreshAccessToken(
          { headers: { 'user-agent': 'mozilla' } } as Request,
          refreshTokenDto,
        ),
      ).rejects.toThrow('user has been logged out.');
    });
    it('should throw Unauthorized exception if the user not found with the given user_id', () => {
      const refreshTokenDto: RefreshAccessTokenDto = { refreshToken: 'token' };

      userModel.findById = jest.fn().mockResolvedValue(false);
      expect(
        authService.refreshAccessToken(
          { headers: { 'user-agent': 'mozilla' } } as Request,
          refreshTokenDto,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should generate access token and return it', async () => {
      const refreshTokenDto: RefreshAccessTokenDto = { refreshToken: 'token' };

      const result = await authService.refreshAccessToken(
        { headers: { 'user-agent': 'mozilla' } } as Request,
        refreshTokenDto,
      );

      expect(refreshTokenModel.findOne).toHaveBeenCalled();
      expect(userModel.findById).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken', 'token');
    });
  });

  describe('forgotPassword', () => {
    it('should throw an exception if email and phoneNumber is empty', () => {
      expect(userModel.findOne).not.toHaveBeenCalled();

      expect(authService.forgotPassword({} as Request, {})).rejects.toThrow(
        'please enter phone number or email',
      );
    });

    it('should create new forgotPassword instance and return forgotPasswordToken', async () => {
      const forgotPasswordDto: ForgotPasswordDto = { email: 'email', phoneNumber: '09' };

      const result = await authService.forgotPassword(
        { headers: { 'user-agent': 'mozilla' } } as Request,
        forgotPasswordDto,
      );
      expect(userModel.findOne).toHaveBeenCalled();
      expect(forgotPasswordModel.create).toHaveBeenCalled();
      expect(result).toHaveProperty('forgotPassword');
    });
  });

  describe('forgotPasswordVerify', () => {
    it('should throw BadRequest exception if not found forgotPassword instance with the given token', () => {
      expect(forgotPasswordModel.findOne).not.toHaveBeenCalled();
      const verifyUUid: VerifyUuidDto = { verificationCode: '' };
      forgotPasswordModel.findOne = jest.fn().mockResolvedValue(false);
      expect(authService.forgotPasswordVerify(verifyUUid)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should verify the user and return success message', async () => {
      const verifyUUid: VerifyUuidDto = { verificationCode: '' };

      const result = await authService.forgotPasswordVerify(verifyUUid);

      expect(forgotPasswordModel.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual('ok, please reset your password');
    });
  });

  describe('resetPassword', () => {
    it('should throw an exception if email and phone number is empty', () => {
      const passwordResetDto: PasswordResetDto = { password: 'password' };
      expect(userModel.findOne).not.toHaveBeenCalled();
      expect(forgotPasswordModel.findOne).not.toHaveBeenCalled();
      expect(
        authService.resetPassword(
          { headers: { 'user-agent': 'mozilla' } } as Request,
          passwordResetDto,
        ),
      ).rejects.toThrow('please enter phone number or email');
    });

    it('should throw an exception if not found user with the given user info', () => {
      const passwordResetDto: PasswordResetDto = { email: 'email', password: 'password' };
      userModel.findOne = jest.fn().mockResolvedValue(false);

      expect(
        authService.resetPassword(
          { headers: { 'user-agent': 'mozilla' } } as Request,
          passwordResetDto,
        ),
      ).rejects.toThrow('bad request');
    });

    it('should throw an exception if not found the forgot password', () => {
      const passwordResetDto: PasswordResetDto = { email: 'email', password: 'password' };
      forgotPasswordModel.findOne = jest.fn().mockResolvedValue(false);

      expect(
        authService.resetPassword(
          { headers: { 'user-agent': 'mozilla' } } as Request,
          passwordResetDto,
        ),
      ).rejects.toThrow('please verify again');
    });

    // it('should change the password and return success message', async () => {
    //   const passwordResetDto: PasswordResetDto = { email: 'email', password: 'password' };

    //   const result = await authService.resetPassword(
    //     { headers: { 'user-agent': 'mozilla' } } as Request,
    //     passwordResetDto,
    //   );

    //   userModel.findOne = jest.fn().mockImplementation(() => {
    //     return {
    //       save: async () => 'true',
    //     };
    //   });

    //   expect(userModel.findOne).toHaveBeenCalledTimes(1);
    //   expect(forgotPasswordModel.findOne).toHaveBeenCalledTimes(1);
    //   expect(result).toEqual('Password changed successfully');
    // });
  });
});
