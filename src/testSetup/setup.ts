import { startServer } from "../startServer";

export const setup = async () => {
  const app = await startServer();
  const { port } = app.address();
  process.env.TEST_HOST = `http://127.0.0.1:${port}`;
};

module.exports = async function() {
  if (!process.env.TEST_HOST) {
    await setup();
  }

  return null;
};
