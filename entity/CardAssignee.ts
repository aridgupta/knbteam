import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  PrimaryColumn,
} from "typeorm";
import { Card } from "./Card";
import { User } from "./User";

@ObjectType()
@Entity()
export class CardAssignee extends BaseEntity {
  @Field()
  @PrimaryColumn()
  cardId!: string;

  @Field(() => Card)
  @ManyToOne((type) => Card, (card) => card.card_assignees, {
    eager: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  card!: Card;

  @Field()
  @PrimaryColumn()
  assigneeId!: string;

  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.card_assignees, {
    eager: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  assignee!: User;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
