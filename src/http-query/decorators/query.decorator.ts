import { All, applyDecorators, SetMetadata } from '@nestjs/common';

export const IS_QUERY_ROUTE = 'IS_QUERY_ROUTE';

/**
 * Route handler decorator for the HTTP QUERY method (RFC 10008).
 * Usage is identical to @Get()/@Post()/etc — no guard setup required,
 * as long as HttpQueryModule is imported once in AppModule.
 */
export function Query(path?: string): MethodDecorator {
  return applyDecorators(SetMetadata(IS_QUERY_ROUTE, true), All(path));
}
