import gql from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: Date;
};

export type Query = {
  __typename?: 'Query';
  currentUser: User;
  boards: Array<Board>;
  boardOne: Board;
  boardMembers: Array<User>;
  stacks: Array<Stack>;
  stackOne: Stack;
  cards: Array<Card>;
  cardOne: Card;
  cardAssignees: Array<User>;
};


export type QueryBoardOneArgs = {
  id: Scalars['String'];
};


export type QueryBoardMembersArgs = {
  boardId: Scalars['String'];
};


export type QueryStacksArgs = {
  boardId: Scalars['String'];
};


export type QueryStackOneArgs = {
  stackId: Scalars['String'];
};


export type QueryCardsArgs = {
  stackId: Scalars['String'];
};


export type QueryCardOneArgs = {
  cardId: Scalars['String'];
};


export type QueryCardAssigneesArgs = {
  cardId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  createdAt: Scalars['DateTime'];
  boards: Array<Board>;
};


export type Board = {
  __typename?: 'Board';
  id: Scalars['ID'];
  name: Scalars['String'];
  ownerId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  owner: User;
  members: Array<User>;
  stacks: Array<Stack>;
};

export type Stack = {
  __typename?: 'Stack';
  id: Scalars['ID'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  boardId: Scalars['String'];
  board: Board;
  cards: Array<Card>;
};

export type Card = {
  __typename?: 'Card';
  id: Scalars['ID'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  stackId: Scalars['String'];
  stack: Stack;
  assignees: Array<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  signup: AuthResponse;
  login: AuthResponse;
  createBoard: Board;
  updateBoard: Board;
  deleteBoard: DeletePayload;
  createBoardMember: BoardMember;
  deleteBoardMember: DeletePayload;
  createStack: Stack;
  updateStack: Stack;
  deleteStack: DeletePayload;
  createCard: Card;
  updateCard: Card;
  deleteCard: DeletePayload;
  createCardAssignee: User;
  deleteCardAssignee: DeletePayload;
};


export type MutationSignupArgs = {
  data: SignupInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationCreateBoardArgs = {
  name: Scalars['String'];
};


export type MutationUpdateBoardArgs = {
  input: BoardInput;
};


export type MutationDeleteBoardArgs = {
  boardId: Scalars['String'];
};


export type MutationCreateBoardMemberArgs = {
  memberId: Scalars['String'];
  boardId: Scalars['String'];
};


export type MutationDeleteBoardMemberArgs = {
  memberId: Scalars['String'];
  boardId: Scalars['String'];
};


export type MutationCreateStackArgs = {
  name: Scalars['String'];
  boardId: Scalars['String'];
};


export type MutationUpdateStackArgs = {
  input: StackInput;
};


export type MutationDeleteStackArgs = {
  stackId: Scalars['String'];
};


export type MutationCreateCardArgs = {
  title: Scalars['String'];
  stackId: Scalars['String'];
};


export type MutationUpdateCardArgs = {
  input: CardInput;
};


export type MutationDeleteCardArgs = {
  cardId: Scalars['String'];
};


export type MutationCreateCardAssigneeArgs = {
  assigneeId: Scalars['String'];
  cardId: Scalars['String'];
};


export type MutationDeleteCardAssigneeArgs = {
  assigneeId: Scalars['String'];
  cardId: Scalars['String'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  user: User;
  token: Scalars['String'];
};

export type SignupInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type BoardInput = {
  boardId: Scalars['String'];
  name: Scalars['String'];
};

export type DeletePayload = {
  __typename?: 'DeletePayload';
  id: Scalars['String'];
};

export type BoardMember = {
  __typename?: 'BoardMember';
  boardId: Scalars['String'];
  board: Board;
  memberId: Scalars['String'];
  member: User;
  createdAt: Scalars['DateTime'];
};

export type StackInput = {
  stackId: Scalars['String'];
  name: Scalars['String'];
};

export type CardInput = {
  cardId: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  newPosition?: Maybe<Scalars['Int']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  boardCreateOrUpdateNotification: BoardCreateOrUpdateNotification;
  deleteBoardNotification: DeletePayload;
  stackCreateOrUpdateNotification: StackCreateOrUpdateNotification;
  deleteStackNotification: DeletePayload;
  cardCreateOrUpdateNotification: CardCreateOrUpdateNotification;
  deleteCardNotification: DeletePayload;
};


export type SubscriptionDeleteBoardNotificationArgs = {
  boardId: Scalars['String'];
};


export type SubscriptionStackCreateOrUpdateNotificationArgs = {
  boardId: Scalars['String'];
};


export type SubscriptionDeleteStackNotificationArgs = {
  stackId: Scalars['String'];
};


export type SubscriptionCardCreateOrUpdateNotificationArgs = {
  stackId: Scalars['String'];
};


export type SubscriptionDeleteCardNotificationArgs = {
  cardId: Scalars['String'];
};

export type BoardCreateOrUpdateNotification = {
  __typename?: 'BoardCreateOrUpdateNotification';
  action: Scalars['String'];
  board: Board;
};

export type StackCreateOrUpdateNotification = {
  __typename?: 'StackCreateOrUpdateNotification';
  action: Scalars['String'];
  stack: Stack;
};

export type CardCreateOrUpdateNotification = {
  __typename?: 'CardCreateOrUpdateNotification';
  action: Scalars['String'];
  card: Card;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'AuthResponse' }
    & Pick<AuthResponse, 'token'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name' | 'email'>
    ) }
  ) }
);

export type SignupMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignupMutation = (
  { __typename?: 'Mutation' }
  & { signup: (
    { __typename?: 'AuthResponse' }
    & Pick<AuthResponse, 'token'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name' | 'email'>
    ) }
  ) }
);

export type AllBoardsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllBoardsQuery = (
  { __typename?: 'Query' }
  & { boards: Array<(
    { __typename?: 'Board' }
    & Pick<Board, 'id' | 'name' | 'ownerId'>
  )> }
);


export const LoginDocument = gql`
    mutation login($email: String!, $password: String!) {
  login(data: {email: $email, password: $password}) {
    user {
      id
      name
      email
    }
    token
  }
}
    `;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(options: VueApolloComposable.UseMutationOptions<LoginMutation, LoginMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<LoginMutation, LoginMutationVariables>>) {
            return VueApolloComposable.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
          }
export type LoginMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<LoginMutation, LoginMutationVariables>;
export const SignupDocument = gql`
    mutation signup($name: String!, $email: String!, $password: String!) {
  signup(data: {name: $name, email: $email, password: $password}) {
    user {
      id
      name
      email
    }
    token
  }
}
    `;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useSignupMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignupMutation(options: VueApolloComposable.UseMutationOptions<SignupMutation, SignupMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<SignupMutation, SignupMutationVariables>>) {
            return VueApolloComposable.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
          }
export type SignupMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<SignupMutation, SignupMutationVariables>;
export const AllBoardsDocument = gql`
    query allBoards {
  boards {
    id
    name
    ownerId
  }
}
    `;

/**
 * __useAllBoardsQuery__
 *
 * To run a query within a Vue component, call `useAllBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllBoardsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useAllBoardsQuery(
 *   {
 *   }
 * );
 */
export function useAllBoardsQuery(options: VueApolloComposable.UseQueryOptions<AllBoardsQuery, AllBoardsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AllBoardsQuery, AllBoardsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AllBoardsQuery, AllBoardsQueryVariables>> = {}) {
            return VueApolloComposable.useQuery<AllBoardsQuery, undefined>(AllBoardsDocument, undefined, options);
          }
export type AllBoardsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<AllBoardsQuery, AllBoardsQueryVariables>;