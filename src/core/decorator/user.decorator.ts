import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decryptPayload } from '../helper/crypto';

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const payload =decryptPayload(request.user.data , process.env.SECRET_KEY_JWT)
    return payload;
  },
);
