import * as _ from "lodash";
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
import { Card } from "../../entity/Card";
import { CardAssignee } from "../../entity/CardAssignee";
import { Stack } from "../../entity/Stack";
import CardInput from "../../types/CardInput";
import MyContext from "../../types/context";
import DeletePayload from "../../types/DeletePayload";
import CardCreateOrUpdateNotification from "../../types/CardCreateOrUpdateNotification";

@Resolver()
export class CardMutations {
  @Subscription({
    topics: "CREATE_OR_UPDATE_CARD",
    filter: ({
      payload,
      args,
    }: ResolverFilterData<
      CardCreateOrUpdateNotification,
      { stackId: string },
      MyContext
    >) => payload.card.stackId == args.stackId,
  })
  cardCreateOrUpdateNotification(
    @Root() data: CardCreateOrUpdateNotification,
    @Arg("stackId") stackId: string
  ): CardCreateOrUpdateNotification {
    return data;
  }

  @Subscription({
    topics: "DELETE_CARD",
    filter: ({
      payload,
      args,
    }: ResolverFilterData<DeletePayload, { cardId: string }, MyContext>) =>
      payload.id == args.cardId,
  })
  deleteCardNotification(
    @Root() data: DeletePayload,
    @Arg("cardId") cardId: string
  ): DeletePayload {
    return { ...data };
  }

  @Authorized()
  @Mutation(() => Card)
  async createCard(
    @PubSub("CREATE_OR_UPDATE_CARD")
    createdCardNotification: Publisher<CardCreateOrUpdateNotification>,
    @Arg("stackId") stackId: string,
    @Arg("title") title: string,
    @Ctx() { uid }: MyContext
  ): Promise<Card> {
    const cardCount = await Card.count({ where: { stackId: stackId } });
    const card = Card.create({
      stackId,
      stack: { id: stackId },
      title,
      position: cardCount,
    });
    await card.save();
    await CardAssignee.create({
      cardId: card.id,
      assigneeId: uid,
      card: { id: card.id },
      assignee: { id: uid },
    }).save();
    await createdCardNotification({ action: "CREATE_CARD", card });
    return card;
  }

  @Authorized()
  @Mutation(() => Card)
  async updateCard(
    @PubSub("CREATE_OR_UPDATE_CARD")
    updatedCardNotification: Publisher<CardCreateOrUpdateNotification>,
    @Arg("input") input: CardInput
  ): Promise<Card> {
    const updateFields = _.omit(input, ["cardId", "newPosition"]);
    await Card.update({ id: input.cardId }, { ...updateFields });

    const currentCard = (await Card.findOne(input.cardId)) as Card;

    if (input.title) {
      await updatedCardNotification({
        action: "TITLE_UPDATE",
        card: currentCard,
      });
    }

    if (input.description) {
      await updatedCardNotification({
        action: "DESCRIPTION_UPDATE",
        card: currentCard,
      });
    }
    if (input.newPosition) {
      const stack = (await Stack.findOne(currentCard.stackId, {
        relations: ["cards"],
      })) as Stack;
      const allCards = stack.cards;

      allCards!.splice(input.newPosition, 0, currentCard);
      if (currentCard.position > input.newPosition) {
        allCards!.splice(currentCard.position + 1, 1);
      } else {
        allCards!.splice(currentCard.position, 1);
      }

      allCards!.map(
        async (card, index) =>
          await Card.update({ id: card.id }, { position: index })
      );
      await updatedCardNotification({
        action: "POSITION_UDATE",
        card: currentCard,
      });
    }

    return currentCard as Card;
  }

  @Authorized()
  @Mutation(() => DeletePayload)
  async deleteCard(
    @PubSub("DELETE_CARD")
    deletedCardNotification: Publisher<DeletePayload>,
    @Arg("cardId") cardId: string
  ): Promise<DeletePayload> {
    const currentCard = (await Card.findOne(cardId)) as Card;
    await Card.delete({ id: cardId });
    const stack = await Stack.findOne(currentCard.stackId, {
      relations: ["cards"],
    });
    stack!.cards!.map(async (card, index) => {
      await Card.update({ id: card.id }, { position: index });
    });

    await deletedCardNotification({ id: cardId });

    return { id: cardId };
  }
}
