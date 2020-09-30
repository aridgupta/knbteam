import { Field, ObjectType } from "type-graphql";
import { Board } from "../entity/Board";

type Action = "CREATE_BOARD" | "UPDATE_BOARD" | "DELETE_BOARD";

@ObjectType()
export default class BoardCreateOrUpdateNotification {
  @Field()
  action!: Action;

  @Field()
  board!: Board;
}
