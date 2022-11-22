import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator((data, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest();
  return req.user.id;
});
