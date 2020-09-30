import { createSlice, Dispatch, Action, PayloadAction } from "@reduxjs/toolkit";
import AuthService from "../../services/AuthService";
import { RootState } from "../createReducer";

type State = { auth: boolean; accessToken: string | null };
export const slice = createSlice({
  name: "user",
  initialState: {
    auth: false,
    accessToken: null,
  },
  reducers: {
    login: (state: State, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.auth = true;
    },
  },
});

export const { login } = slice.actions;

export const loginAsync = () => (dispatch: Dispatch) => {
  AuthService.signin().then((accessToken: string) => {
    dispatch(login(accessToken));
  });
};

export const selectAccessToken = (state: RootState) => state.user.accessToken;
export const userAuth = (state: RootState) => state.user.auth;

export default slice.reducer;
