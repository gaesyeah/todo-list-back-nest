import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CurrentUserDto } from 'src/auth/types/current-user.type';

interface OwnableEntity {
  userId: string;
}

interface PrismaDelegate<T extends OwnableEntity> {
  findUnique(args: { where: { id: string } }): Promise<T | null>;
}

export function OwnerGuard<T extends OwnableEntity>(
  getDelegate: (prisma: PrismaService) => PrismaDelegate<T>,
): Type<CanActivate> {
  @Injectable()
  class OwnerGuardMixin implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const request = ctx.switchToHttp().getRequest<{
        params: { id: string };
        user: CurrentUserDto;
      }>();

      const entity = await getDelegate(this.prisma).findUnique({
        where: { id: request.params.id },
      });

      if (!entity) {
        throw new NotFoundException('Resource not found');
      }

      return entity.userId === request.user.id;
    }
  }

  return OwnerGuardMixin;
}
