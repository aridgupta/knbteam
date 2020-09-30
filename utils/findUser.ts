import { verify } from "jsonwebtoken";
import { User } from "../entity/User";

export default async (token: string) => {
  try {
    const { id } = verify(token, "paPN6aHEGIhL^CPh$kD@S33R2YmW#MFB") as any;
    const user = (await User.findOne({ id })) as User;
    return user;
  } catch {
    throw new Error("Invalid JWT token");
  }
};
