import { createTypeormConnection } from "./../../utils/createTypeormConnect";
import { User } from "./../../entity/User";
import { invalidLogin, confirmEmail } from "./errorMessages";
import { request } from "graphql-request";

const email = "jim2@mail.com";
const password = "133332";

const registerMutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

const loginExpectError = async (e: string, p: string, errMsg: string) => {
  const res = await request(
    process.env.TEST_HOST as string,
    loginMutation(e, p),
  );
  expect(res).toEqual({
    login: [
      {
        path: "email",
        message: errMsg,
      },
    ],
  });
};

beforeAll(async () => {
  await createTypeormConnection();
});

describe("login", async () => {
  test("email not found", async () => {
    await loginExpectError("adsf@bfds.com", "1234566", invalidLogin);
  });

  test("email not confirmed", async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password),
    );
    await loginExpectError(email, password, confirmEmail);

    await User.update({ email }, { confirmed: true });

    await loginExpectError(email, "ffdfgds", invalidLogin);

    const res = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password),
    );
    expect(res).toEqual({ login: null });
  });
});
