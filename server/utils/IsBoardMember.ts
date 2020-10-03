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
  const { boardId, stackId, cardId, input } = args;
  let members: User[] = [];
  if (boardId || input) {
    members = await getMembers({ boardId: boardId || input.boardId });
  }
  if (stackId || input) {
    members = await getMembers({ stackId: stackId || input.stackId });
  }
  if (cardId || input) {
    members = await getMembers({ cardId: cardId || input.cardId });
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
