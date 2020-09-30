import { BoardMember } from "../entity/BoardMember";
import { User } from "../entity/User";
import { Stack } from "../entity/Stack";
import { Card } from "../entity/Card";

interface ValueOptions {
  boardId?: string;
  stackId?: string;
  cardId?: string;
}

export default async (options: ValueOptions): Promise<User[]> => {
  let members: User[] = [];
  if (options.boardId) {
    const bms = await BoardMember.find({
      where: { board: { id: options.boardId! } },
    });
    bms.map((bm) => members.push(bm.member));
  } else if (options.stackId) {
    const thisStack = await Stack.findOne(options.stackId!, {
      relations: ["board"],
    });
    const bms = await BoardMember.find({
      where: { board: { id: thisStack!.board.id } },
    });
    bms.map((bm) => members.push(bm.member));
  } else if (options.cardId) {
    const thisCard = await Card.findOne(options.cardId, {
      relations: ["stack"],
    });
    const bms = await BoardMember.find({
      where: {
        board: {
          id: thisCard!.stack.board.id,
        },
      },
    });
    bms.map((bm) => members.push(bm.member));
  }
  return members;
};
