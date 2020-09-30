import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/Api";
import Item from "../../models/Item";
import { selectAccessToken } from "./user";

type State = { entities: Item[] };

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
  initialState: {
    entities: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      addItem.fulfilled,
      (state: State, action: PayloadAction<Item[]>) => {
        state.entities = [];
      }
    );
  },
});

export default slice.reducer;
