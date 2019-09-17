import { GraphQLMiddlewareFn } from './../types/graphql-utils';

export const createMiddleware = (middlewareFn: GraphQLMiddlewareFn, resolverFn) => (
  parent: any,
  args: any,
  ctx: any,
  info: any,
) => middlewareFn(resolverFn, parent, args, ctx, info);
