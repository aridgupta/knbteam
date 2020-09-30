import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import cookie from "cookie";
import { User } from "../../entity/User";
import { compare } from "bcrypt";
import { LoginInput } from "./InputTypes/LoginInput";
import { sign } from "jsonwebtoken";
import MyContext from "../../types/context";
import { AuthResponse } from "./AuthResponse";

@Resolver(() => AuthResponse)
export class Login {
  @Mutation(() => AuthResponse)
  async login(
    @Arg("data", () => LoginInput) { email, password }: LoginInput,
    @Ctx() { res }: MyContext
  ): Promise<AuthResponse> {
    const user = await User.findOne({ email });

    if (!user) throw new Error("User does not exist");

    const matchedPassword = await compare(password, user.password);

    if (!matchedPassword) throw new Error("Invalid password");

    const token = sign({ id: user.id }, "paPN6aHEGIhL^CPh$kD@S33R2YmW#MFB", {
      expiresIn: "1h",
    });

    const refreshToken = sign(
      { id: user.id },
      "paPN6aHEGIhL^CPh$kD@S33R2YmW#MFB",
      {
        expiresIn: "1h",
      }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("urt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
    );

    return { user, token };
  }
}
