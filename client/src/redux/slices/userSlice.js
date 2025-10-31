import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchAllUsers = createAsyncThunk('users/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get('/api/admin/users');
    return data.users;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

export const toggleStatus = createAsyncThunk('users/toggleStatus', async (id, thunkAPI) => {
  try {
    const { data } = await axios.put(`/api/admin/user/${id}/status`);
    return data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload;
      })
      .addCase(toggleStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.users = state.users.map((u) => (u._id === updated._id ? updated : u));
      });
  },
});

export default userSlice.reducer;