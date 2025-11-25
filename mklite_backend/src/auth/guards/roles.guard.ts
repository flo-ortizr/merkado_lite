import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // roles requeridos
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // si no hay roles, cualquiera entra
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // viene del jwt.strategy

    if (!user || !user.role) {
      throw new ForbiddenException('No tienes permisos');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Acceso denegado. Rol no autorizado.');
    }

    return true;
  }
}
