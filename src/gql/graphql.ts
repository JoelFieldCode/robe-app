/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['Int'];
  image_url: Scalars['String'];
  name: Scalars['String'];
};

export type CreateCategoryInput = {
  image_url: Scalars['String'];
  name: Scalars['String'];
};

export type CreateItemInput = {
  category_id: Scalars['Int'];
  image_url: Scalars['String'];
  name: Scalars['String'];
  price: Scalars['Float'];
  url: Scalars['String'];
};

export type Item = {
  __typename?: 'Item';
  id: Scalars['Int'];
  image_url: Scalars['String'];
  name: Scalars['String'];
  price: Scalars['Float'];
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory?: Maybe<Category>;
  createItem?: Maybe<Item>;
  deleteCategory?: Maybe<Scalars['String']>;
  deleteItem?: Maybe<Scalars['String']>;
};


export type MutationCreateCategoryArgs = {
  input?: InputMaybe<CreateCategoryInput>;
};


export type MutationCreateItemArgs = {
  input?: InputMaybe<CreateItemInput>;
};


export type MutationDeleteCategoryArgs = {
  categoryId: Scalars['Int'];
};


export type MutationDeleteItemArgs = {
  itemId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getCategories?: Maybe<Array<Category>>;
  getCategory?: Maybe<Category>;
  getCategoryItems?: Maybe<Array<Item>>;
};


export type QueryGetCategoryArgs = {
  categoryId: Scalars['Int'];
};


export type QueryGetCategoryItemsArgs = {
  categoryId: Scalars['Int'];
};

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'Query', getCategories?: Array<{ __typename?: 'Category', name: string, id: number, image_url: string }> | null };


export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}}]}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;