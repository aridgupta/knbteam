import { ApolloError } from "apollo-server-express";
import { MiddlewareFn } from "type-graphql";

export const ErrorHandler: MiddlewareFn = async ({ args }, next) => {
  try {
    await next();
  } catch (e) {
    if (e.code == "23505") throw new ApolloError("User already exists");
    throw new ApolloError(e.message);
  }
};
