import { Resolver, Authorized, Query, Arg } from "type-graphql";
import { BoardMember } from "../../entity/BoardMember";
import { User } from "../../entity/User";

@Resolver()
export class BoardMemberQueries {
  @Authorized()
  @Query(() => [User])
  async boardMembers(@Arg("boardId") boardId: string): Promise<User[]> {
    const bms = await BoardMember.find({
      where: { boardId },
    });
    const members: User[] = [];
    bms.map((bm) => members.push(bm.member));
    return members;
  }
}
