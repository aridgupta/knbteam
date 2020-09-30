import {
  Query,
  Ctx,
  Authorized,
  Resolver,
  FieldResolver,
  Root,
} from "type-graphql";
import MyContext from "../../types/context";
import { User } from "../../entity/User";
import { Board } from "../../entity/Board";
import { BoardMember } from "../../entity/BoardMember";

@Resolver(User)
export class CurrentUser {
  @Authorized()
  @Query(() => User)
  async currentUser(@Ctx() { uid }: MyContext): Promise<User> {
    return (await User.findOne(uid)) as User;
  }

  @FieldResolver(() => [Board])
  async boards(
    @Root() parent: User,
    @Ctx() { uid }: MyContext
  ): Promise<Board[]> {
    const bms = await BoardMember.find({
      where: { memberId: parent.id },
    });
    let boards: Board[] = [];
    const res = bms.filter((bm) => bm.memberId === uid);
    res.map((r) => boards.push(r.board));
    return boards;
  }
}
