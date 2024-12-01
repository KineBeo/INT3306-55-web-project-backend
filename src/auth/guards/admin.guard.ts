import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Role } from 'src/enum/role';
  import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserService } from 'src/user/user.service';
  
  @Injectable()
  export class AdminGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private userService: UserService
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (!requiredRoles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const userId = request.user?.sub;
  
      if (!userId) {
        throw new UnauthorizedException('User not authenticated');
      }
  
      // Get user and check role
      const user = await this.userService.findOne(userId);
      const hasRole = requiredRoles.some((role) => user.role === role);
  
      if (!hasRole) {
        throw new UnauthorizedException('Insufficient permissions, admin only');
      }
  
      return true;
    }
  }