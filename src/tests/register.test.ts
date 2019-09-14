import { request } from "graphql-request";
import { User } from "../entity/User";
import { startServer } from "../startServer";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = "jim@bob.com";
const password = "123abc";

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

test("Register User", async () => {
  const res = await request(getHost(), mutation);
  expect(res).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  // const res2: any = await request(getHost(), mutation);
  // expect(res2.register).toHaveLength(1);
  // expect(res2.register[0].path).toEqual("email");
});
