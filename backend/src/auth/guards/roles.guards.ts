import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Pull the required roles from the @Roles handler metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are strictly required by a decorator, let the request pass through
    if (!requiredRoles) {
      return true;
    }

    // 2. Extract the request object populated previously by your JwtAuthGuard
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied. No user role identified.');
    }

    // 3. Evaluate whether the user's role matches the required endpoint roles
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('Access denied. Insufficient administrative clearance.');
    }

    return true;
  }
}