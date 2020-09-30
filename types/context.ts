import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

export default interface MyContext extends ExpressContext {
  uid: string;
}
