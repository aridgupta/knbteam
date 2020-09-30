import { Field, InputType } from "type-graphql";

@InputType()
export default class StackInput {
  @Field()
  stackId!: string;

  @Field()
  name!: string;
}
