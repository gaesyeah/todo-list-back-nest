import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserDto } from './types/current-user.type';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: CurrentUserDto }>();
    return request.user;
  },
);
