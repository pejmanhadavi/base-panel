import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { AuthSignUpDto } from './dto/auth-signUp.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authSignUpDto: AuthSignUpDto): Promise<string | void> {
    const { username, password } = authSignUpDto;

    try {
      await new this.userModel({
        username,
        password,
      }).save();

      return 'registered successfully';
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException('username has already exists');
    }
  }

  async signIn(authSignInDto: AuthSignInDto): Promise<object | void> {
    const { username, password } = authSignInDto;

    const user: any = await this.userModel
      .findOne({ username })
      .select('+password');

    if (!user) throw new UnauthorizedException();

    const isPassCorrect = await user.validatePassword(password);

    if (!isPassCorrect) throw new UnauthorizedException();

    // declare payload to jwt
    const payload: JwtPayload = {
      id: user._id,
    };
    // generate token
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
