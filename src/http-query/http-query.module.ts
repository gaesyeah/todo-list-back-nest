import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { QueryMethodGuard } from './guards/query-method.guard';

/**
 * Registers global support for the HTTP QUERY method.
 * Import this once in AppModule — after that, @Query() works
 * out of the box everywhere, just like Nest's built-in HTTP decorators.
 */
@Module({
  providers: [{ provide: APP_GUARD, useClass: QueryMethodGuard }],
})
export class HttpQueryModule {}
