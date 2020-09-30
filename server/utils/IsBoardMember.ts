import { MiddlewareFn } from "type-graphql";
import { User } from "../entity/User";
import MyContext from "../types/context";
import getMembers from "./getMembers";

const isMember = (members: User[], uid: string) => {
  return members.map((m) => m.id === uid).includes(true);
};

export const IsBoardMember: MiddlewareFn<MyContext> = async (
  { args, context },
  next
) => {
  const { uid } = context;
  let members: User[] = [];
  if (args.boardId || args.input.boardId) {
    members = await getMembers({ boardId: args.boardId });
  } else if (args.stackId || args.input.stackId) {
    members = await getMembers({ stackId: args.stackId });
  } else if (args.cardId || args.input.cardId) {
    members = await getMembers({ cardId: args.cardId });
  } else {
    return await next();
  }
  if (members.length > 0) {
    const value = isMember(members, uid);
    if (!value) {
      throw new Error("Unauthenticated access");
    } else {
      return await next();
    }
  }
  return await next();
};
