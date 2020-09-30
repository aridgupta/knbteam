import * as _ from "lodash";
import {
  Arg,
  Authorized,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
} from "type-graphql";
import { Stack } from "../../entity/Stack";
import MyContext from "../../types/context";
import DeletePayload from "../../types/DeletePayload";
import StackCreateOrUpdateNotification from "../../types/StackCreateOrUpdateNotification";
import StackInput from "../../types/StackInput";

@Resolver(Stack)
export class StackMutations {
  @Subscription({
    topics: "CREATE_OR_UPDATE_STACK",
    filter: ({
      payload,
      args,
    }: ResolverFilterData<
      StackCreateOrUpdateNotification,
      { boardId: string },
      MyContext
    >) => payload.stack.boardId == args.boardId,
  })
  stackCreateOrUpdateNotification(
    @Root() data: StackCreateOrUpdateNotification,
    @Arg("boardId") boardId: string
  ): StackCreateOrUpdateNotification {
    return data;
  }

  @Subscription({
    topics: "DELETE_STACK",
    filter: ({
      payload,
      args,
    }: ResolverFilterData<DeletePayload, { stackId: string }, MyContext>) =>
      payload.id == args.stackId,
  })
  deleteStackNotification(
    @Root() data: DeletePayload,
    @Arg("stackId") stackId: string
  ): DeletePayload {
    return { ...data };
  }

  @Authorized()
  @Mutation(() => Stack)
  async createStack(
    @PubSub("CREATE_OR_UPDATE_STACK")
    createdStackNotification: Publisher<StackCreateOrUpdateNotification>,
    @Arg("boardId") boardId: string,
    @Arg("name") name: string
  ): Promise<Stack> {
    const stack = await Stack.create({
      name,
      boardId,
      board: { id: boardId },
    }).save();

    await createdStackNotification({ action: "CREATE_STACK", stack });

    return stack;
  }

  @Authorized()
  @Mutation(() => Stack)
  async updateStack(
    @PubSub("CREATE_OR_UPDATE_STACK")
    updatedStackNotification: Publisher<StackCreateOrUpdateNotification>,
    @Arg("input") input: StackInput
  ): Promise<Stack> {
    const updateFields = _.omit(input, ["stackId"]);
    await Stack.update({ id: input.stackId }, { ...updateFields });
    const stack = (await Stack.findOne(input.stackId)) as Stack;

    await updatedStackNotification({ action: "UPDATE_STACK", stack });
    return stack;
  }

  @Authorized()
  @Mutation(() => DeletePayload)
  async deleteStack(
    @PubSub("DELETE_STACK")
    deletedStackNotification: Publisher<DeletePayload>,
    @Arg("stackId") stackId: string
  ): Promise<DeletePayload> {
    await Stack.delete({ id: stackId });
    await deletedStackNotification({ id: stackId });
    return { id: stackId };
  }
}
