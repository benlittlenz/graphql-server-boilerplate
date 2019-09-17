import { Resolver } from "./../../types/graphql-utils";

export default async (
  resolver: Resolver,
  parent: any,
  args: any,
  ctx: any,
  info: any,
) => {
    //middleware
  const result = await resolver(parent, args, ctx, info);
  //afterware

  return result;
};
