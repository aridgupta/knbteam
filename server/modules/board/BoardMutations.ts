import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
} from "type-graphql";
import * as _ from "lodash";
import { Board } from "../../entity/Board";
import { BoardMember } from "../../entity/BoardMember";
import BoardInput from "../../types/BoardInput";
import MyContext from "../../types/context";
import DeletePayload from "../../types/DeletePayload";
import { User } from "../../entity/User";
import BoardCreateOrUpdateNotification from "../../types/BoardCreateOrUpdateNotification";
import getMembers from "../../utils/getMembers";

interface BoardPayload extends BoardCreateOrUpdateNotification {
  members: User[];
}
@Resolver(Board)
export class BoardMutations {
  @Subscription({
    topics: "CREATE_OR_UPDATE_BOARD",
    filter: ({
      payload,
      context,
    }: ResolverFilterData<BoardPayload, {}, MyContext>) =>
      payload.members.map((m) => m.id == context.uid).includes(true),
  })
  boardCreateOrUpdateNotification(
    @Root() data: BoardPayload
  ): BoardCreateOrUpdateNotification {
    return { action: data.action, board: data.board };
  }

  @Subscription({
    topics: "DELETE_BOARD",
    filter: ({
      payload,
      args,
    }: ResolverFilterData<DeletePayload, { boardId: string }, MyContext>) =>
      payload.id == args.boardId,
  })
  deleteBoardNotification(
    @Root() data: DeletePayload,
    @Arg("boardId") boardId: string
  ): DeletePayload {
    return { ...data };
  }

  @Authorized()
  @Mutation(() => Board)
  async createBoard(
    @PubSub("CREATE_OR_UPDATE_BOARD")
    createdBoardNotification: Publisher<BoardPayload>,
    @Arg("name") name: string,
    @Ctx() { uid }: MyContext
  ): Promise<Board> {
    const board = await Board.create({
      name,
      ownerId: uid,
      owner: { id: uid },
    }).save();

    await BoardMember.create({
      boardId: board.id,
      memberId: uid,
      board: { id: board.id },
      member: { id: uid },
    }).save();

    const members = await getMembers({ boardId: board.id });
    // creating payload for pubsub filter and return
    await createdBoardNotification({ members, board, action: "CREATE_BOARD" });
    return board;
  }

  @Authorized()
  @Mutation(() => Board)
  async updateBoard(
    @PubSub("CREATE_OR_UPDATE_BOARD")
    updatedBoardNotification: Publisher<BoardPayload>,
    @Arg("input") input: BoardInput
  ): Promise<Board> {
    const updateFields = _.omit(input, ["boardId"]);
    await Board.update({ id: input.boardId }, { ...updateFields });
    const board = (await Board.findOne(input.boardId)) as Board;
    const members = await getMembers({ boardId: input.boardId });
    await updatedBoardNotification({ members, board, action: "UPDATE_BOARD" });
    return board;
  }

  @Authorized()
  @Mutation(() => DeletePayload)
  async deleteBoard(
    @PubSub("DELETE_BOARD")
    deletedBoardNotification: Publisher<DeletePayload>,
    @Arg("boardId") boardId: string
  ): Promise<DeletePayload> {
    await Board.delete({ id: boardId });
    await deletedBoardNotification({ id: boardId });
    return { id: boardId };
  }
}
