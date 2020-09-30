import { ObjectType, Field } from "type-graphql";
import { User } from "../../entity/User";

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user?: User;

  @Field()
  token?: string;
}
