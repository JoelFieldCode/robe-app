import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./createReducer";

export default configureStore({ reducer: rootReducer });
