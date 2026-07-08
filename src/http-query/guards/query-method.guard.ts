import {
  CanActivate,
  ExecutionContext,
  Injectable,
  MethodNotAllowedException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_QUERY_ROUTE } from '../decorators/query.decorator';

@Injectable()
export class QueryMethodGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isQueryRoute = this.reflector.get<boolean>(
      IS_QUERY_ROUTE,
      context.getHandler(),
    );

    // Not a @Query() route — let it through untouched,
    // same as how other guards ignore routes they don't care about.
    if (!isQueryRoute) return true;

    const request = context.switchToHttp().getRequest<Request>();

    if (request.method !== 'QUERY') {
      throw new MethodNotAllowedException(
        'This endpoint only accepts the QUERY method',
      );
    }

    const contentType = request.headers['content-type'];
    if (!contentType?.includes('application/json')) {
      throw new BadRequestException(
        'Content-Type must be application/json for QUERY requests',
      );
    }

    return true;
  }
}
