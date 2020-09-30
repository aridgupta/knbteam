import MyContext from "../types/context";
import { AuthChecker } from "type-graphql";
import { User } from "../entity/User";

export const customAuthChecker: AuthChecker<MyContext> = async (
  { root, args, context, info },
  roles
) => {
  // here you can read user from context
  // and check his permission in db against `roles` argument
  // that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"]
  if (context.uid) {
    const user = await User.findOne(context.uid);
    if (user) return true;
  }

  return false; // or false if access denied
};
