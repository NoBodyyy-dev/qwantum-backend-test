import 'express-serve-static-core';

/**
 * userId в Request для mortgage API (согласовано с @KvantumCEO, переписка @NobodYYY_devvv).
 * Выставляется в AuthMiddleware.
 */
declare module 'express-serve-static-core' {
  interface Request {
    mortgageUserId: string;
  }
}

export {};
