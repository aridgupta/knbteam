import {
  Resolver,
  Authorized,
  Query,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import { Card } from "../../entity/Card";
import * as _ from "lodash";
import { User } from "../../entity/User";
import { CardAssignee } from "../../entity/CardAssignee";
import { Stack } from "../../entity/Stack";

@Resolver(Card)
export class CardQueries {
  @Authorized()
  @Query(() => [Card])
  async cards(@Arg("stackId") stackId: string): Promise<Card[]> {
    const allCards = await Card.find({ where: { stackId } });
    return _.orderBy(allCards, (card) => card.position) as Card[];
  }

  @Authorized()
  @Query(() => Card)
  async cardOne(@Arg("cardId") cardId: string): Promise<Card> {
    return (await Card.findOne(cardId)) as Card;
  }

  @FieldResolver(() => Stack)
  async stack(@Root() parent: Card): Promise<Stack> {
    return (await Card.findOne(parent.id))!.stack;
  }

  @FieldResolver(() => [User])
  async assignees(@Root() parent: Card): Promise<User[]> {
    const cardAssignees = await CardAssignee.find({
      where: { card: { id: parent.id } },
    });
    let assignees: User[] = [];
    cardAssignees.map((ca) => assignees.push(ca.assignee));
    return assignees;
  }
}
