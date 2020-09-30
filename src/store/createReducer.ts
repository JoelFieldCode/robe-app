import userReducer from "./slices/user";
import categoriesReducer from "./slices/categories";
import itemsReducer from "./slices/items";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  categories: categoriesReducer,
  user: userReducer,
  items: itemsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
