import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class VeryWeaklyAuthenticatedGuard {
  canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();

    if (!user) return false;

    return true;
  }
}
