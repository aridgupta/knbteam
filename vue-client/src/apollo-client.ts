import {
  HttpLink,
  ApolloLink,
  split,
  concat,
  ApolloClient,
  InMemoryCache,
} from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const httpLink = new HttpLink({
  uri: "http://192.168.31.175:4000/api",
});

const wsLink = new WebSocketLink({
  uri: "ws://192.168.31.175:4000/graphql",
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: () => ({
      authToken: `${localStorage.getItem("jtk") || ""}`,
    }),
  },
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem("jtk");
  if (!token) return forward(operation);
  operation.setContext({
    headers: {
      authorization: `Bearer ${localStorage.getItem("jtk") || ""}`,
    },
  });

  return forward(operation);
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  concat(authMiddleware, httpLink)
);

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
  connectToDevTools: true,
});
