/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation deleteCategory($categoryId: Int!) {\n    deleteCategory(categoryId: $categoryId)\n  }\n": types.DeleteCategoryDocument,
    "\n  mutation deleteItem($itemId: Int!) {\n    deleteItem(itemId: $itemId)\n  }\n": types.DeleteItemDocument,
    "\n  mutation createItem($input: CreateItemInput) {\n    createItem(input: $input) {\n      id\n    }\n  }\n": types.CreateItemDocument,
    "\n  mutation uploadImage($image: File!) {\n    uploadImage(image: $image)\n  }\n": types.UploadImageDocument,
    "\n  mutation createCategory($input: CreateCategoryInput) {\n    createCategory(input: $input) {\n      id\n      name\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  query getCategories {\n    getCategories {\n      name\n      id\n      image_url\n      itemCount\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  query getCategory($categoryId: Int!) {\n    getCategory(categoryId: $categoryId) {\n      id\n      name\n      image_url\n      itemCount\n      items {\n        id\n        name\n        image_url\n        price\n        url\n        categoryId\n      }\n    }\n  }\n": types.GetCategoryDocument,
    "\n  query getItem($itemId: Int!) {\n    getItem(itemId: $itemId) {\n      name\n      id\n      image_url\n      url\n      price\n      categoryId\n    }\n  }\n": types.GetItemDocument,
    "\n  mutation updateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n    }\n  }\n": types.UpdateCategoryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteCategory($categoryId: Int!) {\n    deleteCategory(categoryId: $categoryId)\n  }\n"): (typeof documents)["\n  mutation deleteCategory($categoryId: Int!) {\n    deleteCategory(categoryId: $categoryId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteItem($itemId: Int!) {\n    deleteItem(itemId: $itemId)\n  }\n"): (typeof documents)["\n  mutation deleteItem($itemId: Int!) {\n    deleteItem(itemId: $itemId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createItem($input: CreateItemInput) {\n    createItem(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation createItem($input: CreateItemInput) {\n    createItem(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation uploadImage($image: File!) {\n    uploadImage(image: $image)\n  }\n"): (typeof documents)["\n  mutation uploadImage($image: File!) {\n    uploadImage(image: $image)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCategory($input: CreateCategoryInput) {\n    createCategory(input: $input) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createCategory($input: CreateCategoryInput) {\n    createCategory(input: $input) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCategories {\n    getCategories {\n      name\n      id\n      image_url\n      itemCount\n    }\n  }\n"): (typeof documents)["\n  query getCategories {\n    getCategories {\n      name\n      id\n      image_url\n      itemCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCategory($categoryId: Int!) {\n    getCategory(categoryId: $categoryId) {\n      id\n      name\n      image_url\n      itemCount\n      items {\n        id\n        name\n        image_url\n        price\n        url\n        categoryId\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCategory($categoryId: Int!) {\n    getCategory(categoryId: $categoryId) {\n      id\n      name\n      image_url\n      itemCount\n      items {\n        id\n        name\n        image_url\n        price\n        url\n        categoryId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getItem($itemId: Int!) {\n    getItem(itemId: $itemId) {\n      name\n      id\n      image_url\n      url\n      price\n      categoryId\n    }\n  }\n"): (typeof documents)["\n  query getItem($itemId: Int!) {\n    getItem(itemId: $itemId) {\n      name\n      id\n      image_url\n      url\n      price\n      categoryId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation updateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;