import { HttpRequest, HttpResponse } from '@infra/http';
import { Request, Response } from 'express';

export const RouteAdapter = (handler: (req: HttpRequest) => Promise<HttpResponse>) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
      body: req.body,
      params: req.params,
      auth: (req as any).auth,
      query: req.query
    };

    const resolve = await handler(httpRequest);

    if (resolve.statusCode >= 400) {      
      return res.status(resolve.statusCode).header(resolve?.headers).json({ statusCode: resolve.statusCode, message: resolve.body });
    }

    return res.status(resolve.statusCode).header(resolve?.headers).json(resolve.body);
  }
}