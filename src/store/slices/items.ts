import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import API from "../../services/Api";
import Item from "../../models/Item";
import { selectAccessToken } from "./user";

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
  },
});

export default slice.reducer;
