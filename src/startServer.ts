import { redis } from "./redis";
import * as session from "express-session";
import * as connectRidis from "connect-redis";
import { GraphQLServer } from "graphql-yoga";

import { createTypeormConnection } from "./utils/createTypeormConnect";
import { confirmEmail } from "./routes/confirmEmail";
import { genSchema } from "./utils/genSchema";

const SESSION_SECRET = 'fsdasdfavfvds';
const RedisStore = connectRidis(session);

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + "://" + request.get("host"),
      session: request.session
    }),
  });

  server.express.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    }),
  );

  const cors = {
    credentials: true,
    origin: process.env.FRONTEND_HOST as string
  };

  server.express.get("/confirm/:id", confirmEmail);

  await createTypeormConnection();
  const app = await server.start({
    cors,
    port: process.env.NODE_ENV === "test" ? 0 : 4000,
  });
  console.log("Server is running on localhost:4000");

  return app;
};
