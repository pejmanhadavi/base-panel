import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { User } from '../../users/schemas/user.schema';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let userModel;
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn().mockResolvedValue('user'),
          },
        },
      ],
    }).compile();

    userModel = module.get(getModelToken(User.name));
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    let payload: JwtPayload;
    beforeEach(() => {
      payload = {
        id: '1',
      };
    });
    it('should throw Unauthorized exception if user not found', () => {
      expect(userModel.findById).not.toHaveBeenCalled();
      userModel.findById.mockResolvedValue(null);
      expect(jwtStrategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should validate the user and return it', async () => {
      const result = await jwtStrategy.validate(payload);

      expect(userModel.findById).toHaveBeenCalledTimes(1);
      expect(userModel.findById).toHaveBeenCalledWith(payload.id);
      expect(result).toEqual('user');
    });
  });
});
