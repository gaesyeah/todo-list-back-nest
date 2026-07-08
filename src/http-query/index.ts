// http-query/index.ts

//! Deleting this folder? Also remove the matching exception block
//! in eslint.config.mjs (search for "src/http-query/decorators/query-params.decorator.ts")
export { Query } from './decorators/query.decorator';
export { QueryParams } from './decorators/query-params.decorator';
export { HttpQueryModule } from './http-query.module';
// QueryMethodGuard is intentionally not exported —
// it's an internal implementation detail, applied automatically.
