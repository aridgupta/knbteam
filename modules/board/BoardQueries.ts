import {
  Resolver,
  Query,
  Authorized,
  Ctx,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import { Board } from "../../entity/Board";
import MyContext from "../../types/context";
import { BoardMember } from "../../entity/BoardMember";
import { User } from "../../entity/User";
import { Stack } from "../../entity/Stack";
import * as _ from "lodash";

@Resolver(Board)
export class BoardQueries {
  @Authorized()
  @Query(() => [Board])
  async boards(@Ctx() { uid }: MyContext): Promise<Board[]> {
    const bms = await BoardMember.find({
      where: { memberId: uid },
    });

    let boards: Board[] = [];
    bms.map((bm) => boards.push(bm.board));

    return boards;
  }

  @Authorized()
  @Query(() => Board)
  async boardOne(@Arg("id") id: string): Promise<Board> {
    const board: Board = (await Board.findOne(id)) as Board;
    return board;
  }

  @FieldResolver(() => User)
  async owner(@Root() parent: Board): Promise<User> {
    return (await Board.findOne(parent.id))!.owner;
  }

  @FieldResolver(() => [User])
  async members(@Root() parent: Board): Promise<User[]> {
    const bms = await BoardMember.find({
      where: { board: { id: parent.id } },
    });
    let members: User[] = [];
    bms.map((bm) => members.push(bm.member));
    return members;
  }

  @FieldResolver(() => [Stack])
  async stacks(
    @Root() parent: Board,
    @Ctx() { uid }: MyContext
  ): Promise<Stack[]> {
    const board = await Board.findOne(parent.id, { relations: ["stacks"] });
    const allStacks = board!.stacks as Stack[];
    return allStacks;
  }
}
