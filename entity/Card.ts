import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CardAssignee } from "./CardAssignee";
import { Stack } from "./Stack";

@ObjectType()
@Entity()
export class Card extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  title!: string;

  @Field({ nullable: true })
  @Column({ type: "text" })
  description?: string;

  @Field(() => Int)
  @Column()
  position!: number;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @Field()
  @Column()
  stackId!: string;

  @ManyToOne((type) => Stack, (stack) => stack.cards, {
    eager: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  stack!: Stack;

  @OneToMany((type) => CardAssignee, (cardAssignee) => cardAssignee.card, {
    cascade: true,
  })
  card_assignees?: CardAssignee[];
}
