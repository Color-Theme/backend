import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-api-key']
    if (!key) {
      throw new ForbiddenException('API key is missing.');
    }
    if (key !== process.env.APP_API_KEY) {
      throw new ForbiddenException('Invalid API key.');
    }

    return true
  }
}