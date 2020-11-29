import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  EntityState,
  createSelector,
  EntityAdapter,
} from "@reduxjs/toolkit";
import API from "../../services/Api";
import Item, { CreateItemRequest } from "../../models/Item";
import { RootState } from "../createReducer";

const itemsAdapter = createEntityAdapter<Item>();

export const addItem = createAsyncThunk<Item, CreateItemRequest>(
  "items/add",
  async (item) => {
    try {
      const response = await API.post("/item", item);

      return response.data;
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const fetchItems = createAsyncThunk<Item[]>(
  "items/fetchAll",
  async () => {
    const response = await API.get("/item");

    return response.data;
  }
);

export const deleteItem = createAsyncThunk<number, number>(
  "items/delete",
  async (id) => {
    await API.delete(`/item/${id}`);

    return id;
  }
);

export const slice = createSlice({
  name: "items",
  initialState: itemsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      addItem.fulfilled,
      (state: EntityState<Item>, action: PayloadAction<Item>) => {
        itemsAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(
      deleteItem.fulfilled,
      (state: EntityState<Item>, action: PayloadAction<number>) => {
        itemsAdapter.removeOne(state, action.payload);
      }
    );
    builder.addCase(
      fetchItems.fulfilled,
      (state: EntityState<Item>, action: PayloadAction<Item[]>) => {
        itemsAdapter.setAll(state, action.payload);
      }
    );
  },
});

const itemsSelectors = (itemsAdapter as EntityAdapter<Item>).getSelectors<
  RootState
>((state) => state.items);

export const selectItemsByCategory = (categoryId: number | null) =>
  createSelector(itemsSelectors.selectAll, (items) => {
    return items.filter((item) => item.category_id === categoryId);
  });

export default slice.reducer;
