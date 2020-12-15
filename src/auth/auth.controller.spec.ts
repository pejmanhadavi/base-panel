import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { AuthSignUpDto } from './dto/auth-signUp.dto';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { VerifyUuidDto } from './dto/verifyUuid.dto';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';
import { Request } from 'express';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ObjectIdDto } from '../common/dto/objectId.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { VerifyPhoneNumberDto } from './dto/verifyPhoneNumber.dto';

const objectId: ObjectIdDto = { id: '1234567890' };
const invalidId: ObjectIdDto = { id: '0' };

const mockUser = {
  id: objectId,
  email: 'reza@gmail.com',
  phoneNumber: '09123456789',
  password: 'reza1234',
};

const verificationCode = new Date().getTime();

const accessToken = 'token';

const mockRole = {
  id: objectId,
  name: 'admin',
  phoneNumber: '09122221233',
  permissions: ['permission'],
};

const mockForgotPassword = {
  user_id: '1',
  used: true,
  forgotPasswordExpires: '1',
};

const verificationUuid = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

const refreshAccessToken = 'token';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest
              .fn()
              .mockImplementation((req: any, authSignUpDto: AuthSignUpDto) => {
                const { email, phoneNumber } = authSignUpDto;

                if (!email && !phoneNumber) throw new BadRequestException();

                if (email && phoneNumber) throw new BadRequestException();

                if (email == mockUser.email || phoneNumber == mockUser.phoneNumber)
                  throw new BadRequestException('user has already exists');

                return { verificationCode };
              }),

            signIn: jest
              .fn()
              .mockImplementation((req: any, authSignInDto: AuthSignInDto) => {
                const { email, phoneNumber, password } = authSignInDto;

                if (!email && !phoneNumber) throw new BadRequestException();

                if (email && phoneNumber) throw new BadRequestException();

                if (email !== mockUser.email && phoneNumber !== mockUser.phoneNumber)
                  throw new UnauthorizedException();

                if (password !== mockUser.password) throw new UnauthorizedException();

                return { accessToken };
              }),

            getAllRoles: jest.fn().mockResolvedValue('all roles'),
            getRoleById: jest.fn().mockImplementation((id: ObjectIdDto) => {
              if (id !== mockRole.id) throw new NotFoundException();

              return mockRole;
            }),
            createRole: jest.fn().mockImplementation((createRoleDto: CreateRoleDto) => {
              const { name } = createRoleDto;

              if (name === mockRole.name) throw new BadRequestException();

              return 'role created';
            }),
            updateRole: jest
              .fn()
              .mockImplementation((id: ObjectIdDto, updateRoleDto: UpdateRoleDto) => {
                if (id !== mockRole.id) throw new NotFoundException();

                return 'role updated';
              }),
            deleteRole: jest.fn().mockImplementation((id: ObjectIdDto) => {
              if (id !== mockRole.id) throw new NotFoundException();

              return 'role deleted';
            }),
            verifyEmail: jest
              .fn()
              .mockImplementation((req: Request, verifyEmail: VerifyEmailDto) => {
                const { token } = verifyEmail;

                if (token !== verificationUuid) throw new BadRequestException();

                return 'verified';
              }),
            verifyPhoneNumber: jest
              .fn()
              .mockImplementation(
                (req: Request, verifyPhoneNumber: VerifyPhoneNumberDto) => {
                  const { token } = verifyPhoneNumber;

                  if (token !== verificationUuid) throw new BadRequestException();

                  return 'verified';
                },
              ),
            refreshAccessToken: jest
              .fn()
              .mockImplementation((refreshTokenDto: RefreshAccessTokenDto) => {
                const { refreshToken } = refreshTokenDto;

                if (refreshToken !== refreshAccessToken)
                  throw new UnauthorizedException();

                return 'refresh token';
              }),
            forgotPassword: jest
              .fn()
              .mockImplementation(
                (req: Request, forgotPasswordDto: ForgotPasswordDto) => {
                  const { email, phoneNumber } = forgotPasswordDto;
                  if (email !== mockUser.email && phoneNumber !== mockUser.phoneNumber)
                    throw new BadRequestException();

                  return 'forgot password created';
                },
              ),
            forgotPasswordVerify: jest
              .fn()
              .mockImplementation((req: Request, verifyUuidDto: VerifyUuidDto) => {
                const { verificationCode } = verifyUuidDto;

                if (verificationCode !== verificationUuid)
                  throw new BadRequestException();

                return 'verified';
              }),
            resetPassword: jest
              .fn()
              .mockImplementation((passwordResetDto: PasswordResetDto) => {
                const { email, phoneNumber } = passwordResetDto;

                if (!email && !phoneNumber) throw new BadRequestException();

                return 'password changed successfully';
              }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('SignUp', () => {
    it('should throw an exception if phoneNumber and email is empty', async () => {
      const newUser: AuthSignUpDto = {
        password: 'password',
      };
      await expect(
        authController.signUp(
          { headers: { 'user-agent': 'mozilla' } } as Request,
          newUser,
        ),
      ).rejects.toThrow();
    });

    it('should throw BadRequest exception if user already exists', async () => {
      const newUser: AuthSignUpDto = {
        phoneNumber: mockUser.phoneNumber,
        password: 'password',
      };
      await expect(
        authController.signUp(
          { headers: { 'user-agent': 'mozilla' } } as Request,
          newUser,
        ),
      ).rejects.toThrow();
    });

    it('should register the user and call signUp() method ', async () => {
      const newUser: AuthSignUpDto = {
        email: 'mockUser.email',
        password: 'password',
      };

      const req = { headers: { 'user-agent': 'mozilla' } } as Request;
      const result = await authController.signUp(req, newUser);

      expect(authService.signUp).toHaveBeenCalledTimes(1);
      expect(authService.signUp).toHaveBeenCalledWith(req, newUser);
      expect(result).toHaveProperty('verificationCode');
    });
  });

  describe('SignIn', () => {
    it('should throw an exception if email and phoneNumber is empty', () => {
      const newUser: AuthSignInDto = {
        password: 'password',
      };

      const req = { headers: { 'user-agent': 'mozilla' } } as Request;

      expect(authController.signIn(req, newUser)).rejects.toThrow(BadRequestException);
    });

    it('should throw an exception if email or phoneNumber is invalid', () => {
      const newUser: AuthSignInDto = {
        phoneNumber: '09121111111',
        password: 'password',
      };

      expect(
        authController.signIn(
          { headers: { 'user-agent': 'mozilla' } } as Request,
          newUser,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw and exception if password is invalid ', () => {
      const newUser: AuthSignInDto = {
        phoneNumber: mockUser.phoneNumber,
        password: 'invalid',
      };

      expect(
        authController.signIn(
          { headers: { 'user-agent': 'mozilla' } } as Request,
          newUser,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should call signIn() method and return access token', async () => {
      const newUser: AuthSignInDto = {
        phoneNumber: mockUser.phoneNumber,
        password: mockUser.password,
      };
      expect(authService.signIn).not.toHaveBeenCalled();

      const result = await authController.signIn(
        { headers: { 'user-agent': 'mozilla' } } as Request,
        newUser,
      );

      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledWith(newUser);
      expect(result).toHaveProperty('accessToken', accessToken);
    });
  });

  describe('getAllRoles', () => {
    it('should call getAllRoles() method and return all roles', async () => {
      expect(authService.getAllRoles).not.toHaveBeenCalled();

      const result = await authController.getAllRoles();

      expect(authService.getAllRoles).toHaveBeenCalledTimes(1);
      expect(result).toEqual('all roles');
    });
  });

  describe('getRoleById', () => {
    it('should throw NotFound exception if id is invalid', async () => {
      expect(authController.getRoleById(invalidId)).rejects.toThrow(NotFoundException);
    });

    it('should call getRoleById and return the role', async () => {
      expect(authService.getRoleById).not.toHaveBeenCalled();

      const result = await authController.getRoleById(mockRole.id);

      expect(authService.getRoleById).toHaveBeenCalledTimes(1);
      expect(authService.getRoleById).toHaveBeenCalledWith(mockRole.id);
      expect(result).toMatchObject(mockRole);
    });
  });

  describe('createRole', () => {
    it('should throw an exception if role already exists', () => {
      const role: CreateRoleDto = mockRole;

      expect(authController.createRole(role)).rejects.toThrow(BadRequestException);
    });

    it('should returns new role', async () => {
      const role: CreateRoleDto = {
        name: 'new Role',
        permissions: mockRole.permissions,
      };

      const result = await authController.createRole(role);

      expect(authService.createRole).toHaveBeenCalledTimes(1);
      expect(authService.createRole).toHaveBeenCalledWith(role);
      expect(result).toEqual('role created');
    });
  });

  describe('updateRole', () => {
    let updateRoleDto: UpdateRoleDto;

    beforeEach(() => {
      updateRoleDto = {
        name: 'new name',
      };
    });
    it('should throw an exception if the role is not found by the given id', () => {
      expect(authController.updateRole(invalidId, updateRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update the role and return the updated role and call updateRole() method', async () => {
      const result = await authController.updateRole(mockRole.id, updateRoleDto);

      expect(authService.updateRole).toHaveBeenCalledTimes(1);
      expect(authService.updateRole).toHaveBeenCalledWith(mockRole.id, updateRoleDto);
      expect(result).toEqual('role updated');
    });
  });

  describe('deleteRole', () => {
    it('should throw and exception if the role is not found by the given id', () => {
      expect(authController.deleteRole(invalidId)).rejects.toThrow(NotFoundException);
    });

    it('should delete the role ', async () => {
      const result = await authController.deleteRole(mockRole.id);

      expect(authService.deleteRole).toHaveBeenCalledWith(mockRole.id);
      expect(authService.deleteRole).toHaveBeenCalledTimes(1);
      expect(result).toEqual('role deleted');
    });
  });

  describe('verifyEmail', () => {
    it('should throw and exception if the user not found by the given verification code', () => {
      const verifyCode: VerifyEmailDto = { email: 'email', token: '12' };
      expect(authController.verifyEmail({} as Request, verifyCode)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should verify the user and return success message', async () => {
      const verifyCode: VerifyEmailDto = { email: 'email', token: verificationUuid };

      const result = await authController.verifyEmail({} as Request, verifyCode);

      expect(authService.verifyEmail).toHaveBeenCalled();
      expect(authService.verifyEmail).toHaveBeenCalledWith({} as Request, verifyCode);
      expect(result).toEqual('verified');
    });
  });

  describe('verifyPhoneNumber', () => {
    it('should throw and exception if the user not found by the given verification code', () => {
      const verifyCode: VerifyPhoneNumberDto = { phoneNumber: '12', token: '00' };
      expect(authController.verifyPhoneNumber({} as Request, verifyCode)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should verify the user and return success message', async () => {
      const verifyCode: VerifyPhoneNumberDto = {
        phoneNumber: '12',
        token: verificationUuid,
      };

      const result = await authController.verifyPhoneNumber({} as Request, verifyCode);

      expect(authService.verifyPhoneNumber).toHaveBeenCalled();
      expect(authService.verifyPhoneNumber).toHaveBeenCalledWith(
        {} as Request,
        verifyCode,
      );
      expect(result).toEqual('verified');
    });
  });

  describe('Refresh access token', () => {
    it('should throw an exception if the token not found', () => {
      const refreshToken: RefreshAccessTokenDto = {
        refreshToken: '',
      };
      expect(
        authController.refreshAccessToken(
          { headers: { 'user-agent': 'mozilla' } } as Request,
          refreshToken,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('should return the refresh token', async () => {
      const refreshToken: RefreshAccessTokenDto = {
        refreshToken: refreshAccessToken,
      };
      const result = await authController.refreshAccessToken(
        { headers: { 'user-agent': 'mozilla' } } as Request,
        refreshToken,
      );

      expect(authService.refreshAccessToken).toHaveBeenCalledTimes(1);
      expect(authService.refreshAccessToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual('refresh token');
    });
  });

  describe('forgotPassword', () => {
    it('should throw an exception if not found user with the given info', () => {
      const forgotPasswordDto: ForgotPasswordDto = { email: 'email' };
      expect(
        authController.forgotPassword({} as Request, forgotPasswordDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return forgot password token', async () => {
      const forgotPasswordDto: ForgotPasswordDto = { email: mockUser.email };

      const result = await authController.forgotPassword(
        {} as Request,
        forgotPasswordDto,
      );

      expect(authService.forgotPassword).toHaveBeenCalledTimes(1);
      expect(result).toEqual('forgot password created');
    });
  });

  // describe('forgotPasswordVerify', () => {
  //   it('should throw BadRequest exception if not found forgotPassword with the given token', () => {
  //     const verifyUuidDto: VerifyUuidDto = { verificationCode: verificationUuid };

  //     expect(
  //       authController.forgotPasswordVerify({} as Request, verifyUuidDto),
  //     ).rejects.toThrow(BadRequestException);
  //   });

  //   it('should verify and return success message', async () => {
  //     const verifyCode: VerifyUuidDto = { verificationCode: '12' };

  //     const result = await authController.forgotPasswordVerify({} as Request, verifyCode);

  //     expect(authService.forgotPasswordVerify).toHaveBeenCalledTimes(1);
  //     expect(result).toEqual('verified');
  //   });
  // });

  describe('resetPassword ', () => {
    it('should throw an exception if email and phone number is empty', () => {
      const passwordResetDto: PasswordResetDto = {
        password: 'password',
      };
      expect(
        authController.resetPassword(
          { headers: { 'user-agent': 'mozilla' } } as Request,
          passwordResetDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should change the password', async () => {
      const passwordResetDto: PasswordResetDto = {
        password: 'password',
        phoneNumber: '09123456789',
      };

      const result = await authService.resetPassword(
        { headers: { 'user-agent': 'mozilla' } } as Request,
        passwordResetDto,
      );

      expect(authService.resetPassword).toHaveBeenCalledWith(passwordResetDto);
      expect(authService.resetPassword).toHaveBeenCalledTimes(1);
      expect(result).toMatch(/password changed/);
    });
  });
});
