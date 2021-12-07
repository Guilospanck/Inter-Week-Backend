import { Response, NextFunction } from 'express';
import { HttpRequest } from '@infra/http';
import { BaseMiddleware } from '@interfaces/middlewares/base_middleware';

export const MiddlewareAdapt = (middleware: BaseMiddleware, ...params: any[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
      body: req.body,
      auth: req.auth
    };

    const resolve = await middleware.handler(httpRequest, params);

    if (resolve.statusCode >= 400) {
      return res.status(resolve.statusCode).header(resolve?.headers).json({ statusCode: resolve.statusCode, message: resolve.body });
    }

    if (resolve.statusCode === 299) {
      if (req.auth === undefined) {
        req.auth = resolve.body;
      } else {
        req.auth = {
          ...req.auth,
          authorization: resolve.body
        };
      }
    }

    return next();
  }
}