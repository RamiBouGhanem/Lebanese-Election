import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const CANON = {
  citizen: 'citizen',
  representative: 'representative',
  pollinghead: 'pollinghead',
};

function normalizeRole(raw?: string) {
  if (!raw) return '';
  const s = String(raw).trim().toLowerCase();
  // Arabic → English canonical
  if (s.includes('مواطن')) return CANON.citizen;
  if (s.includes('مندوب')) return CANON.representative;
  if (s.includes('رئيس') || s.includes('قلم')) return CANON.pollinghead;

  // English fallbacks
  if (s === 'citizen') return CANON.citizen;
  if (s === 'representative') return CANON.representative;
  if (s === 'pollinghead' || s === 'polling_head' || s === 'polling-head') return CANON.pollinghead;

  return s;
}

// pollinghead inherits representative
function userSatisfies(required: string, actual: string): boolean {
  if (!required) return true;
  if (required === actual) return true;
  if (required === CANON.representative && actual === CANON.pollinghead) return true;
  return false;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles =
      this.reflector.get<string[]>('roles', context.getHandler()) ??
      this.reflector.get<string[]>('roles', context.getClass());

    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role?: string };

    const actual = normalizeRole(user?.role);
    if (!actual) return false;

    return roles.some((r) => userSatisfies(normalizeRole(r), actual));
  }
}
