import "reflect-metadata";
import * as path from "path";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Signup } from "./modules/user/Signup";
import { Login } from "./modules/user/Login";
import MyContext from "./types/context";
import getContext from "./utils/getContext";
import { customAuthChecker } from "./utils/customAuthChecker";
import { CurrentUser } from "./modules/user/CurrentUser";
import { BoardQueries } from "./modules/board/BoardQueries";
import { BoardMutations } from "./modules/board/BoardMutations";
import { BoardMemberMutations } from "./modules/board_member/BoardMemberMutations";
import { BoardMemberQueries } from "./modules/board_member/BoardMemberQueries";
import { StackMutations } from "./modules/stack/StackMutations";
import { StackQueries } from "./modules/stack/StackQueries";
import { CardMutations } from "./modules/card/CardMutations";
import { CardQueries } from "./modules/card/CardQueries";
import { CardAssigneeMutations } from "./modules/card_assignee/CardAssigneeMutations";
import { CardAssigneeQueries } from "./modules/card_assignee/CardAssigneeQueries";
import findUser from "./utils/findUser";
require("dotenv").config();
import PostgresPubSub from "@udia/graphql-postgres-subscriptions";
import { Client } from "pg";
import { IsBoardMember } from "./utils/IsBoardMember";
import { ErrorHandler } from "./utils/ErrorHandler";

async function bootstrap() {
  await createConnection({
    name: "default",
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    entities: ["./entity/*.*"],
    migrations: ["migration/*.js"],
    cli: {
      migrationsDir: "migration"
    }
  });
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  const pubSub = new PostgresPubSub(client);
  const schema = await buildSchema({
    resolvers: [
      Signup,
      Login,
      CurrentUser,
      BoardQueries,
      BoardMutations,
      BoardMemberQueries,
      BoardMemberMutations,
      StackQueries,
      StackMutations,
      CardQueries,
      CardMutations,
      CardAssigneeMutations,
      CardAssigneeQueries
    ],
    dateScalarMode: "isoDate",
    authChecker: customAuthChecker,
    globalMiddlewares: [ErrorHandler, IsBoardMember],
    emitSchemaFile: true,
    pubSub: pubSub
  });

  const server = new ApolloServer({
    schema: schema as any,
    playground: true,
    introspection: true,
    subscriptions: {
      onConnect: (connectionParams: any) => {
        if (connectionParams.authToken) {
          return findUser(connectionParams.authToken).then((user) => {
            return { uid: user.id };
          });
        }
        throw new Error("User not authenticated");
      }
    },
    context: (ctx: MyContext) => getContext(ctx)
  });
  const PORT = (process.env.PORT as string) || 4000;
  const app = Express();

  const restRoutes = Express.Router();

  app.use(Express.static(path.join(__dirname, "client/build")));

  server.applyMiddleware({
    app,
    path: "/api",
    bodyParserConfig: {
      limit: "50mb"
    },
    cors: {
      origin: ["http://localhost:8080", "http://192.168.31.175:8080"],
      credentials: true
    }
  });

  restRoutes.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "../vue-client/build/index.html"));
  });

  app.use("*", restRoutes);

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, () => {
    console.log(
      `Server started at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `Subscription server started at ws://localhost:${PORT}${server.subscriptionsPath}`
    );
  });
}

bootstrap();
