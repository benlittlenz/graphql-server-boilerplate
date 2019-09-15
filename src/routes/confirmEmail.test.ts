import fetch from "node-fetch";

test("sends invalid back if bad id", async () => {
  const response = await fetch(`${process.env.TEST_HOST}/confirm/12243`);
  const text = await response.text();
  expect(text).toEqual("Invalid");
});
