import { InputType, Field, Int } from "type-graphql";

@InputType()
export default class CardInput {
  @Field()
  cardId!: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  newPosition?: number;
}
