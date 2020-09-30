import { Resolver, Authorized, Mutation, Arg } from "type-graphql";
import { BoardMember } from "../../entity/BoardMember";
import { Board } from "../../entity/Board";
import { User } from "../../entity/User";
import DeletePayload from "../../types/DeletePayload";

@Resolver(BoardMember)
export class BoardMemberMutations {
  @Authorized()
  @Mutation(() => BoardMember)
  async createBoardMember(
    @Arg("boardId") boardId: string,
    @Arg("memberId") memberId: string
  ): Promise<User> {
    const bm = BoardMember.create({
      boardId,
      memberId,
      board: { id: boardId },
      member: { id: memberId },
    });
    await bm.save();

    const member = (await BoardMember.findOne({ boardId, memberId }))!.member;
    return member;
  }

  @Authorized()
  @Mutation(() => DeletePayload)
  async deleteBoardMember(
    @Arg("boardId") boardId: string,
    @Arg("memberId") memberId: string
  ): Promise<DeletePayload> {
    const board = await Board.findOne(boardId);
    if (memberId === board?.owner.id)
      throw new Error(
        "Owner of a board cannot be removed from the board members list"
      );
    const b = await BoardMember.delete({
      boardId,
      memberId,
    });
    if (b.affected === 0) throw new Error("Board/Member does not exist");
    return { id: memberId };
  }
}
