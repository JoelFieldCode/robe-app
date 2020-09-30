import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Category } from "../../models/Category";
import API from "../../services/Api";
import { RootState } from "../createReducer";
import { selectAccessToken } from "./user";

type State = { entities: Category[] };

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, thunkApi: any) => {
    const response = await API.get("/category", {
      headers: {
        Authorization: `Bearer ${selectAccessToken(thunkApi.getState())}`,
      },
    });

    return response.data;
  }
);

export const slice = createSlice({
  name: "categories",
  initialState: {
    entities: [],
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchCategories.fulfilled,
      (state: State, action: PayloadAction<Category[]>) => {
        state.entities = action.payload;
      }
    );
  },
  reducers: {},
});

export const selectCategories = (state: RootState) => state.categories.entities;

export default slice.reducer;
