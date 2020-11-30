import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { promises } from 'fs';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new UnauthorizedException();
    if (user.isSuperAdmin) return true;

    if (!user.isStaff) throw new ForbiddenException();

    const routePermission = roles[0];
    const userRoles = user.roles;

    const hasRole: boolean = await this.doesUserHasPermission(
      userRoles,
      routePermission,
    );
    return hasRole;
  }

  doesUserHasPermission(userRoles, routePermission): Promise<boolean> {
    return new Promise((resolve, reject) => {
      userRoles.some(async (userRole) => {
        const role = await this.roleModel.findById(userRole);
        const { permissions } = role;
        resolve(permissions.includes(routePermission));
      });
    });
  }
}
