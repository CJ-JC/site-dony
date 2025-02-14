import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

const decodedToken = token ? jwtDecode(token) : null;
const isTokenValid = decodedToken && decodedToken.exp * 1000 > Date.now();

const initialState = {
  isLoggedIn: isTokenValid,
  user: isTokenValid ? decodedToken : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedInSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    loggedOut(state) {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem("token");
    },
    loggedFailure(state) {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loggedFailure, loggedInSuccess, loggedOut } = authSlice.actions;
export default authSlice.reducer;
