import { User } from "./entity/User";
import { ResolverMap } from "./types/graphql-utils";
import * as bcrypt from "bcryptjs";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
      `Hello ${name || "World"}`,
  },
  Mutation: {
    register: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments,
    ) => {
      const hashedPasword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPasword,
      });
      await user.save()
      return true;
    },
  },
};
