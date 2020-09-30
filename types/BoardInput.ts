import { Field, InputType } from "type-graphql";

@InputType()
export default class BoardInput {
  @Field()
  boardId!: string;

  @Field()
  name!: string;
}
