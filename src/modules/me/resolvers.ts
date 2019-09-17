import { createMiddleware } from "./../../utils/createMiddleware";
import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";
import middleware from "./middleware";

export const resolvers: ResolverMap = {
  Query: {
    me: createMiddleware(middleware, (_, __, { session }) =>
      User.findOne({ where: { id: session.userId } }),
    ),
  },
};
