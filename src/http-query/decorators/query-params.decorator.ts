// http-query/decorators/query-params.decorator.ts
//! Bridge to Nest's original Query, renamed to QueryParams to avoid
//! clashing with our custom Query (see ./query.decorator.ts).
//? Only file allowed to import Query from '@nestjs/common' (see eslint.config.mjs)
export { Query as QueryParams } from '@nestjs/common';
