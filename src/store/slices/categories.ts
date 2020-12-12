import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { Category } from "../../models/Category";
import API from "../../services/Api";
import { RootState } from "../createReducer";
import { deleteItem } from "./items";

const categoriesAdapter = createEntityAdapter<Category>();

export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetch",
  async () => {
    const response = await API.get("/category");

    return response.data;
  }
);

export const fetchCategoryById = createAsyncThunk<Category, number>(
  "category/fetchById",
  async (categoryId) => {
    const response = await API.get(`/category/${categoryId}`);

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

export const deleteCategory = createAsyncThunk<number, number>(
  "categories/delete",
  async (id) => {
    await API.delete(`/category/${id}`);

    return id;
  }
);

export const slice = createSlice({
  name: "categories",
  initialState: categoriesAdapter.getInitialState(),
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      categoriesAdapter.setAll(state, action.payload);
    });
    builder.addCase(fetchCategoryById.fulfilled, (state, action) => {
      categoriesAdapter.upsertOne(state, action.payload);
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      categoriesAdapter.removeOne(state, action.payload);
    });
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      const category = categoriesAdapter
        .getSelectors()
        .selectById(state, action.payload.category_id);
      if (category) {
        categoriesAdapter.updateOne(state, {
          id: category.id,
          changes: {
            item_count: category.item_count - 1,
          },
        });
      }
    });
  },
  reducers: {},
});

const categoriesSelectors = categoriesAdapter.getSelectors<RootState>(
  (state) => state.categories
);

export const selectCategories = (state: RootState) =>
  categoriesSelectors.selectAll(state);

export default slice.reducer;
