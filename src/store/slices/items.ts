import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  EntityAdapter,
} from "@reduxjs/toolkit";
import API from "../../services/Api";
import Item, { CreateItemRequest } from "../../models/Item";
import { RootState } from "../createReducer";

const itemsAdapter = createEntityAdapter<Item>();

export const addItem = createAsyncThunk<Item, CreateItemRequest>(
  "items/add",
  async (createItemRequest) => {
    try {
      const response = await API.post(
        `/api/categories/${createItemRequest.category_id}/items`,
        createItemRequest
      );

      return response.data;
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const fetchCategoryItems = createAsyncThunk<Item[], number>(
  "items/fetchAll",
  (categoryId) => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const response = await API.get(`/api/categories/${categoryId}/items`);

        resolve(response.data);
      }, 1000);
    });
  }
);

export const deleteItem = createAsyncThunk<Item, Item>(
  "items/delete",
  async (item) => {
    await API.delete(`/api/categories/${item.category_id}/items/${item.id}`);

    return item;
  }
);

export const slice = createSlice({
  name: "items",
  initialState: itemsAdapter.getInitialState({
    status: "IDLE" as "LOADING" | "IDLE" | "ERROR",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addItem.fulfilled, (state, action) => {
      itemsAdapter.upsertOne(state, action.payload);
    });
    builder.addCase(fetchCategoryItems.pending, (state) => {
      state.status = "LOADING";
      itemsAdapter.removeAll(state);
    });
    builder.addCase(fetchCategoryItems.rejected, (state) => {
      state.status = "ERROR";
    });
    builder.addCase(fetchCategoryItems.fulfilled, (state, action) => {
      state.status = "IDLE";
      itemsAdapter.setAll(state, action.payload);
    });
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      itemsAdapter.removeOne(state, action.payload.id);
    });
  },
});

const itemsSelectors = (itemsAdapter as EntityAdapter<Item>).getSelectors<RootState>(
  (state) => state.items
);

export const selectItemsByCategory = (categoryId: number | null) =>
  createSelector(itemsSelectors.selectAll, (items) => {
    return items.filter((item) => item.category_id === categoryId);
  });

export const itemStatus = (state: RootState) => state.items.status;

export default slice.reducer;
