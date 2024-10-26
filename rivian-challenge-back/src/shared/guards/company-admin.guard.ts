import { ExecutionContext, Injectable } from '@nestjs/common';
import { UserType } from 'src/shared/enums';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CompanyAdminGuard {
  canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();

    try {
        return (user as User).userType === UserType.CompanyAdmin;
    } catch {}
    
    // if we got here, then something is wrong
    return false;
  }
}
