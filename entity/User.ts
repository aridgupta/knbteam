import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { BoardMember } from "./BoardMember";
import { CardAssignee } from "./CardAssignee";
import { Board } from "./Board";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({ type: "text", unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany((type) => BoardMember, (boardMember) => boardMember.member, {
    cascade: true,
  })
  board_members?: BoardMember[];

  @OneToMany((type) => CardAssignee, (cardAssignee) => cardAssignee.assignee, {
    cascade: true,
  })
  card_assignees?: CardAssignee[];

  @OneToMany((type) => Board, (board) => board.owner, {
    cascade: true,
  })
  my_boards?: Board[];
}
