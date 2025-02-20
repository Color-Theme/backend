import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, body, rawHeaders, ip } = req;
    const start = Date.now();
    const requestId = uuidv4();

    res.on('finish', () => {
      const { statusCode } = res;
      const end = Date.now();
      const duration = end - start;

      if (statusCode >= 400) {
        this.logger.error(
          `${requestId}: ${ip} - ${method} - ${originalUrl} - ${statusCode} - ${duration}ms`,
        );
        // this.logger.error(`${requestId}: ${rawHeaders}`);
        this.logger.error(`${requestId}: ${JSON.stringify(body, null, '\t')}`);
      } else {
        this.logger.debug(
          `${requestId}: ${ip} - ${method} - ${originalUrl} - ${statusCode} - ${duration}ms`,
        );
        // this.logger.debug(`${requestId}: ${rawHeaders}`);
        this.logger.debug(`${requestId}: ${JSON.stringify(body, null, '\t')}`);
      }
    });

    next();
  }
}
