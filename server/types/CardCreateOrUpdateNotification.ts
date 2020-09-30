import { Field, ObjectType } from "type-graphql";
import { Card } from "../entity/Card";

type Action =
  | "CREATE_CARD"
  | "TITLE_UPDATE"
  | "DESCRIPTION_UPDATE"
  | "POSITION_UDATE";

@ObjectType()
export default class CardCreateOrUpdateNotification {
  @Field()
  action!: Action;

  @Field()
  card!: Card;
}
