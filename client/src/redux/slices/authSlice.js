import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { clearCart } from "./cartSlice";

// Thunk: Fetch logged-in user's profile
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/api/users/profile");
      return data.user;
    } catch (err) {
      console.error("Profile fetch error:", err?.message || err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Profile fetch failed"
      );
    }
  }
);

const initialState = {
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("token") || null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;

      try {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("cartUserId", user._id);
      } catch {
        console.warn("Unable to persist user data in localStorage.");
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        localStorage.removeItem("cartUserId");
      } catch {
        console.warn("Unable to clear localStorage during logout.");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;

        try {
          localStorage.setItem("user", JSON.stringify(action.payload));
          localStorage.setItem("cartUserId", action.payload._id);
        } catch {
          console.warn("Unable to persist profile data in localStorage.");
        }
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;

        try {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("cart");
          localStorage.removeItem("cartUserId");
        } catch {
          console.warn("Unable to clear localStorage after profile rejection.");
        }
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;