import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Fetch all users (admin only)
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/api/admin/users");
      return Array.isArray(data.users) ? data.users : [];
    } catch (err) {
      console.error("Fetch all users error:", err?.message || err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Toggle user status (admin only)
export const toggleStatus = createAsyncThunk(
  "users/toggleStatus",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.put(`/api/admin/user/${id}/status`);
      return data.user;
    } catch (err) {
      console.error("Toggle user status error:", err?.message || err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to toggle status"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })

      // Toggle Status
      .addCase(toggleStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.users = state.users.map((u) =>
          u._id === updated._id ? updated : u
        );
        state.loading = false;
      })
      .addCase(toggleStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to toggle status";
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;