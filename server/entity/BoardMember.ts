import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Board } from "./Board";
import { User } from "./User";

@ObjectType()
@Entity()
export class BoardMember extends BaseEntity {
  @Field()
  @PrimaryColumn()
  boardId!: string;

  @Field(() => Board)
  @ManyToOne(() => Board, (board) => board.board_members, {
    eager: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    // cascade: true,
  })
  board!: Board;

  @Field()
  @PrimaryColumn()
  memberId!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.board_members, {
    eager: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    // cascade: true,
  })
  member!: User;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
