export class HTTPResponse {
  static readonly OK = 200;
  static readonly CREATED = 201;
  static readonly NO_CONTENT = 204;

  static readonly BAD_REQUEST = 400;
  static readonly UNAUTHORIZED = 401;
  static readonly FORBIDDEN = 403;
  static readonly NOT_FOUND = 404;
  static readonly METHOD_NOT_ALLOWED = 405;
  static readonly CONFLICT = 409;
  static readonly UNPROCESSABLE_ENTITY = 422;
  static readonly TOO_MANY_REQUESTS = 429;

  static readonly INTERNAL_SERVER_ERROR = 500;
  static readonly NOT_IMPLEMENTED = 501;
  static readonly BAD_GATEWAY = 502;
  static readonly SERVICE_UNAVAILABLE = 503;

  static readonly messages: Readonly<Record<number, string>> = {
    [HTTPResponse.OK]: 'OK',
    [HTTPResponse.CREATED]: 'Created',
    [HTTPResponse.NO_CONTENT]: 'No Content',

    [HTTPResponse.BAD_REQUEST]: 'Bad Request',
    [HTTPResponse.UNAUTHORIZED]: 'Unauthorized',
    [HTTPResponse.FORBIDDEN]: 'Forbidden',
    [HTTPResponse.NOT_FOUND]: 'Not Found',
    [HTTPResponse.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
    [HTTPResponse.CONFLICT]: 'Conflict',
    [HTTPResponse.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
    [HTTPResponse.TOO_MANY_REQUESTS]: 'Too Many Requests',

    [HTTPResponse.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    [HTTPResponse.NOT_IMPLEMENTED]: 'Not Implemented',
    [HTTPResponse.BAD_GATEWAY]: 'Bad Gateway',
    [HTTPResponse.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  };

  static text(status: number): string {
    return this.messages[status] ?? 'Unknown Status';
  }
}

import {Request, Response} from 'express';

export class ApiResponse {
  static success(
    res: Response,
    message = 'Success',
    data: unknown = [],
    status = 200,
    additional: Record<string, unknown> = {}
  ): Response {
    status = status >= 400 ? 200 : status;

    return res.status(status).json({
      status,
      message,
      data,
      ...additional,
    });
  }

  static fail(
    req: Request,
    res: Response,
    detail: string,
    errors: Record<string, unknown> = {},
    status = 400,
    title?: string
  ): Response {
    status = status >= 400 ? status : 500;

    return res
      .status(status)
      .type('application/problem+json')
      .json({
        type: `https://httpstatuses.io/${status}`,
        title: title ?? HTTPResponse.text(status),
        status,
        detail,
        instance: req.originalUrl,
        ...errors,
      });
  }
}
