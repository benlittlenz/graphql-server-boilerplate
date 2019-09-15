import * as Redis from "ioredis";
import fetch from "node-fetch";
import { User } from "../entity/User";
import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeormConnection } from "./createTypeormConnect";

let userId = "";
let redis = new Redis();

beforeAll(async () => {
  await createTypeormConnection();
  const user = await User.create({
    email: "bob12@bob.com",
    password: "fgdzgkdf",
  }).save();
  userId = user.id;
});
test("Make sure confirms user and clear key in redis", async () => {
  const url = await createConfirmEmailLink(
    process.env.TEST_HOST as string,
    userId as string,
    new Redis(),
  );

  const response = await fetch(url);
  const text = await response.text();
  expect(text).toEqual("ok");
  const user = await User.findOne({ where: { id: userId } });
  if (user) {
    expect(user.confirmed).toBeTruthy();
  }
  const chunks = url.split("/");
  const key = chunks[chunks.length - 1];
  const value = await redis.get(key);
  expect(value).toBeNull();
});
