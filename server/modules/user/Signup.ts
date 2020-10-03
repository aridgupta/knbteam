import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import cookie from "cookie";
import { User } from "../../entity/User";
import { hash } from "bcrypt";
import { SignupInput } from "./InputTypes/SignupInput";
import { AuthResponse } from "./AuthResponse";
import MyContext from "../../types/context";
import { sign } from "jsonwebtoken";

@Resolver(() => AuthResponse)
export class Signup {
  @Mutation(() => AuthResponse)
  async signup(
    @Arg("data", () => SignupInput) { name, email, password }: SignupInput,
    @Ctx() { res }: MyContext
  ): Promise<AuthResponse> {
    if (password.length < 8)
      throw new Error("Password must be of at least 8 characters");
    const hashedPassword = await hash(password, 11);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    }).save();

    const token = sign({ id: user.id }, "paPN6aHEGIhL^CPh$kD@S33R2YmW#MFB", {
      expiresIn: "1h"
    });

    const refreshToken = sign(
      { id: user.id },
      "paPN6aHEGIhL^CPh$kD@S33R2YmW#MFB",
      {
        expiresIn: "1h"
      }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("urt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60
      })
    );

    return { user, token };
  }
}
