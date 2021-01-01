import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info: Error, context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;
    if (!user) throw new UnauthorizedException();
    if (user.isSuperAdmin) return true;
    if (!user.isStaff) throw new ForbiddenException();
    if (!user.roles.length) throw new ForbiddenException();

    const routePermission = roles[0];
    const hasRole = user.roles.some((role) => role.permissions.includes(routePermission));

    if (!hasRole) throw new ForbiddenException();

    return user;
  }
}
