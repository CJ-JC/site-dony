import axios from "axios";
import { loggedFailure, loggedInSuccess, loggedOut } from "../../reducer/auth";

export const checkAuthStatus = async (dispatch, setAuthLoading) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${BASE_URL}/api/user/protected-route`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.isAuthenticated) {
      dispatch(loggedInSuccess(response.data.user));
    } else {
      dispatch(loggedOut());
    }
  } catch (error) {
    dispatch(loggedFailure());
  } finally {
    setAuthLoading(false);
  }
};
