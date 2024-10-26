import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { decodeVeryWeakAuthHeader } from 'src/shared/helpers';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthUserMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async use(request: Request, res: Response, next: Function) {
    const authHeader = request.headers.authorization;

    if (authHeader) {
      try {
        const { email, id } = decodeVeryWeakAuthHeader(authHeader);
        const user = await this.userRepo.findOneOrFail({
          where: {
            email,
            id: +id
          }
        });

        request['user'] = user;
      } catch {}
    }

    next();
  }
}
