import { createSlice, Dispatch, Action, PayloadAction } from "@reduxjs/toolkit";
import API from "../../services/Api";
import AuthService from "../../services/AuthService";
import { RootState } from "../createReducer";

type State = { auth: boolean };
export const slice = createSlice({
  name: "user",
  initialState: {
    auth: false,
  },
  reducers: {
    login: (state: State) => {
      state.auth = true;
    },
  },
});

export const { login } = slice.actions;

export const loginAsync = () => (dispatch: Dispatch) => {
  AuthService.signin().then((accessToken: string) => {
    API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    dispatch(login());
  });
};

export const userAuth = (state: RootState) => state.user.auth;

export default slice.reducer;
