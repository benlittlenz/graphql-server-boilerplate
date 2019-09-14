import * as bcrypt from "bcryptjs";
import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";
import * as yup from "yup";

import { formatError } from "../../utils/formatError";
import { duplicateEmail, emailNotLongEnough, invalidEmail, passwordNotLongEnough } from "./errorMessages";

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(invalidEmail),
  password: yup
    .string()
    .min(3, passwordNotLongEnough)
    .max(255),
});

export const resolvers: ResolverMap = {
  Query: {
    bye: () => "Hi",
  },
  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatError(err);
      }
      const { email, password } = args;
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["id"],
      });
      if (userAlreadyExists) {
        return [
          {
            path: "email",
            message: duplicateEmail,
          },
        ];
      }
      const hashedPasword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPasword,
      });
      await user.save();
      return null;
    },
  },
};
