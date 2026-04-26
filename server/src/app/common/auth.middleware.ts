import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Request, Response } from 'express-serve-static-core';

// Согласовано с @KvantumCEO (переписка с @NobodYYY_devvv)
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly config: ConfigService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const mock =
      this.config.get<string>('MOCK_MORTGAGE_USER_ID') ?? 'uuid123-ggwp';
    req.mortgageUserId = mock;
    next();
  }
}
