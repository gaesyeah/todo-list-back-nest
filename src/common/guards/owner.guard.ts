// common/guards/owner.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { CurrentUserDto } from 'src/auth/types/current-user.type';

interface OwnableEntity {
  userId: string;
}

interface OwnableService<T extends OwnableEntity> {
  findOneById(id: string): Promise<T | null>;
}

export function OwnerGuard<T extends OwnableEntity>(
  serviceToken: Type<OwnableService<T>>,
): Type<CanActivate> {
  @Injectable()
  class OwnerGuardMixin implements CanActivate {
    constructor(
      @Inject(serviceToken) private readonly service: OwnableService<T>,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const request = ctx.switchToHttp().getRequest<{
        params: { id: string };
        user: CurrentUserDto;
      }>();

      const entity = await this.service.findOneById(request.params.id);
      if (!entity) {
        throw new NotFoundException('Resource not found');
      }

      return entity.userId === request.user.id;
    }
  }

  return OwnerGuardMixin;
}
