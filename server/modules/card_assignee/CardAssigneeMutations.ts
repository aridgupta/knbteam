import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import { CardAssignee } from "../../entity/CardAssignee";
import { User } from "../../entity/User";
import DeletePayload from "../../types/DeletePayload";

@Resolver(CardAssignee)
export class CardAssigneeMutations {
  @Authorized()
  @Mutation(() => User)
  async createCardAssignee(
    @Arg("cardId") cardId: string,
    @Arg("assigneeId") assigneeId: string
  ): Promise<User> {
    await CardAssignee.create({
      cardId,
      assigneeId,
      card: { id: cardId },
      assignee: { id: assigneeId },
    }).save();

    const assignee = (await CardAssignee.findOne({ cardId, assigneeId }))!
      .assignee;
    return assignee;
  }

  @Authorized()
  @Mutation(() => DeletePayload)
  async deleteCardAssignee(
    @Arg("cardId") cardId: string,
    @Arg("assigneeId") assigneeId: string
  ): Promise<DeletePayload> {
    const deletedCA = await CardAssignee.delete({
      cardId,
      assigneeId,
    });
    if (deletedCA.affected === 0) throw new Error("Assignee does not exist");
    return { id: assigneeId };
  }
}
