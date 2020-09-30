import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Board } from "./Board";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class Stack extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @Field()
  @Column()
  boardId!: string;

  @ManyToOne((type) => Board, (board) => board.stacks, {
    eager: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  board!: Board;

  @OneToMany((type) => Card, (card) => card.stack, {
    cascade: true,
  })
  cards?: Card[];
}
