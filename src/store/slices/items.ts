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
import Item from "../../models/Item";
import { selectAccessToken } from "./user";
import { RootState } from "../createReducer";

const itemsAdapter = createEntityAdapter<Item>();

export const addItem = createAsyncThunk(
  "items/addItem",
  async (item: Item, thunkApi: any) => {
    try {
      const response = await API.post("/item", item, {
        headers: {
          Authorization: `Bearer ${selectAccessToken(thunkApi.getState())}`,
        },
      });

      return response.data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);

export const fetchItems = createAsyncThunk(
  "items/fetchitems",
  async (_, thunkApi: any) => {
    const response = await API.get("/item", {
      headers: {
        Authorization: `Bearer ${selectAccessToken(thunkApi.getState())}`,
      },
    });

    return response.data;
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
