import { createTypeormConnection } from './../../utils/createTypeormConnect';
import { Connection } from 'typeorm';
import axios from 'axios';
import { User } from '../../entity/User';


let conn: Connection;

const email = "bob12@bob.com";
const password = "fgdzgkdf";

beforeAll(async () => {
  conn = await createTypeormConnection();
  const user = await User.create({
    email,
    password,
    confirmed: true
  }).save();
});

afterAll(async () => {
  conn.close();
});

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

describe("me", async () => {
    test("cannot get user if not logged in", async () => {

    })

    test("get current user", async () => {
        await axios.post(
            process.env.TEST_HOST as string,
            {
                query: loginMutation(email, password)
            },
            {
                withCredentials: true
            }
        )
        console.log(await axios.post(process.env.TEST_HOST as string))
    })
})