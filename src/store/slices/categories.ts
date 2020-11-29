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

const categoriesAdapter = createEntityAdapter<Category>();

export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetch",
  async () => {
    const response = await API.get("/category");

    return response.data;
  }
);

export const createCategory = createAsyncThunk<
  Category,
  { name: string; image_url: string }
>("categories/create", async (category) => {
  const response = await API.post("/category", category);

  return response.data;
});

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
    builder.addCase(
      createCategory.fulfilled,
      (state: EntityState<Category>, action: PayloadAction<Category>) => {
        categoriesAdapter.addOne(state, action.payload);
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
