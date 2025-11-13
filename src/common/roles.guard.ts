import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    
    // Si no hay roles requeridos, permitir acceso
    if (!required?.length) return true;
    
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRole = user && required.some((r) => user.roles?.includes(r));
    
    if (!hasRole) {
      // Mensaje más descriptivo
      const rolesStr = required.join(' o ');
      throw new ForbiddenException(
        `Esta acción requiere el rol: ${rolesStr}`
      );
    }
    
    return true;
  }
}