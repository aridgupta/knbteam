import { InputType, Field } from "type-graphql";
import { IsEmail, Length } from "class-validator";
import { User } from "../../../entity/User";

@InputType()
export class SignupInput implements Partial<User> {
  @Field()
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(8, 32)
  password!: string;
}
