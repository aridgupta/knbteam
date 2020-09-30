import { Resolver, Authorized, Query, Arg } from "type-graphql";
import { CardAssignee } from "../../entity/CardAssignee";
import { User } from "../../entity/User";

@Resolver(CardAssignee)
export class CardAssigneeQueries {
  @Authorized()
  @Query(() => [User])
  async cardAssignees(@Arg("cardId") cardId: string): Promise<User[]> {
    const cardAssignees = await CardAssignee.find({
      where: { cardId },
    });
    let assignees: User[] = [];
    cardAssignees.map((ca) => assignees.push(ca.assignee));
    return assignees;
  }
}
