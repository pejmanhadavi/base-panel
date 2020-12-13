import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Role, RoleDocument } from '../schemas/role.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'testSecret',
    });
  }

  async validate(payload: JwtPayload): Promise<UserDocument> {
    const user = await this.userModel
      .findById(payload.id)
      .populate('roles', 'permissions')
      .select('+isSuperAdmin');
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
