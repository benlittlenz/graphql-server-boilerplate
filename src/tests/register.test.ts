import { request } from "graphql-request";
import { User } from "../entity/User";
import { startServer } from "../startServer";

import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "../modules/register/errorMessages";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = "jim2@mail.com";
const password = "133332";

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

describe("Register User", async () => {
  test("Check for duplicate emails", async () => {
    //check we can register a user
    const res = await request(getHost(), mutation(email, password));
    expect(res).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const res2: any = await request(getHost(), mutation(email, password));
    expect(res2.register).toHaveLength(1);
    expect(res2.register[0]).toEqual({
      path: "email",
      message: duplicateEmail,
    });
  });

  test("check for a bad email", async () => {
    const res3: any = await request(getHost(), mutation("b", password));
    expect(res3).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough,
        },
        {
          path: "email",
          message: invalidEmail,
        },
      ],
    });
  });

  test("catch bad password", async () => {
    const res4: any = await request(getHost(), mutation(email, "ad"));
    expect(res4).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough,
        },
      ],
    });
  });
  test("catch bad password and email", async () => {
    const res5: any = await request(getHost(), mutation("as", "ad"));
    expect(res5).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough,
        },
        {
          path: "email",
          message: invalidEmail,
        },
        {
          path: "password",
          message: passwordNotLongEnough,
        },
      ],
    });
  });
});
