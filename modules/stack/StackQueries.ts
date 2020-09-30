import {
  Resolver,
  Authorized,
  Query,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import { Stack } from "../../entity/Stack";
import * as _ from "lodash";
import { Card } from "../../entity/Card";
import { Board } from "../../entity/Board";

@Resolver(Stack)
export class StackQueries {
  @Authorized()
  @Query(() => [Stack])
  async stacks(@Arg("boardId") boardId: string): Promise<Stack[]> {
    const stacks = await Stack.find({ where: { boardId } });
    return stacks;
  }

  @Authorized()
  @Query(() => Stack)
  async stackOne(@Arg("stackId") stackId: string): Promise<Stack> {
    return (await Stack.findOne(stackId)) as Stack;
  }

  @FieldResolver(() => Board)
  async board(@Root() parent: Stack): Promise<Board> {
    return (await Stack.findOne(parent.id))!.board;
  }

  @FieldResolver(() => [Card])
  async cards(@Root() parent: Stack): Promise<Card[]> {
    const stack = await Stack.findOne(parent.id, { relations: ["cards"] });
    const allCards = stack!.cards;
    return _.orderBy(allCards, (card) => card.position);
  }
}
