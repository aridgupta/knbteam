import { Field, ID, ObjectType, Root } from "type-graphql";
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
import { BoardMember } from "./BoardMember";
import { Stack } from "./Stack";
import { User } from "./User";

@ObjectType()
@Entity()
export class Board extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  ownerId!: string;

  @ManyToOne((type) => User, (owner) => owner, {
    eager: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  owner!: User;

  @OneToMany((type) => BoardMember, (boardMember) => boardMember.board, {
    cascade: true,
  })
  board_members!: BoardMember[];

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @OneToMany((type) => Stack, (stack) => stack.board, {
    cascade: true,
  })
  stacks?: Stack[];
}
