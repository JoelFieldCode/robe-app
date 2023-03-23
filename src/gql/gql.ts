/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query getCategories {\n    getCategories {\n      name\n      id\n      image_url\n    }\n  }\n": types.GetCategoriesDocument,
};

export function graphql(source: "\n  query getCategories {\n    getCategories {\n      name\n      id\n      image_url\n    }\n  }\n"): (typeof documents)["\n  query getCategories {\n    getCategories {\n      name\n      id\n      image_url\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;