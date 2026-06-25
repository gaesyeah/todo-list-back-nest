import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserDto } from './current-user-dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: CurrentUserDto }>();
    return request.user;
  },
);
