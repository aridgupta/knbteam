import { Field, ObjectType } from "type-graphql";
import { Stack } from "../entity/Stack";

type Action = "CREATE_STACK" | "UPDATE_STACK";

@ObjectType()
export default class StackCreateOrUpdateNotification {
  @Field()
  action!: Action;

  @Field()
  stack!: Stack;
}
