import { Prisma } from '../../generated/prisma/client';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

// Minimal delegate interface used internally.
// Prisma's $allModels extensions do not preserve delegate types,
// so this isolates the required type assertion.
interface InternalDelegate {
  findMany(args: unknown): Promise<unknown[]>;
  count(args: unknown): Promise<number>;
}

// Extracts the item type from a findMany result so PaginatedResponse<T>
// represents a page of items rather than the array itself.
type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

export function paginateExtension() {
  return Prisma.defineExtension((client) =>
    client.$extends({
      name: 'paginate',
      model: {
        $allModels: {
          async paginate<T, A extends Prisma.Args<T, 'findMany'>>(
            this: T,
            args: A & PaginationDto,
          ): Promise<
            PaginatedResponse<ArrayElement<Prisma.Result<T, A, 'findMany'>>>
          > {
            const {
              page,
              limit,
              ...findManyArgs
            }: PaginationDto & Omit<A, keyof PaginationDto> = args;

            const currentPage = page ?? 1;
            const currentLimit = limit ?? 10;
            const skip = (currentPage - 1) * currentLimit;

            const context = Prisma.getExtensionContext(
              this,
            ) as unknown as InternalDelegate;

            const [data, total] = await Promise.all([
              context.findMany({
                ...findManyArgs,
                skip,
                take: currentLimit,
              }),
              context.count({ where: findManyArgs.where }),
            ]);

            return {
              // Safe: findMany always returns an array of the inferred model type.
              data: data as ArrayElement<Prisma.Result<T, A, 'findMany'>>[],
              meta: {
                total,
                page: currentPage,
                limit: currentLimit,
                totalPages: Math.ceil(total / currentLimit),
              },
            };
          },
        },
      },
    }),
  );
}
