import { ObjectType, Field } from "type-graphql";

@ObjectType()
export default class DeletePayload {
  @Field()
  id!: string;
}
