import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { Category } from "../../models/Category";
import API from "../../services/Api";
import { RootState } from "../createReducer";
import { selectAccessToken } from "./user";

const categoriesAdapter = createEntityAdapter<Category>();

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
  initialState: categoriesAdapter.getInitialState(),
  extraReducers: (builder) => {
    builder.addCase(
      fetchCategories.fulfilled,
      (state: EntityState<Category>, action: PayloadAction<Category[]>) => {
        categoriesAdapter.setAll(state, action.payload);
      }
    );
  },
  reducers: {},
});

const categoriesSelectors = categoriesAdapter.getSelectors<RootState>(
  (state) => state.categories
);

export const selectCategories = (state: RootState) =>
  categoriesSelectors.selectAll(state);

export default slice.reducer;
