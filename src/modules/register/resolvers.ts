import * as bcrypt from "bcryptjs";
import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";

export const resolvers: ResolverMap = {
  Query: {
    bye: () => "Hi",
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
      await user.save();
      return true;
    },
  },
};
